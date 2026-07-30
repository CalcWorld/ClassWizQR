import { getModelProfile } from '../model/index.js';
import { ASCII_PAGE_DEFINITIONS } from './registry.js';

import { removeLatex } from './helper.js';

const applyMap = (page, map, type, convertUnicode) => {
  for (const key in map) {
    const entry = map[key];
    if (Array.isArray(entry)) {
      page[key] = entry[type === 'unicode' ? 1 : 0];
    } else {
      page[key] = type === 'unicode' && convertUnicode
        ? removeLatex(entry)
        : entry;
    }
  }
};

const completePage = (page) => Object.fromEntries(
  Array.from({ length: 256 }, (_, code) => {
    const key = code.toString(16).toUpperCase().padStart(2, '0');
    return [key, page[key] ?? ''];
  }),
);

const buildAsciiTable = (context) => {
  const table = {};

  for (const definition of ASCII_PAGE_DEFINITIONS) {
    const page = {};
    applyMap(
      page,
      definition.base,
      context.type,
      definition.convertUnicode,
    );

    for (const patch of definition.patches ?? []) {
      if (patch.when(context)) {
        applyMap(
          page,
          patch.map,
          context.type,
          patch.convertUnicode,
        );
      }
    }

    for (const [key, value] of Object.entries(completePage(page))) {
      table[`${definition.prefix}${key}`] = value;
    }
  }

  return table;
};

export class AsciiTable {
  constructor(modelType, modelId) {
    this.modelType = modelType;
    this.modelId = modelId;
    this.profile = getModelProfile(modelType, modelId);
  }

  /**
   *
   * @param {'latex'|'unicode'} [type='latex']
   */
  get(type = 'latex') {
    return buildAsciiTable({
      type,
      modelType: this.modelType,
      profile: this.profile,
    });
  }
}
