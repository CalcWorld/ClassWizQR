import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import * as cwqr from '../../../../src/index.js';
import { download } from '../../scripts/downloads.js';
import { translate } from '../../scripts/i18n.js';
import BasicInfo from './BasicInfo.jsx';
import CalculationView from './CalculationView.jsx';
import JsonResult from './JsonResult.jsx';
import ResultPanel from './ResultPanel.jsx';
import SettingsView from './SettingsView.jsx';

const EMPTY_RESULT = {};
const LANGUAGE_OPTIONS = cwqr.availableLanguages.map(value => {
  let name = value;
  try {
    name = new Intl.DisplayNames([value], { type: 'language' }).of(value) || value;
  } catch {
    // Fall back to the language code when Intl.DisplayNames is unavailable.
  }
  return { value, label: `${name} (${value})` };
});

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6 9.5 4h5L16 6"/>
      <rect x="3" y="6" width="18" height="14" rx="2"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="14" rx="2"/>
      <path d="M8 21h8M12 17.5V21"/>
      <path d="M6.5 8.5v-2h2M15.5 6.5h2v2M17.5 12.5v2h-2M8.5 14.5h-2v-2"/>
    </svg>
  );
}

function FileImageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <circle cx="8.5" cy="9" r="1.5"/>
      <path d="m4.5 17 4.5-4 3.5 3 2.5-2 4.5 3.5"/>
    </svg>
  );
}

function ParseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5"/>
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17"/>
    </svg>
  );
}

function cloneResult(value) {
  return JSON.parse(JSON.stringify(value));
}

function fitUrlInput(input) {
  input.style.height = 'auto';
  input.style.height = `${input.scrollHeight + 2}px`;
}

function readStoredLanguage() {
  try {
    return localStorage.getItem('lang');
  } catch {
    return null;
  }
}

function storeLanguage(language) {
  try {
    localStorage.setItem('lang', language);
  } catch {
    // Storage is optional, especially when the parser is embedded cross-origin.
  }
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
  const [urlExpanded, setUrlExpanded] = useState(false);
  const urlInputRef = useRef(null);

  const t = useCallback(tag => translate(tag, language), [language]);
  const languageReady = language === 'en' || Object.hasOwn(resources, language);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestedLanguage = query.get('lang')
      || readStoredLanguage()
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
    if (!initialized) return undefined;

    document.documentElement.classList.add('app-ready');
    return () => document.documentElement.classList.remove('app-ready');
  }, [initialized]);

  useEffect(() => {
    if (!initialized) return;

    storeLanguage(language);
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

  useLayoutEffect(() => {
    const input = urlInputRef.current;
    if (!input) return;

    input.style.height = '';
    if (!urlExpanded) return;
    fitUrlInput(input);
  }, [inputUrl, urlExpanded]);

  useEffect(() => {
    const input = urlInputRef.current;
    if (!input || !urlExpanded || typeof ResizeObserver === 'undefined') return undefined;

    let previousWidth = input.clientWidth;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === previousWidth) return;
      previousWidth = entry.contentRect.width;
      fitUrlInput(input);
    });
    observer.observe(input);
    return () => observer.disconnect();
  }, [urlExpanded]);

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
    setUrlExpanded(false);
    const currentHash = window.location.hash.substring(1);
    if (currentHash === inputUrl) return;
    window.location.hash = inputUrl;
  }

  function handleUrlControlFocusOut(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    commitUrl();
  }

  function clearUrl() {
    setInputUrl('');
    setActiveUrl('');
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    urlInputRef.current?.focus();
  }

  function handleDownload(key) {
    const payload = downloads[key];
    if (!payload) return;
    const content = payload.bom ? `\ufeff${payload.content}` : payload.content;
    download(`${payload.prefix}-${Date.now()}.csv`, content, 'text/csv;charset=utf-8');
  }

  return (
    <div
      id="app"
      class={initialized ? undefined : 'app-initializing'}
      aria-busy={!initialized}
    >
      <form id="qr-form" onSubmit={commitUrl}>
        {(!hideLanguage || !hideUrl) && (
          <div class="controls-row">
            {!hideLanguage && (
              <div class="form-field language-field">
                <label for="lang">{t('language-label')}</label>
                <select
                  id="lang"
                  name="lang"
                  value={language}
                  onChange={event => setLanguage(event.currentTarget.value)}
                >
                  {LANGUAGE_OPTIONS.map(({ value, label }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {!hideUrl && (
              <div class="scan-actions">
                <button class="form-button scan-option-button" type="button">
                  <CameraIcon/>
                  {t('scan-camera')}
                </button>
                <button class="form-button scan-option-button" type="button">
                  <ScreenIcon/>
                  {t('scan-screen')}
                </button>
                <button class="form-button scan-option-button" type="button">
                  <FileImageIcon/>
                  {t('scan-file')}
                </button>
              </div>
            )}
          </div>
        )}
        {!hideUrl && (
          <div class={`form-field url-field${urlExpanded ? ' is-expanded' : ''}`}>
            <label for="qrUrl">{t('qr-url-label')}</label>
            <div class="url-input-shell" onFocusOut={handleUrlControlFocusOut}>
              <textarea
                ref={urlInputRef}
                id="qrUrl"
                rows="1"
                placeholder="http://..."
                value={inputUrl}
                onFocus={() => setUrlExpanded(true)}
                onInput={event => setInputUrl(event.currentTarget.value.replace(/[\r\n]+/g, ''))}
                onKeyDown={event => {
                  if (event.key === 'Escape') {
                    event.currentTarget.blur();
                    return;
                  }
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  event.currentTarget.blur();
                }}
              />
              <div class="url-button-rail">
                <button
                  class="form-button url-input-button clear-button"
                  type="button"
                  aria-label={t('clear-button')}
                  title={t('clear-button')}
                  disabled={!inputUrl}
                  onClick={clearUrl}
                >
                  <ClearIcon/>
                </button>
                {urlExpanded && (
                  <button
                    class="form-button url-input-button submit-button"
                    type="submit"
                    aria-label={t('parse-button')}
                    title={t('parse-button')}
                  >
                    <ParseIcon/>
                  </button>
                )}
              </div>
            </div>
          </div>
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
        <JsonResult value={editorValue} language={language}/>
      </ResultPanel>
    </div>
  );
}
