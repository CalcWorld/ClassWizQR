const enLatexCmd = {
  'F903': () => '', // empty line

  'F905': (a) => `Move\\ ${a}\\ pixels`,
  'F906': (a) => `Turn\\ ⟲\\ ${a}\\ degrees`,
  'F907': (a) => `Direction\\ ${a}\\ degrees`,
  'F908': (a, b) => `Goto\\ x=${a},\\ y=${b}`,

  'F909': () => `Pen\\ Down`,
  'F90A': () => `Pen\\ Up`,
  'F90B': (a, b) => `${a}→${b}`,
  'F90C': (a) => `?→${a}`,

  'F90D': (a) => ({ '1': `"Yes"`, '2': `"No"`, '3': `"Number?"`, '4': `"Result\\ :"` }[a] || a), // Comment
  'F90E': (a) => `Show\\ Result\\ ${a}`,
  'F90F': (a) => `Style\\ ${{ '1': `Arrow`, '2': `Cross` }[a] || a}`,
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
  'F903': () => '',

  'F905': (a) => `前进\\ ${a}\\ 像素`,
  'F906': (a) => `旋转⟲\\ ${a}\\ 度`,
  'F907': (a) => `面向θ\\ ${a}\\ 度`,
  'F908': (a, b) => `移到\\ x=${a},\\ y=${b}`,

  'F909': () => `下笔`,
  'F90A': () => `抬笔`,
  'F90B': (a, b) => `${a}→${b}`,
  'F90C': (a) => `?→${a}`,

  'F90D': (a) => ({ '1': `"是"`, '2': `"否"`, '3': `"数值?"`, '4': `"结果\\ :"` }[a] || a),
  'F90E': (a) => `显示结果\\ ${a}`,
  'F90F': (a) => `样式\\ ${{ '1': `箭头`, '2': `十字` }[a] || a}`,
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

const enScratch = {
  'F903': () => '', // empty line

  'F905': (a) => `move (${a}) steps`,
  'F906': (a) => `turn @turnLeft (${a}) degrees`,
  'F907': (a) => `point in direction (${a})`,
  'F908': (a, b) => `go to x:(${a}) y:(${b})`,

  'F909': () => `pen down`,
  'F90A': () => `pen up`,
  'F90B': (a, b) => `set [${b} v] to (${a})`,
  'F90C': (a) => `ask [value?] and wait\nset [${a} v] to (answer)`,

  'F90D': (a) => `say [${{
    '1': `Yes`,
    '2': `No`,
    '3': `Number?`,
    '4': `Result\\ :`,
  }[a] || a}]\nwait until <key [any v] pressed?>`,
  'F90E': (a) => `say (${a})\nwait until <key [any v] pressed?>`,
  'F90F': (a) => `switch costume to [${{ '1': `Arrow`, '2': `Cross` }[a] || a} v]`,
  'F910': () => `wait until <key [any v] pressed?>`,

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
  },
  scratch: {
    en: enScratch,
  },
};
