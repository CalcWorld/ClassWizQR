import { useEffect, useRef, useState } from 'preact/hooks';
import PreviewTable from './PreviewTable.jsx';

function Latex({ children, display = false }) {
  return <>{`\\( ${display ? '\\displaystyle ' : ''}${children} \\)`}</>;
}

function CalcSection({ id, title, children }) {
  return (
    <div class="calc-result" id={id}>
      <div class="title">{title}</div>
      {children}
    </div>
  );
}

function DownloadButton({ downloadKey, label, onDownload }) {
  return (
    <button class="download" type="button" onClick={() => onDownload(downloadKey)}>
      {label}
    </button>
  );
}

function TabularArray({ array = [] }) {
  const [headers = [], ...rows] = array;
  return (
    <PreviewTable
      headers={['', ...headers]}
      rows={rows}
      className="content preview-table fix-width"
      rowNumbers
      transpose
    />
  );
}

function VariableList({ values, t }) {
  return (
    <PreviewTable
      headers={['', t('calc-variable-latex'), t('calc-variable-decimal')]}
      rows={values.map(item => [item.name, <Latex>{item.latex}</Latex>, item.decimal])}
      className="content preview-table fix-width"
      transpose
    />
  );
}

function VectorMatrix({ id, title, values }) {
  return (
    <CalcSection id={id} title={title}>
      {values.map((item, index) => (
        <div key={`${item.name}-${index}`}>
          <div class="content"><Latex>{`\\mathrm{${item.name}} = ${item.latex}`}</Latex></div>
          <PreviewTable
            rows={item.element.map(row => row.map(value => <Latex>{value}</Latex>))}
          />
        </div>
      ))}
    </CalcSection>
  );
}

