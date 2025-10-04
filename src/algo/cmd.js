const cmd = {
  'F903': () => '', // empty line

  'F905': (a) => `Move ${a} pixels`,
  'F906': (a) => `Turn ⟲ ${a} degrees`,
  'F907': (a) => `Direction ${a} degrees`,
  'F908': (a, b) => `Goto x=${a}, y=${b}`,

  'F909': () => `Pen Down`,
  'F90A': () => `Pen Up`,
  'F90B': (a, b) => `${a}→${b}`,
  'F90C': (a) => `?→${a}`,

  'F90D': (a) => ({ '1': `"Yes"`, '2': `"No"`, '3': `"Number?"`, '4': `"Result :"` }[a] || a), // Comment
  'F90E': (a) => `Show Result ${a}`,
  'F90F': (a) => `Style ${{ '1': `Arrow`, '2': `Cross` }[a] || a}`,
  'F910': () => `Wait`,

  'F911': (a) => `Repeat ${a}`,
  'F912': () => `↻`,
  'F913': (a) => `Repeat until ${a}`,
  'F914': () => `↻`,
  'F915': (a) => `If ${a} then`,
  'F916': () => `↻`,
  'F917': (a) => `If ${a} then`,
  'F918': () => `Else`,
  'F919': () => `↻`,
};

export default cmd;
