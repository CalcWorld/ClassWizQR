// i18n/csv2json.js
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.resolve(__dirname, './resource.csv');
const targetDir = path.resolve(__dirname, '../i18n-res');

// 命令行参数：node i18n/csv2json.js [production]
const arg = process.argv[2] || '';
const isProd = arg === 'production' || false;

if (!fs.existsSync(sourceFile)) {
  console.error(`❌ 未找到 resource.csv: ${sourceFile}`);
  process.exit(1);
}

function timestamp() {
  const d = new Date();
  const pad = n => n.toString().padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function setNested(obj, key, value) {
  const parts = key.split('.');
  let cur = obj;
  parts.forEach((p, idx) => {
    if (idx === parts.length - 1) {
      cur[p] = value;
    } else {
      if (cur[p] === undefined || typeof cur[p] !== 'object' || cur[p] === null) {
        cur[p] = {};
      }
      cur = cur[p];
    }
  });
}

// 读取 CSV，使用 csv-parse/sync 安全解析（支持换行、引号、转义等）
let content;
try {
  content = fs.readFileSync(sourceFile, 'utf8');
} catch (err) {
  console.error('❌ 读取 CSV 出错：', err);
  process.exit(1);
}

let records;
try {
  // 返回每一行的字段数组（不做 columns:true），以便保留列头顺序
  records = parse(content, {
    bom: true,
    skip_empty_lines: true
  });
} catch (err) {
  console.error('❌ CSV 解析出错：', err.message || err);
  process.exit(1);
}

if (!records || records.length === 0) {
  console.error('❌ CSV 内容为空或解析后无数据');
  process.exit(1);
}

const headers = records[0].map(h => (h === undefined ? '' : String(h).trim()));
if (headers.length === 0 || headers[0] !== 'key') {
  console.error('❌ CSV 首列须为 "key"');
  process.exit(1);
}

const langNames = headers.slice(1); // B1 及以后的列头

// 初始化 lang 对象
const langObjects = {};
langNames.forEach(lang => {
  langObjects[lang] = {};
});

// 遍历数据行（从第 2 行开始）
for (let r = 1; r < records.length; r++) {
  const row = records[r];
  // 如果行为空或 key 为空则跳过
  const key = row && row[0] ? String(row[0]) : '';
  if (!key) continue;

  for (let i = 0; i < langNames.length; i++) {
    const lang = langNames[i];
    // row[i+1] 可能为 undefined（列缺失），使用空字符串替代
    const raw = row[i + 1];
    const value = raw === undefined || raw === null ? '' : String(raw);
    if (value) setNested(langObjects[lang], key, value);
  }
}

// 确保输出目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 写入
langNames.forEach(lang => {
  const filePath = path.join(targetDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const backupPath = path.join(targetDir, `${lang}.${timestamp()}.json`);
    if (!isProd) {
      fs.renameSync(filePath, backupPath);
      console.log(`📦 已备份 ${filePath} -> ${backupPath}`);
    }
  }

  const outStr = JSON.stringify(langObjects[lang], null, 2);

  fs.writeFileSync(filePath, outStr, 'utf8');
  console.log(`✅ 已生成 ${filePath}`);
});
