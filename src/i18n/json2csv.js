// i18n/json2csv.js
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { stringify } from 'csv-stringify/sync';
import { availableLanguages } from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../i18n-res');
const targetFile = path.resolve(__dirname, './resource.csv');

const langs = availableLanguages;

// 递归展开 JSON 对象
function flattenJSON(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const newKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flattenJSON(val, newKey));
    } else {
      // 对于数组或原始类型也作为最终值处理（数组会被 toString）
      result[newKey] = val === undefined || val === null ? '' : String(val);
    }
  }
  return result;
}

// 读取所有语言文件
let langData = {};
langs.forEach((lang) => {
  const filePath = path.join(sourceDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ 文件不存在，跳过: ${filePath}`);
    langData[lang] = {};
    return;
  }
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  langData[lang] = flattenJSON(json);
});

// 收集所有 key
const allKeys = new Set();
Object.values(langData).forEach((data) => {
  Object.keys(data).forEach(k => allKeys.add(k));
});
const allKeysArray = Array.from(allKeys);

// 生成 records（数组的数组），第一行为 header
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

// 使用 csv-stringify 生成 CSV
const csv = stringify(records);

fs.writeFileSync(targetFile, csv, 'utf8');
console.log(`✅ 已生成 CSV: ${targetFile}`);
