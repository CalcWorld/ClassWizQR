import util from 'util';
import { ParseAlgorithm } from '../src/algo/index.js';

util.inspect.defaultOptions.depth = null;

function printAlgo(asciiArray) {
  // console.log(asciiArray);
  const algoMap = {
    'F901': '[F901]\n',
    'F902': '[F902]',
    'F903': '[F903] ',
    // 'F905': 'Move ${0} pixels',
    // 'F906': 'Turn ⟲ ${0} degrees',
    // 'F907': 'Direction ${0} degrees',
    // 'F908': 'Goto x=${0}, y=${1}',
    // 'F909': 'Pen Down',
    // 'F90A': 'Pen Up',
    // 'F90B': '${0}→${1}',
    // 'F90C': '?→${0}',
  };
  const res = asciiArray.map(a => algoMap[a] || `[${a}]`);
  console.log(res);
  console.log(res.join(''));
}

function algoTest(E) {
  const asciiArray = E.match(/F[\dA-F]{3}|[\dA-F]{2}/g);
  printAlgo(asciiArray);
  const algoStart = [
    'F903',
    'F905',
    'F906',
    'F907',
    'F908',
    'F909',
    'F90A',
    'F90B',
    'F90C',
    'F90D',
    'F90E',
    'F90F',
    'F910',
    'F911',
    'F912',
    'F913',
    'F914',
    'F915',
    'F916',
    'F917',
    'F918',
    'F919',
  ];

  const algoMid = [
    '00',
  ];

  const algoEnd = [
    'F901',
  ];

  let result = '[';
  for (let i = 0; i < asciiArray.length; i++) {
    const cur = asciiArray[i];
    if (algoStart.includes(cur)) {
      result += `{"${cur}": [[`;
      continue;
    }
    if (algoMid.includes(cur)) {
      result = result.endsWith(', ') ? result.slice(0, -2) : result;
      result += `], [`;
      continue;
    }
    if (algoEnd.includes(cur)) { // F901
      result = result.endsWith(', ') ? result.slice(0, -2) : result;
      result += ']';
      result += `]}, `;
      continue;
    }
    result += `"${cur}", `;
  }
  result = result.endsWith(', ') ? result.slice(0, -2) : result;
  result += ']';
  console.log(result);

  result = JSON.parse(result);
  console.log(result);
}

function algoTest2(E) {
  const asciiArray = E.match(/F[\dA-F]{3}|[\dA-F]{2}/g);
  printAlgo(asciiArray);
  const algoStart = [
    'F903',
    'F905',
    'F906',
    'F907',
    'F908',
    'F909',
    'F90A',
    'F90B',
    'F90C',
    'F90D',
    'F90E',
    'F90F',
    'F910',
    'F911',
    'F912',
    'F913',
    'F914',
    'F915',
    'F916',
    'F917',
    'F918',
    'F919',
  ];

  const algoMid = [
    '00',
  ];

  const algoEnd = [
    'F901',
    'F902',
  ];

  let result = [];
  let currentCmd;
  let currentArg = [];
  for (let i = 0; i < asciiArray.length; i++) {
    const cur = asciiArray[i];
    const next = i + 1 < asciiArray.length ? asciiArray[i + 1] : null;
    if (algoStart.includes(cur)) {
      currentArg = [];
      currentCmd = { [cur]: currentArg };
      result.push(currentCmd);
      continue;
    }
    if (algoMid.includes(cur)) {
      if (!algoEnd.includes(next)) {
        currentArg.push([]);
      }
      continue;
    }
    if (algoEnd.includes(cur)) { // F901
      continue;
    }
    if (currentArg.length === 0) {
      currentArg.push([]);
    }
    currentArg[currentArg.length - 1].push(cur);
  }
  console.log(result);

}

const E_list = ['F90532333300F901F903F901F902',
  'F90532333300F901F906313200F901F903F901F902',
  'F90532333300F901F906313200F901F907333400F901F903F901F902',
  'F90532333300F901F906313200F901F907333400F901F908A600A700F901F903F901F902',
  'F909F901F903F901F902',
  'F909F901F90AF901F90B30004100F901F903F901F902',
  'F909F901F90AF901F90B30004100F901F90C4900F901F903F901F902',
  'F90D3100F901F90D3200F901F90D3300F901F90D3400F901F903F901F902',
  'F90E47474700F901F90F3100F901F90F3200F901F910F901F903F901F902',
  'F91132333300F901F903F901F912F901F903F901F902',
  'F90639393900F901F91132333300F901F91134353600F901F90538383800F901F912F901F912F901F903F901F902',
  'F91341A53000F901F91541A53200F901F91741A53300F901F90537373700F901F918F901F903F901F919F901F916F901F914F901F91741A53500F901F905312E00F901F918F901F9063300F901F919F901F903F901F902',
  'F909F901F90AF901F90F3100F901F90D3300F901F91341A53000F901F91541A53200F901F91741A53300F901F90537373700F901F918F901F903F901F919F901F916F901F914F901F91741A53500F901F905312E00F901F918F901F9063300F901F919F901F903F901F902',
  'F9083131310032323200F901F903F901F902',
  'F9053100F901F9063200F901F9073300F901F90834003500F901F909F901F90AF901F90B36004100F901F90C4100F901F90D3100F901F90D3200F901F90D3300F901F90D3400F901F90E3700F901F90F3100F901F90F3200F901F910F901F9113800F901F91341A53900F901F91541A5313000F901F903F901F916F901F914F901F912F901F91741A5313100F901F903F901F918F901F903F901F919F901F903F901F902',
  'F9053100F901F9063200F901F9073300F901F90834003500F901F909F901F90AF901F90B36004100F901F90C4100F901F90D3100F901F90D3200F901F90D3300F901F90D3400F901F90E3700F901F90F3100F901F90F3200F901F910F901F9113900F901F91341A5313000F901F91541A5313100F901F905313200F901F916F901F914F901F912F901F91741A5313300F901F906313400F901F918F901F905C874C9D57D757DD4CA4077787960D02C7C7B7A2221414243444546474849DCC0313233343536373839302EA6A7A8A900F901F9054BD7D8ADAEFD18878889688369848AD9DADBDC6C6D6E6F7071E3E4E5E6E7E2E1E0DFDEDDFD3500F901F919F901F903F901F902',
];

// E_list.forEach(e => algoTest(e));

// E_list.forEach(e => algoTest2(e));

E_list.forEach(e => {
  // printAlgo(e.match(/F[\dA-F]{3}|[\dA-F]{2}/g))
  const algoParser = new ParseAlgorithm(e, 'EY', '007',)
  console.log(algoParser.parseToLaTexCmdList());
  console.log(algoParser.parseToLaTexCmdList().join('\n'));
  console.log(algoParser.parseToLaTexCmdList({ tab: '' }));
  console.log(algoParser.parseToLaTexCmdList({ tab: '' }).join('\n'));
  console.log(algoParser.parseToScratch());
  console.log(algoParser.parseToScratch().join('\n'));
});
