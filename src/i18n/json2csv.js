import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置要处理的 JSON 文件
const sourceDir = path.resolve(__dirname, '../i18n-res');
const targetFile = path.resolve(__dirname, './resource.csv');
const langs = ['en', 'zh', 'vi']; // 可扩展 ['en', 'zh', 'jp', 'fr', ...]

// 递归展开 JSON 对象，生成扁平化 key
function flattenJSON(obj, prefix = '') {
  let result = {};
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenJSON(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }
  return result;
}

// 读取所有语言文件
let langData = {};
langs.forEach((lang) => {
  const filePath = path.join(sourceDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    // process.exit(1);
  }
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  langData[lang] = flattenJSON(json);
});

// 收集所有 key
const allKeys = new Set();
Object.values(langData).forEach((data) => {
  Object.keys(data).forEach((k) => allKeys.add(k));
});

// 生成 CSV 内容
let csv = ['key,' + langs.join(',')];
allKeys.forEach((key) => {
  const row = [key];
  langs.forEach((lang) => {
    row.push(`"${(langData[lang][key] || '').replace(/"/g, '""')}"`); // 转义双引号
  });
  csv.push(row.join(','));
});

// 保存到文件
fs.writeFileSync(targetFile, csv.join('\n'), 'utf8');
console.log(`✅ 已生成 CSV: ${targetFile}`);
