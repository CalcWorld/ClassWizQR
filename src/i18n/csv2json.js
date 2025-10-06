// i18n/csv2json.js
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const arg = process.argv[2] || '';
const isProduction = arg === 'production' || false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.resolve(__dirname, './resource.csv');
const targetDir = path.resolve(__dirname, '../i18n-res');

// 确保目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// CSV 解析函数
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    // 简单的 CSV 解析（考虑引号包裹和转义双引号）
    const regex = /"([^"]*(?:""[^"]*)*)"|([^,]+)/g;
    let matches, values = [];
    while ((matches = regex.exec(line)) !== null) {
      if (matches[1] !== undefined) {
        values.push(matches[1].replace(/""/g, '"'));
      } else {
        values.push(matches[2]);
      }
    }
    return values;
  });

  return { headers, rows };
}

// 嵌套赋值：key 为 a.b.c 的形式
function setNested(obj, key, value) {
  const parts = key.split('.');
  let cur = obj;
  parts.forEach((p, idx) => {
    if (idx === parts.length - 1) {
      cur[p] = value;
    } else {
      cur[p] = cur[p] || {};
      cur = cur[p];
    }
  });
}

// 生成时间戳字符串
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

// 读取 CSV
if (!fs.existsSync(sourceFile)) {
  console.error(`❌ 未找到 resource.csv: ${sourceFile}`);
  process.exit(1);
}

const content = fs.readFileSync(sourceFile, 'utf8');
const { headers, rows } = parseCSV(content);

if (headers[0] !== 'key') {
  console.error('❌ CSV 文件首列必须为 key');
  process.exit(1);
}

const langs = headers.slice(1); // B1 开始是语言名

// 生成各语言 JSON 数据
let langObjects = {};
langs.forEach(lang => {
  langObjects[lang] = {};
});

rows.forEach(row => {
  const key = row[0];
  langs.forEach((lang, idx) => {
    const value = row[idx + 1] || '';
    setNested(langObjects[lang], key, value);
  });
});

// 保存文件，存在则备份
langs.forEach(lang => {
  const filePath = path.join(targetDir, `${lang}.json`);
  if (fs.existsSync(filePath) && !isProduction) {
    const backupPath = path.join(
      targetDir,
      `${lang}.${timestamp()}.json`
    );
    fs.renameSync(filePath, backupPath);
    console.log(`📦 已备份 ${filePath} -> ${backupPath}`);
  }
  if (isProduction) {
    fs.writeFileSync(filePath, JSON.stringify(langObjects[lang]), 'utf8');
  } else {
    fs.writeFileSync(filePath, JSON.stringify(langObjects[lang], null, 2), 'utf8');
  }
  console.log(`✅ 已生成 ${filePath}`);
});
