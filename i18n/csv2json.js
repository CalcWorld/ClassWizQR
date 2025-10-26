import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.resolve(__dirname, './resource.csv');
const targetDir = path.resolve(__dirname, '../src/i18n-res');

// node i18n/csv2json.js [backup]
const arg = process.argv[2] || '';
const backup = arg === 'backup' || false;

if (!fs.existsSync(sourceFile)) {
  console.error(`resource.csv not found: ${sourceFile}`);
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

export function main(backup) {
  let content = fs.readFileSync(sourceFile, 'utf8');

  let records = parse(content, {
    bom: true,
    skip_empty_lines: true
  });

  if (!records || records.length === 0) {
    console.error('csv empty');
    process.exit(1);
  }

  const headers = records[0].map(h => (h === undefined ? '' : String(h).trim()));
  if (headers.length === 0 || headers[0] !== 'key') {
    console.error('csv error');
    process.exit(1);
  }

  const langNames = headers.slice(1);

  const langObjects = {};
  langNames.forEach(lang => {
    langObjects[lang] = {};
  });

  for (let r = 1; r < records.length; r++) {
    const row = records[r];
    const key = row && row[0] ? String(row[0]) : '';
    if (!key) continue;

    for (let i = 0; i < langNames.length; i++) {
      const lang = langNames[i];
      const raw = row[i + 1];
      const value = raw === undefined || raw === null ? '' : String(raw);
      if (value) setNested(langObjects[lang], key, value);
    }
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const results = [];
  langNames.forEach(lang => {
    const result = [];
    const filePath = path.join(targetDir, `${lang}.json`);
    if (fs.existsSync(filePath) && backup) {
      const backupDir = path.join(targetDir, 'bak');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const backupPath = path.join(backupDir, `${lang}.bak.json`);
      fs.renameSync(filePath, backupPath);
      console.log(`Backed up ${filePath} -> ${backupPath}`);
      result.push(backupPath);
    }

    const outStr = JSON.stringify(langObjects[lang], null, 2);

    fs.writeFileSync(filePath, outStr, 'utf8');
    console.log(`Generated ${filePath}`);
    result.push(filePath);
    results.push(result);
  });

  return results;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(backup);
}
