import { getResource, loadResource, tt } from '../src/utils.js';
import enI18n from '../src/i18n-res/en.json' with { type: 'json' };

loadResource('en', enI18n);
console.log(globalThis.i18nResource);
console.log(getResource('en'));
console.log(tt('menu-info.X1'));
console.log(tt('menu-info.Xe'));
console.log(tt('menu-info.X1.aa'));
