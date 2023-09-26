import modeInfo from './mode.json' assert { type: 'json' };
import menuInfo from './menu.json' assert { type: 'json' };

export const langDictToList = (dict) => {
  const list = [];
  for (const key in dict) {
    list.push({ region: key, name: dict[key] });
  }
  return list;
}

export const getModeInfo = (mode) => {
  const mainMode = mode.slice(0, 2);
  let subMode = mode.slice(2, 4);
  if (mode.startsWith('X') || mode.startsWith('Y') || mode.startsWith('Z')) {
    return langDictToList(menuInfo[mainMode]);
  }
  if (mainMode === '4B') {
    subMode += mode.slice(6, 8);
  }
  const mainName = langDictToList(modeInfo[mainMode]['name']);
  const subName = langDictToList(modeInfo[mainMode]['subMode'][subMode]['name']);
  return { mainName, subName };
}
