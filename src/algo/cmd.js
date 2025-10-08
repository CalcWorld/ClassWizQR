import { translate } from '../utils.js';

const algoMsg = {
  en: {
    "f90d-1": "Yes",
    "f90d-2": "No",
    "f90d-3": "Number?",
    "f90d-4": "Result :",
    "f90f-1": "Arrow",
    "f90f-2": "Cross",
    'scratch-value': 'value?',
    'scratch-any': 'any',
  },
  zh: {
    "F90D-1": "是",
    "F90D-2": "否",
    "F90D-3": "数值?",
    "F90D-4": "结果 :",
    "F90F-1": "箭头",
    "F90F-2": "十字",
    'scratch-value': '输入值?',
    'scratch-any': '任意',
  },
  fr: {
    "F90D-1": "Oui",
    "F90D-2": "Non",
    "F90D-3": "Nombre?",
    "F90D-4": "Résultat :",
    "F90F-1": "Flèche",
    "F90F-2": "Croix",
    'scratch-value': 'valeur?',
    'scratch-any': `n'importe laquelle`,
  },
};

const enLatexCmd = {
  'F903': () => ' ', // empty line

  'F905': (a, unitSetting) => `Move\\ ${a}\\ ${unitSetting === '0' ? 'pixels' : 'units'}`,
  'F906': (a) => `Turn\\ ⟲\\ ${a}\\ degrees`,
  'F907': (a) => `Direction\\ ${a}\\ degrees`,
  'F908': (a, b) => `Goto\\ x=${a},\\ y=${b}`,

  'F909': () => `Pen\\ Down`,
  'F90A': () => `Pen\\ Up`,
  'F90B': (a, b) => `${a}→${b}`,
  'F90C': (a) => `?→${a}`,

  'F90D': (a) => `"${algoMsg.en[`f90d-${a}`] || a}"`, // Comment
  'F90E': (a) => `Show\\ Result\\ ${a}`,
  'F90F': (a) => `Style\\ ${algoMsg.en[`f90f-${a}`] || a}`,
  'F910': () => `Wait`,

  'F911': (a) => `Repeat\\ ${a}`,
  'F912': () => `↻`,
  'F913': (a) => `Repeat\\ until\\ ${a}`,
  'F914': () => `↻`,
  'F915': (a) => `If\\ ${a}\\ then`,
  'F916': () => `End`,
  'F917': (a) => `If\\ ${a}\\ then`,
  'F918': () => `Else`,
  'F919': () => `End`,
};

const zhLatexCmd = {
  'F903': () => ' ',

  'F905': (a, unitSetting) => `前进\\ ${a}\\ ${unitSetting === '0' ? '像素' : '×10像素'}`,
  'F906': (a) => `旋转⟲\\ ${a}\\ 度`,
  'F907': (a) => `面向θ\\ ${a}\\ 度`,
  'F908': (a, b) => `移到\\ x=${a},\\ y=${b}`,

  'F909': () => `下笔`,
  'F90A': () => `抬笔`,
  'F90B': (a, b) => `${a}→${b}`,
  'F90C': (a) => `?→${a}`,

  'F90D': (a) => `"${algoMsg.zh[`f90d-${a}`] || a}"`,
  'F90E': (a) => `显示结果\\ ${a}`,
  'F90F': (a) => `样式\\ ${algoMsg.zh[`f90f-${a}`] || a}`,
  'F910': () => `等待`,

  'F911': (a) => `循环\\ ${a}`,
  'F912': () => `↻`,
  'F913': (a) => `循环直到\\ ${a}`,
  'F914': () => `↻`,
  'F915': (a) => `如果\\ ${a}\\ 则`,
  'F916': () => `结束`,
  'F917': (a) => `如果\\ ${a}\\ 则`,
  'F918': () => `否则`,
  'F919': () => `结束`,
};

const frLatexCmd = {
  'F903': () => ' ',

  'F905': (a, unitSetting) => `Avancer\\ de\\ ${a}\\ ${unitSetting === '0' ? 'pixels' : 'unités'}`,
  'F906': (a) => `Tourner\\ de\\ ⟲\\ ${a}\\ degrés`,
  'F907': (a) => `S'orienter\\ à\\ ${a}\\ degrés`,
  'F908': (a, b) => `Aller\\ à\\ x=${a};\\ y=${b}`,

  'F909': () => `Stylo\\ écrit`,
  'F90A': () => `Stylo\\ relevé`,
  'F90B': (a, b) => `${a}→${b}`,
  'F90C': (a) => `?→${a}`,

  'F90D': (a) => `"${algoMsg.fr[`f90d-${a}`] || a}"`, // Comment
  'F90E': (a) => `Afficher\\ résult\\ ${a}`,
  'F90F': (a) => `Style\\ ${algoMsg.fr[`f90f-${a}`] || a}`,
  'F910': () => `Attendre`,

  'F911': (a) => `Répéter\\ ${a}`,
  'F912': () => `↻`,
  'F913': (a) => `Répéter\\ jusqu'à\\ ${a}`,
  'F914': () => `↻`,
  'F915': (a) => `Si\\ ${a}\\ Alors`,
  'F916': () => `Fin`,
  'F917': (a) => `Si\\ ${a}\\ Alors`,
  'F918': () => `Sinon`,
  'F919': () => `Fin`,
};

const enScratch = {
  'F903': () => '', // empty line

  'F905': (a) => `move (${a}) steps`,
  'F906': (a) => `turn @turnLeft (${a}) degrees`,
  'F907': (a) => `point in direction (${a})`,
  'F908': (a, b) => `go to x:(${a}) y:(${b})`,

  'F909': () => `pen down`,
  'F90A': () => `pen up`,
  'F90B': (a, b) => `set [${b} v] to (${a})`,
  'F90C': (a) => `ask [${translate(algoMsg)['scratch-value']}] and wait\nset [${a} v] to (answer)`,

  'F90D': (a) => `say [${translate(algoMsg)[`f90d-${a}`] || a}]\nwait until <key [${translate(algoMsg)['scratch-any']} v] pressed?>`,
  'F90E': (a) => `say (${a})\nwait until <key [${translate(algoMsg)['scratch-any']} v] pressed?>`,
  'F90F': (a) => `switch costume to [${translate(algoMsg)[`f90f-${a}`] || a} v]`,
  'F910': () => `wait until <key [${translate(algoMsg)['scratch-any']} v] pressed?>`,

  'F911': (a) => `repeat (${a})`,
  'F912': () => `end`,
  'F913': (a) => `repeat until [${a}]`,
  'F914': () => `end`,
  'F915': (a) => `if [${a}] then`,
  'F916': () => `end`,
  'F917': (a) => `if [${a}] then`,
  'F918': () => `else`,
  'F919': () => `end`,
};

export default {
  latex: {
    en: enLatexCmd,
    zh: zhLatexCmd,
    fr: frLatexCmd,
  },
  scratch: {
    en: enScratch,
  },
};
