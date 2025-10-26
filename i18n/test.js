import fs from "fs";
import assert from "assert";
import { main } from './csv2json.js';

function compareJson(path1, path2) {
  const json1 = JSON.parse(fs.readFileSync(path1, "utf-8"));
  const json2 = JSON.parse(fs.readFileSync(path2, "utf-8"));

  assert.deepStrictEqual(json1, json2);
}

const results = main(true);

for (const [bakJson, genJson] of results) {
  console.log(bakJson, genJson);
  compareJson(bakJson, genJson);
}
console.log('i18n test passed')
