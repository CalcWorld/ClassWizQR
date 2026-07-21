import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist.js';
import * as cwqr from '../../../src/index.js';
import { copyToClipboard, download, elementSelection } from './downloads.js';
import { translate } from './i18n.js';
import { escapeHtml, renderCalcSection, renderDownloadButton, renderTable } from './renderers.js';

export function initializeParser() {
  const lang = document.getElementById('lang');
  const cwqrI18nRes = {};
  const qrUrl = document.getElementById("qrUrl");
  const qrForm = document.getElementById('qr-form');
  const calc = document.getElementById('calc');
  const loading = document.getElementById('loading');
  const basic = document.getElementById('basic');
  const settings = document.getElementById('settings');
  const qrResult = document.getElementById('qrResult');
  let downloads = {};
  let editor;
  
  lang.onchange = async function () {
    localStorage.setItem('lang', lang.value);
    await loadI18nRes();
    document.documentElement.lang = lang.value;
    parseQr();
    i18n();
  }
  
  function updateQrHash() {
    const nextHash = `#${qrUrl.value}`;
    if (location.hash === nextHash) {
      parseQr();
    } else {
      location.hash = nextHash;
    }
  }
  
  qrUrl.onchange = updateQrHash;
  qrUrl.onkeydown = event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    updateQrHash();
  };
  qrForm.onsubmit = event => {
    event.preventDefault();
    updateQrHash();
  };
  
  calc.onclick = event => {
    const button = event.target.closest('button[data-download]');
    if (!button || !calc.contains(button)) return;
  
    const payload = downloads[button.dataset.download];
    if (!payload) return;
  
    const content = payload.bom ? `\ufeff${payload.content}` : payload.content;
    download(`${payload.prefix}-${Date.now()}.csv`, content, 'text/csv;charset=utf-8');
  };
  
  function parseOnHashChange() {
    qrUrl.value = location.hash.substring(1);
    parseQr();
  }
  
  async function loadI18nRes() {
    if (lang.value === 'en' || cwqrI18nRes[lang.value]) return;
    const resourceUrl = new URL(`i18n-res/${lang.value}.json`, document.baseURI);
    cwqrI18nRes[lang.value] = await (await fetch(resourceUrl)).json();
  }
  
  window.onhashchange = parseOnHashChange;
  
  window.onload = async function () {
    lang.innerHTML = cwqr.availableLanguages.map(i => `<option value="${i}">${i}</option>`).join('');
  
    const urlParams = new URLSearchParams(window.location.search);
    const searchLang = urlParams.get('lang');
    if (searchLang) {
      lang.style.display = 'none';
    }
    const isEmbed = urlParams.get('embed') === 'true';
    if (isEmbed) {
      qrUrl.style.display = 'none';
    }
  
    const options = {
      mode: 'view',
      name: 'cwqr',
      onEvent: async (node, event) => {
        if (event.type === 'click') {
          const isValueClick = event.target.closest('.jsoneditor-value');
          const text = isValueClick
            ? formatClipboardValue(getJsonValue(node))
            : formatJsonPath(node.path);
          await copyToClipboard(text);
          elementSelection(event.target);
        }
      },
      mainMenuBar: false,
    };
    editor = new JSONEditor(qrResult, options);
  
    const userLang = searchLang || localStorage.getItem('lang') || navigator.language.substring(0, 2);
    if (cwqr.availableLanguages.includes(userLang)) {
      lang.value = userLang;
      await loadI18nRes();
    } else {
      lang.value = 'en';
    }
    document.documentElement.lang = lang.value;
    i18n();
    parseOnHashChange();
  }
  
  function getJsonValue(node) {
    if (Object.hasOwn(node, 'value')) return node.value;
  
    return node.path.reduce(
      (value, segment) => value[segment],
      editor.get(),
    );
  }
  
  function formatClipboardValue(value) {
    return value !== null && typeof value === 'object'
      ? JSON.stringify(value, null, 2)
      : String(value);
  }
  
  function formatJsonPath(path) {
    return path.reduce((result, segment) => {
      if (typeof segment === 'number') {
        return `${result}[${segment}]`;
      }
      return /^[A-Za-z_$][\w$]*$/.test(segment)
        ? `${result}.${segment}`
        : `${result}[${JSON.stringify(segment)}]`;
    }, 'cwqr');
  }
  
  function parseQr() {
    let parseResult = {}, qrResult = {};
    if (qrUrl.value) {
      qrResult = cwqr.parseUrl(qrUrl.value, lang.value, cwqrI18nRes);
      parseResult = JSON.parse(JSON.stringify(qrResult));
    }
    settingsPreview(qrResult);
    basicPreview(qrResult);
    calculationPreview(qrResult);
    editor.set(parseResult);
    editor.expandAll();
  }
  
  function calculationPreview(qrResult) {
    const parseTabularArray = (array = []) => {
      const [headers = [], ...rows] = array;
      return renderTable({
        headers: ['', ...headers],
        rows,
        classes: 'content preview-table fix-width',
        rowNumbers: true,
        transpose: true,
      });
    };
    const parseVectorMatrix = (vectorMatrix, id, title) => renderCalcSection(
      id,
      title,
      vectorMatrix.map(vm => `
  <div class="content">\\( \\mathrm\{${escapeHtml(vm.name)}\} = ${escapeHtml(vm.latex)} \\)</div>
  ${renderTable({
        rows: vm.element,
        renderCell: value => `\\( ${escapeHtml(value)} \\)`,
      })}
  `).join(''),
    );
    const parseVariableList = variableList => `
  <div class="table-scroll"><table class="content preview-table fix-width"><thead><tr>
  <th></th>
  <th>${t('calc-variable-latex')}</th>
  <th>${t('calc-variable-decimal')}</th>
  </tr></thead><tbody class="transpose">
  ${variableList.map(r => `<tr><td>${escapeHtml(r.name)}</td><td>\\( ${escapeHtml(r.latex)} \\)</td><td>${escapeHtml(r.decimal)}</td></tr>`).join('')}
  </tbody></table></div>
  `;
  
    const {
      expression,
      function: _function,
      equation,
      result,
      matrix,
      vector,
      spreadsheet,
      statistic,
      distribution,
      variable,
      tableRange,
      mathBox,
      algorithm,
      sequence,
    } = qrResult;
  
    calc.hidden = true;
    calc.innerHTML = '';
    downloads = {};
    let calcHtml = '';
  
    calcHtml += expression ? renderCalcSection(
      'expression',
      t('calc-expression'),
      `<div class="content">\\( \\displaystyle ${escapeHtml(expression)} \\)</div>`,
    ) : '';
  
    calcHtml += _function ? renderCalcSection(
      'function',
      t('calc-function'),
      _function.map(f => `<div class="content">\\( \\displaystyle ${escapeHtml(f.name)}=${escapeHtml(f.expression)} \\)</div>`).join(''),
    ) : '';
  
    calcHtml += sequence?.definition ? renderCalcSection(
      'sequence-definition',
      t('calc-sequence-definition'),
      sequence.definition.map(f => `<div class="content">\\( \\displaystyle ${escapeHtml(f.name)}=${escapeHtml(f.expression)} \\)</div>`).join(''),
    ) : '';
    calcHtml += sequence?.result ? `
  <div class="calc-result" id="sequence-result">
    <div class="title">${t('calc-sequence-result')}</div>
    ${renderDownloadButton('sequence-result', t('calc-sequence-result-csv-down'))}
    ${renderDownloadButton('sequence-result-bom', t('calc-sequence-result-utf8bom-down'))}
  ${parseTabularArray(sequence.result.array)}
  </div>
  ` : '';
  
    calcHtml += equation ? `
  <div class="calc-result" id="equation">
    <div class="title">${t('calc-equation')}</div>
    <div class="content">\\( ${escapeHtml(equation.latex)} \\)</div>
    <div class="title">${t('calc-equation-coefficient')}</div>
    ${renderTable({
      rows: equation.element,
      renderCell: value => `\\( ${escapeHtml(value)} \\)`,
    })}
  </div>
  ` : '';
  
    calcHtml += distribution ? `
  <div class="calc-result" id="distribution">
    <div class="title">${t('calc-distribution')}</div>
    <div class="content">\\( ${escapeHtml(distribution.latex)} \\)</div>
  </div>
  ` : '';
  
    calcHtml += (result && result[0]) ? `
  <div class="calc-result" id="result">
    <div class="title">${t('calc-result')}</div>
    <div class="content right" id="result-content"></div>
    ${result.length > 1 ? parseVariableList(result.slice(1)) : ''}
  </div>
  ` : '';
  
    calcHtml += matrix ? parseVectorMatrix(matrix, 'matrix', t('calc-matrix')) : '';
    calcHtml += vector ? parseVectorMatrix(vector, 'vector', t('calc-vector')) : '';
  
    calcHtml += spreadsheet ? `
  <div class="calc-result" id="spreadsheet">
    <div class="title">${t('calc-spreadsheet')}</div>
    ${renderDownloadButton('spreadsheet', t('calc-spreadsheet-csv-down'))}
    ${renderDownloadButton('spreadsheet-bom', t('calc-spreadsheet-csv-utf8bom-down'))}
  ${renderTable({
      headers: ['', 'A', 'B', 'C', 'D', 'E'],
      rows: spreadsheet.array,
      classes: 'content preview-table fix-width',
      rowNumbers: true,
      transpose: true,
    })}
  </div>
  ` : '';
  
    calcHtml += statistic ? `
  <div class="calc-result" id="statistic">
    <div class="title">${t('calc-statistic')}</div>
    ${renderDownloadButton('statistic', t('calc-statistic-csv-down'))}
  ${parseTabularArray(statistic.array)}
  </div>
  ` : '';
  
    calcHtml += variable ? `
  <div class="calc-result" id="variable">
    <div class="title">${t('calc-variable')}</div>
    ${parseVariableList(variable)}
  </div>
  ` : '';
  
    calcHtml += tableRange ? `
  <div class="calc-result" id="table-range">
    <div class="title">${t('calc-table-range')}</div>
    ${parseVariableList(tableRange)}
  </div>
  ` : '';
  
    calcHtml += mathBox ? `
  <div class="calc-result" id="math-box">
    <div class="title">${t('calc-math-box')}</div>
    <div class="content">${qrResult?.mode?.subMode === 'S1' ? t('calc-math-box-dice') : t('calc-math-box-coin')}: ${escapeHtml(mathBox.quantity)}</div>
    <div class="content">${t('calc-math-box-attempts')}: ${escapeHtml(mathBox.attempts)}</div>
    ${renderDownloadButton('math-box', t('calc-math-box-csv-down'))}
  ${parseTabularArray(mathBox.array)}
  </div>
  ` : '';
  
    calcHtml += algorithm ? `
  <div class="calc-result" id="algorithm">
    <div class="title">${t('calc-algorithm-latex-command')}</div>
    <div class="content"><ol>${algorithm.latexCommand.map(i => `<li> \\( \\mathtt{ ${escapeHtml(i)}} \\)</li>`).join('')}</ol></div>
  
    <div class="title">${t('calc-algorithm-text-command')}</div>
    <div class="content"><pre id="algorithm-text-command-pre"></pre></div>
  
    <div class="title">${t('calc-algorithm-scratch-blocks')}</div>
    <div class="content">
    <a href="https://scratchblocks.github.io/#?style=scratch3&script=${encodeURIComponent(algorithm.scratchBlocks.join('\n'))}"
     target="_blank" rel="noopener noreferrer">${t('calc-algorithm-scratch-blocks-render')}</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://scratchblocks.github.io/translator/#?lang=${{ zh: 'zh_cn' }[lang.value] ?? lang.value}&script=${encodeURIComponent(algorithm.scratchBlocks.join('\n'))}"
     target="_blank" rel="noopener noreferrer">${t('calc-algorithm-scratch-blocks-translator')}</a>
    </div>
    <div class="content"><pre id="algorithm-scratch-blocks-pre"></pre></div>
  </div>
  ` : '';
  
    calc.innerHTML = calcHtml;
  
    result && result[0] && (document.getElementById('result-content').innerText = `\\( ${result[0].latex} \\)`);
    algorithm && (document.getElementById('algorithm-scratch-blocks-pre').innerText = algorithm.scratchBlocks.join('\n'));
    algorithm && (document.getElementById('algorithm-text-command-pre').innerText = algorithm.textCommand.join('\n'));
  
    const addDownload = (key, prefix, content, bom = false) => {
      downloads[key] = { prefix, content, bom };
    };
    if (spreadsheet) {
      addDownload('spreadsheet', 'spreadsheet', spreadsheet.csv);
      addDownload('spreadsheet-bom', 'spreadsheet', spreadsheet.csv, true);
    }
    statistic && addDownload('statistic', 'statistic', statistic.csv);
    mathBox && addDownload('math-box', 'math-box', mathBox.csv);
    if (sequence?.result) {
      addDownload('sequence-result', 'sequence-result', sequence.result.csv);
      addDownload('sequence-result-bom', 'sequence-result', sequence.result.csv, true);
    }
  
    if (calcHtml) {
      loading.textContent = t('loading');
      loading.hidden = false;
    } else {
      calc.hidden = false;
      loading.hidden = true;
      return;
    }
  
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, calc]);
    MathJax.Hub.Queue(function () {
      calc.hidden = false;
      loading.hidden = true;
    });
  }
  
  function basicPreview(qrResult) {
    const { model, mode, format } = qrResult;
  
    if (!model || !mode) {
      basic.innerHTML = '';
      return;
    }
  
    const rows = [
      [t('mode-main'), mode.mainName],
      [t('mode-sub'), mode.subName || t('mode-na')],
      ...(format ? [
        [t('format-display'), format.displayName],
        [t('format-store'), format.storeName],
      ] : []),
      [t('model-series'), model.type],
      [t('model-key'), model.name],
      [t('model-diag'), `${model.prefix}-${model.id} Ver${model.version}`],
      [t('model-sn'), model.serialNumber],
    ];
    basic.innerHTML = renderTable({ rows, classes: 'preview-table', transpose: true });
  }
  
  function settingsPreview(qrResult) {
    const { setup } = qrResult;
  
    settings.innerHTML = setup ? renderTable({
      headers: [t('settings-key'), t('settings-value')],
      rows: setup.map(item => [item.name, item.value]),
      classes: 'preview-table',
    }) : '';
  }
  
  function t(tag, language = lang.value) {
    return translate(tag, language);
  }
  
  function i18n() {
    document.querySelectorAll('[data-i18n-tag]').forEach(el => {
      const tag = el.getAttribute('data-i18n-tag');
      const text = t(tag);
      if (text) {
        el.innerText = text;
      }
    });
  }
  
}