export default function CalculationView({ result, language, renderVersion, t, onDownload }) {
  const containerRef = useRef(null);
  const queueVersionRef = useRef(0);
  const [typesetting, setTypesetting] = useState(false);
  const {
    expression,
    function: functions,
    equation,
    result: calculationResult,
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
  } = result;
  const hasContent = Boolean(
    expression || functions || equation || calculationResult || matrix || vector || spreadsheet
    || statistic || distribution || variable || tableRange || mathBox || algorithm || sequence,
  );

  useEffect(() => {
    if (!hasContent || !containerRef.current) {
      setTypesetting(false);
      return undefined;
    }

    const queueVersion = ++queueVersionRef.current;
    let cancelled = false;
    let retryTimer;
    setTypesetting(true);

    function typesetWhenReady() {
      const mathJax = window.MathJax;
      if (!mathJax?.Hub) {
        retryTimer = window.setTimeout(typesetWhenReady, 25);
        return;
      }

      mathJax.Hub.Queue(['Typeset', mathJax.Hub, containerRef.current]);
      mathJax.Hub.Queue(() => {
        if (!cancelled && queueVersionRef.current === queueVersion) setTypesetting(false);
      });
    }

    typesetWhenReady();
    return () => {
      cancelled = true;
      window.clearTimeout(retryTimer);
    };
  }, [hasContent, language, renderVersion]);

  return (
    <>
      <div id="calc" ref={containerRef} key={`${language}-${renderVersion}`} hidden={typesetting}>
        {expression && (
          <CalcSection id="expression" title={t('calc-expression')}>
            <div class="content"><Latex display>{expression}</Latex></div>
          </CalcSection>
        )}

        {functions && (
          <CalcSection id="function" title={t('calc-function')}>
            {functions.map((item, index) => (
              <div class="content" key={index}><Latex display>{`${item.name}=${item.expression}`}</Latex></div>
            ))}
          </CalcSection>
        )}

        {sequence?.definition && (
          <CalcSection id="sequence-definition" title={t('calc-sequence-definition')}>
            {sequence.definition.map((item, index) => (
              <div class="content" key={index}><Latex display>{`${item.name}=${item.expression}`}</Latex></div>
            ))}
          </CalcSection>
        )}

        {sequence?.result && (
          <CalcSection id="sequence-result" title={t('calc-sequence-result')}>
            <DownloadButton downloadKey="sequence-result" label={t('calc-sequence-result-csv-down')} onDownload={onDownload}/>
            <DownloadButton downloadKey="sequence-result-bom" label={t('calc-sequence-result-utf8bom-down')} onDownload={onDownload}/>
            <TabularArray array={sequence.result.array}/>
          </CalcSection>
        )}

        {equation && (
          <CalcSection id="equation" title={t('calc-equation')}>
            <div class="content"><Latex>{equation.latex}</Latex></div>
            <div class="title">{t('calc-equation-coefficient')}</div>
            <PreviewTable rows={equation.element.map(row => row.map(value => <Latex>{value}</Latex>))}/>
          </CalcSection>
        )}

        {distribution && (
          <CalcSection id="distribution" title={t('calc-distribution')}>
            <div class="content"><Latex>{distribution.latex}</Latex></div>
          </CalcSection>
        )}

        {calculationResult?.[0] && (
          <CalcSection id="result" title={t('calc-result')}>
            <div class="content right"><Latex>{calculationResult[0].latex}</Latex></div>
            {calculationResult.length > 1 && <VariableList values={calculationResult.slice(1)} t={t}/>}
          </CalcSection>
        )}

        {matrix && <VectorMatrix id="matrix" title={t('calc-matrix')} values={matrix}/>}
        {vector && <VectorMatrix id="vector" title={t('calc-vector')} values={vector}/>}

        {spreadsheet && (
          <CalcSection id="spreadsheet" title={t('calc-spreadsheet')}>
            <DownloadButton downloadKey="spreadsheet" label={t('calc-spreadsheet-csv-down')} onDownload={onDownload}/>
            <DownloadButton downloadKey="spreadsheet-bom" label={t('calc-spreadsheet-csv-utf8bom-down')} onDownload={onDownload}/>
            <PreviewTable
              headers={['', 'A', 'B', 'C', 'D', 'E']}
              rows={spreadsheet.array}
              className="content preview-table fix-width"
              rowNumbers
              transpose
            />
          </CalcSection>
        )}

        {statistic && (
          <CalcSection id="statistic" title={t('calc-statistic')}>
            <DownloadButton downloadKey="statistic" label={t('calc-statistic-csv-down')} onDownload={onDownload}/>
            <TabularArray array={statistic.array}/>
          </CalcSection>
        )}

        {variable && (
          <CalcSection id="variable" title={t('calc-variable')}>
            <VariableList values={variable} t={t}/>
          </CalcSection>
        )}

        {tableRange && (
          <CalcSection id="table-range" title={t('calc-table-range')}>
            <VariableList values={tableRange} t={t}/>
          </CalcSection>
        )}

        {mathBox && (
          <CalcSection id="math-box" title={t('calc-math-box')}>
            <div class="content">
              {result?.mode?.subMode === 'S1' ? t('calc-math-box-dice') : t('calc-math-box-coin')}: {mathBox.quantity}
            </div>
            <div class="content">{t('calc-math-box-attempts')}: {mathBox.attempts}</div>
            <DownloadButton downloadKey="math-box" label={t('calc-math-box-csv-down')} onDownload={onDownload}/>
            <TabularArray array={mathBox.array}/>
          </CalcSection>
        )}

        {algorithm && (
          <CalcSection id="algorithm" title={t('calc-algorithm-latex-command')}>
            <div class="content">
              <ol>{algorithm.latexCommand.map((item, index) => <li key={index}><Latex>{`\\mathtt{ ${item}}`}</Latex>
              </li>)}</ol>
            </div>
            <div class="title">{t('calc-algorithm-text-command')}</div>
            <div class="content">
              <pre>{algorithm.textCommand.join('\n')}</pre>
            </div>
            <div class="title">{t('calc-algorithm-scratch-blocks')}</div>
            <div class="content">
              <a
                href={`https://scratchblocks.github.io/#?style=scratch3&script=${encodeURIComponent(algorithm.scratchBlocks.join('\n'))}`}
                target="_blank"
                rel="noopener noreferrer"
              >{t('calc-algorithm-scratch-blocks-render')}</a>
              {'    '}
              <a
                href={`https://scratchblocks.github.io/translator/#?lang=${language === 'zh' ? 'zh_cn' : language}&script=${encodeURIComponent(algorithm.scratchBlocks.join('\n'))}`}
                target="_blank"
                rel="noopener noreferrer"
              >{t('calc-algorithm-scratch-blocks-translator')}</a>
            </div>
            <div class="content">
              <pre>{algorithm.scratchBlocks.join('\n')}</pre>
            </div>
          </CalcSection>
        )}
      </div>
      {typesetting && <div id="loading">{t('loading')}</div>}
    </>
  );
}
