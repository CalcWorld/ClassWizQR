import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import * as cwqr from '../../../../src/index.js';
import { download } from '../../scripts/downloads.js';
import { translate } from '../../scripts/i18n.js';
import BasicInfo from './BasicInfo.jsx';
import CalculationView from './CalculationView.jsx';
import JsonResult from './JsonResult.jsx';
import ResultPanel from './ResultPanel.jsx';
import SettingsView from './SettingsView.jsx';

const EMPTY_RESULT = {};

function cloneResult(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function ParserApp() {
  const [language, setLanguage] = useState('en');
  const [inputUrl, setInputUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [resources, setResources] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [hideLanguage, setHideLanguage] = useState(false);
  const [hideUrl, setHideUrl] = useState(false);
  const [result, setResult] = useState(EMPTY_RESULT);
  const [editorValue, setEditorValue] = useState(EMPTY_RESULT);
  const [renderVersion, setRenderVersion] = useState(0);

  const t = useCallback(tag => translate(tag, language), [language]);
  const languageReady = language === 'en' || Object.hasOwn(resources, language);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestedLanguage = query.get('lang')
      || localStorage.getItem('lang')
      || navigator.language.substring(0, 2);
    const initialLanguage = cwqr.availableLanguages.includes(requestedLanguage)
      ? requestedLanguage
      : 'en';
    const initialUrl = window.location.hash.substring(1);

    setLanguage(initialLanguage);
    setInputUrl(initialUrl);
    setActiveUrl(initialUrl);
    setHideLanguage(Boolean(query.get('lang')));
    setHideUrl(query.get('embed') === 'true');
    setInitialized(true);

    function handleHashChange() {
      const nextUrl = window.location.hash.substring(1);
      setInputUrl(nextUrl);
      setActiveUrl(nextUrl);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem('lang', language);
    document.documentElement.lang = language;
    if (language === 'en' || Object.hasOwn(resources, language)) return;

    let cancelled = false;

    async function loadLanguage() {
      try {
        const resourceUrl = new URL(`/i18n-res/${language}.json`, document.baseURI);
        const response = await fetch(resourceUrl);
        if (!response.ok) throw new Error(`Unable to load ${resourceUrl}: ${response.status}`);
        const data = await response.json();
        if (!cancelled) setResources(current => ({ ...current, [language]: data }));
      } catch (error) {
        console.error(error);
        if (!cancelled) setResources(current => ({ ...current, [language]: {} }));
      }
    }

    loadLanguage();
    return () => {
      cancelled = true;
    };
  }, [initialized, language, resources]);

  useEffect(() => {
    if (!initialized || !languageReady) return;

    let nextResult = EMPTY_RESULT;
    if (activeUrl) {
      try {
        nextResult = cwqr.parseUrl(activeUrl, language, resources);
      } catch (error) {
        console.error(error);
      }
    }

    setResult(nextResult);
    setEditorValue(cloneResult(nextResult));
    setRenderVersion(version => version + 1);
  }, [activeUrl, initialized, language, languageReady, resources]);

  const downloads = useMemo(() => {
    const values = {};
    const add = (key, prefix, content, bom = false) => {
      values[key] = { prefix, content, bom };
    };

    if (result.spreadsheet) {
      add('spreadsheet', 'spreadsheet', result.spreadsheet.csv);
      add('spreadsheet-bom', 'spreadsheet', result.spreadsheet.csv, true);
    }
    if (result.statistic) add('statistic', 'statistic', result.statistic.csv);
    if (result.mathBox) add('math-box', 'math-box', result.mathBox.csv);
    if (result.sequence?.result) {
      add('sequence-result', 'sequence-result', result.sequence.result.csv);
      add('sequence-result-bom', 'sequence-result', result.sequence.result.csv, true);
    }
    return values;
  }, [result]);

  function commitUrl(event) {
    event?.preventDefault();
    const currentHash = window.location.hash.substring(1);
    if (currentHash === inputUrl) return;
    window.location.hash = inputUrl;
  }

  function handleDownload(key) {
    const payload = downloads[key];
    if (!payload) return;
    const content = payload.bom ? `\ufeff${payload.content}` : payload.content;
    download(`${payload.prefix}-${Date.now()}.csv`, content, 'text/csv;charset=utf-8');
  }

  return (
    <div id="app">
      <form id="qr-form" onSubmit={commitUrl}>
        {!hideLanguage && (
          <select
            id="lang"
            name="lang"
            aria-label="Language"
            value={language}
            onChange={event => setLanguage(event.currentTarget.value)}
          >
            {cwqr.availableLanguages.map(value => <option value={value} key={value}>{value}</option>)}
          </select>
        )}
        {!hideUrl && (
          <input
            id="qrUrl"
            type="search"
            aria-label="QR URL"
            placeholder="http://......"
            value={inputUrl}
            onInput={event => setInputUrl(event.currentTarget.value)}
            onChange={commitUrl}
            onKeyDown={event => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              commitUrl();
            }}
          />
        )}
      </form>

      <ResultPanel title={t('calc-title')}>
        <CalculationView
          result={result}
          language={language}
          renderVersion={renderVersion}
          t={t}
          onDownload={handleDownload}
        />
      </ResultPanel>
      <ResultPanel title={t('basic-title')}>
        <BasicInfo result={result} t={t}/>
      </ResultPanel>
      <ResultPanel title={t('settings-title')}>
        <SettingsView result={result} t={t}/>
      </ResultPanel>
      <ResultPanel title={t('qr-parse-result-title')}>
        <JsonResult value={editorValue}/>
      </ResultPanel>
    </div>
  );
}
