import modeInfo from './mode.json' assert { type: 'json' };
import menuInfo from './menu.json' assert { type: 'json' };

export const getModeInfo = (mode) => {
  const mainMode = mode.slice(0, 2);
  const subMode = mode.slice(2, 4);
  if (mode.startsWith('X') || mode.startsWith('Y') || mode.startsWith('Z')) {
    return menuInfo[mainMode];
  }
  const mainName = modeInfo[mainMode]['name'];
  const subName = modeInfo[mainMode]['subMode'][subMode];
  return { mainName, subName };
}
