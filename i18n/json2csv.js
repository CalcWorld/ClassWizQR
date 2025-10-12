import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { stringify } from 'csv-stringify/sync';
import { availableLanguages } from '../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../src/i18n-res');
const targetFile = path.resolve(__dirname, './resource.csv');

const langs = availableLanguages;

function flattenJSON(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const newKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenJSON(val, newKey));
    } else {
      result[newKey] = val === undefined || val === null ? '' : String(val);
    }
  }
  return result;
}

let langData = {};
langs.forEach((lang) => {
  const filePath = path.join(sourceDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`not found: ${filePath}`);
    langData[lang] = {};
    return;
  }
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  langData[lang] = flattenJSON(json);
});

const allKeys = new Set();
Object.values(langData).forEach((data) => {
  Object.keys(data).forEach(k => allKeys.add(k));
});
const allKeysArray = Array.from(allKeys);

const header = ['key', ...langs];
const records = [header];

allKeysArray.forEach((key) => {
  const row = [key];
  langs.forEach(lang => {
    const v = langData[lang] && langData[lang][key] !== undefined ? langData[lang][key] : '';
    row.push(v);
  });
  records.push(row);
});

const csv = stringify(records);

fs.writeFileSync(targetFile, csv, 'utf8');
console.log(`generated ${targetFile}`);
