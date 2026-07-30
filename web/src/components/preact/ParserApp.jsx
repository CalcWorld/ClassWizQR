import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import * as cwqr from '../../../../src/index.js';
import { copyToClipboard, download } from '../../scripts/downloads.js';
import { translate } from '../../scripts/i18n.js';
import BasicInfo from './BasicInfo.jsx';
import CameraScannerDialog from './CameraScannerDialog.jsx';
import CalculationView from './CalculationView.jsx';
import ImageProcessingDialog from './ImageProcessingDialog.jsx';
import ImageSequenceDialog from './ImageSequenceDialog.jsx';
import JsonResult from './JsonResult.jsx';
import HistoryDialog from './HistoryDialog.jsx';
import MessageDialog from './MessageDialog.jsx';
import ResultPanel from './ResultPanel.jsx';
import {
  CameraIcon,
  ClearIcon,
  ClipboardIcon,
  CopyIcon,
  FileImageIcon,
  HistoryIcon,
  ParseIcon,
  ScreenIcon,
} from './Icons.jsx';
import SettingsView from './SettingsView.jsx';
import { addQrImageResults, createEmptyImageSequenceSession, } from '../../scripts/qrImageSequence.js';
import { filterValidQrResults, resolveInitialQrResults, } from '../../scripts/qrMultiResult.js';
import { createQrPreviewUrl, prepareQrImage, } from '../../scripts/qrPreview.js';
import { MULTI_QR_LIMIT, readQrCodes } from '../../scripts/qrReader.js';
import { parseHistoryRepository } from '../../scripts/parseHistory.js';

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

function ScanOptionButton({ icon: Icon, label, onClick }) {
  return (
    <button class="form-button scan-option-button" type="button" onClick={onClick}>
      <span class="scan-option-content">
        <Icon/>
        {label}
      </span>
    </button>
  );
}

function cloneResult(value) {
  return JSON.parse(JSON.stringify(value));
}

function yieldForPaint() {
  return new Promise(resolve => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}

async function readValidQrCodes(imageData, maxNumberOfSymbols) {
  const results = await readQrCodes(imageData, maxNumberOfSymbols);
  return filterValidQrResults(results);
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

function getScreenTitlePrefix(status, t) {
  if (status.complete) return t('screen-title-complete');
  if (status.pending?.length) {
    return t('screen-title-sequence', {
      pending: status.pending.join('|'),
    });
  }
  return t('screen-title-scanning');
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
  const [streamScannerMode, setStreamScannerMode] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [imageSession, setImageSession] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageProgress, setImageProgress] = useState(null);
  const [appMessage, setAppMessage] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyBusy, setHistoryBusy] = useState(false);
  const urlInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const baseTitleRef = useRef('');
  const screenTitleStatusRef = useRef(null);
  const imageBusyRef = useRef(false);
  const lastRecordedUrlRef = useRef('');

  const t = useCallback(
    (tag, params) => translate(tag, language, params),
    [language],
  );
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
    let cancelled = false;
    parseHistoryRepository.list()
      .then(records => {
        if (!cancelled) setHistoryRecords(records);
      })
      .catch(error => console.error(error));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    baseTitleRef.current = document.title;

    function applyScreenTitle() {
      const status = screenTitleStatusRef.current;
      if (document.hasFocus() || !status) {
        document.title = baseTitleRef.current;
        if (document.hasFocus() && status?.complete) {
          screenTitleStatusRef.current = null;
        }
        return;
      }

      const prefix = getScreenTitlePrefix(status, t);
      document.title = `${prefix}${baseTitleRef.current}`;
    }

    window.addEventListener('focus', applyScreenTitle);
    window.addEventListener('blur', applyScreenTitle);
    return () => {
      window.removeEventListener('focus', applyScreenTitle);
      window.removeEventListener('blur', applyScreenTitle);
      document.title = baseTitleRef.current;
    };
  }, [t]);

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

    const shouldRecord = Boolean(activeUrl)
      && lastRecordedUrlRef.current !== activeUrl;
    let nextResult = EMPTY_RESULT;
    let parsed = false;
    if (activeUrl) {
      try {
        nextResult = cwqr.parseUrl(activeUrl, language, resources);
        parsed = Boolean(nextResult.mode || nextResult.model?.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      lastRecordedUrlRef.current = '';
    }

    setResult(nextResult);
    setEditorValue(cloneResult(nextResult));
    setRenderVersion(version => version + 1);

    if (shouldRecord) lastRecordedUrlRef.current = activeUrl;
    if (parsed && shouldRecord) {
      parseHistoryRepository.upsert(activeUrl, {
        model: nextResult.model?.name || '',
        mode: nextResult.mode?.mainName || '',
        subMode: nextResult.mode?.subName || '',
      }).then(() => parseHistoryRepository.list())
        .then(setHistoryRecords)
        .catch(error => console.error(error));
    }
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

  function commitUrl(nextUrl = inputUrl) {
    setInputUrl(nextUrl);
    setActiveUrl(nextUrl);
    const currentHash = window.location.hash.substring(1);
    if (currentHash === nextUrl) return;
    window.location.hash = nextUrl;
  }

  function handleUrlControlFocusOut(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    commitUrl();
  }

  function submitUrl(event) {
    event.preventDefault();
    document.activeElement?.blur();
  }

  function clearUrl() {
    setInputUrl('');
    setActiveUrl('');
    window.location.hash = '';
    urlInputRef.current?.focus();
  }

  function acceptScannedUrl(url) {
    setStreamScannerMode(null);
    setScreenStream(null);
    closeImageSession();
    commitUrl(url.replace(/[\r\n]+/g, ''));
  }

  function setScreenScanProgress(progress) {
    screenTitleStatusRef.current = progress;
    if (!progress) {
      document.title = baseTitleRef.current;
      return;
    }
    if (!document.hasFocus()) {
      const prefix = getScreenTitlePrefix(progress, t);
      document.title = `${prefix}${baseTitleRef.current}`;
    }
  }

  function closeStreamScanner() {
    setStreamScannerMode(null);
    setScreenStream(null);
    screenTitleStatusRef.current = null;
    document.title = baseTitleRef.current;
  }

  async function openScreenScanner() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setAppMessage({
        title: t('screen-error-title'),
        body: t('screen-error-unsupported'),
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true,
      });
      setScreenStream(stream);
      setScreenScanProgress({ pending: [], total: 0, complete: false });
      setStreamScannerMode('screen');
    } catch (error) {
      if (error?.name !== 'NotAllowedError') {
        setAppMessage({
          title: t('screen-error-title'),
          body: t('screen-error-generic'),
        });
      }
    }
  }

  function revokePreviews(previews) {
    previews.filter(Boolean).forEach(preview => URL.revokeObjectURL(preview));
  }

  function closeImageSession() {
    setImageSession(current => {
      if (current) revokePreviews(current.previews);
      return null;
    });
  }

  async function runImageTask(task) {
    if (imageBusyRef.current) return;
    imageBusyRef.current = true;
    setImageBusy(true);
    try {
      return await task();
    } finally {
      setImageProgress(null);
      imageBusyRef.current = false;
      setImageBusy(false);
    }
  }

  async function decodeImageBlobs(
    blobs,
    maxNumberOfSymbols,
    showProcessingDialog,
  ) {
    const imageBlobs = blobs.filter(blob => blob?.type?.startsWith('image/'));
    const decoded = [];

    for (const [index, blob] of imageBlobs.entries()) {
      if (showProcessingDialog) {
        setImageProgress({
          current: index + 1,
          total: imageBlobs.length,
        });
      }
      await yieldForPaint();

      try {
        let prepared = await prepareQrImage(blob);
        let validResults = await readValidQrCodes(
          prepared.imageData,
          maxNumberOfSymbols,
        );

        if (!validResults.length && prepared.scaled) {
          await yieldForPaint();
          prepared = await prepareQrImage(blob, Number.POSITIVE_INFINITY);
          validResults = await readValidQrCodes(
            prepared.imageData,
            maxNumberOfSymbols,
          );
        }
        if (!validResults.length) continue;

        for (const result of validResults) {
          decoded.push({
            result,
            preview: await createQrPreviewUrl(prepared.canvas, result.position),
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    return decoded;
  }

  async function processImageBlobs(
    blobs,
    source,
    {
      initialMulti = false,
      showProcessingDialog = false,
    } = {},
  ) {
    const items = await decodeImageBlobs(
      blobs,
      initialMulti ? MULTI_QR_LIMIT : 1,
      showProcessingDialog,
    );
    if (!items.length) {
      setAppMessage({
        title: t('image-read-error-title'),
        body: t('image-read-error-body'),
      });
      return;
    }

    if (initialMulti) {
      const resolution = resolveInitialQrResults(items.map(item => item.result));
      if (resolution.status === 'empty') {
        revokePreviews(items.map(item => item.preview));
        setAppMessage({
          title: t('image-read-error-title'),
          body: t('image-read-error-body'),
        });
        return;
      }
      if (resolution.status === 'complete') {
        revokePreviews(items.map(item => item.preview));
        acceptScannedUrl(resolution.text);
        return;
      }

      const selectedResults = new Set(resolution.results);
      const selectedItems = items.filter(item => selectedResults.has(item.result));
      revokePreviews(
        items
          .filter(item => !selectedResults.has(item.result))
          .map(item => item.preview),
      );
      const consumed = addQrImageResults(
        createEmptyImageSequenceSession(source),
        selectedItems,
      );
      revokePreviews(consumed.rejectedPreviews);
      if (consumed.status === 'complete') {
        revokePreviews(selectedItems.map(item => item.preview));
        acceptScannedUrl(consumed.completedText);
        return;
      }
      setImageSession(consumed.session);
      return;
    }

    const current = imageSession?.source === source
      ? imageSession
      : createEmptyImageSequenceSession(source);
    const consumed = addQrImageResults(current, items);
    revokePreviews(consumed.rejectedPreviews);

    if (consumed.status === 'mixed') {
      setAppMessage({
        title: t('image-sequence-mixed-title'),
        body: t('image-sequence-mixed-body'),
      });
      return;
    }

    if (consumed.status === 'complete') {
      revokePreviews(items.map(item => item.preview));
      acceptScannedUrl(consumed.completedText);
      return;
    }

    setImageSession(consumed.session);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileSelection(event) {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = '';
    if (files.length) {
      const fromPage = !imageSession;
      await runImageTask(() => processImageBlobs(files, 'file', {
        initialMulti: files.length === 1 && fromPage,
        showProcessingDialog: fromPage,
      }));
    }
  }

  async function readClipboard() {
    if (!navigator.clipboard?.read) {
      if (navigator.clipboard?.readText) {
        await runImageTask(async () => {
          try {
            const text = (await navigator.clipboard.readText()).trim();
            if (text) {
              acceptScannedUrl(text);
              return;
            }
          } catch {
            // Fall through to the common clipboard error.
          }
          setAppMessage({
            title: t('clipboard-error-title'),
            body: t('clipboard-error-body'),
          });
        });
        return;
      }
      setAppMessage({
        title: t('clipboard-error-title'),
        body: t('clipboard-error-body'),
      });
      return;
    }

    await runImageTask(async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          if (!item.types.includes('text/plain')) continue;
          const value = (await (await item.getType('text/plain')).text()).trim();
          if (value) {
            acceptScannedUrl(value);
            return;
          }
        }

        const images = [];
        for (const item of clipboardItems) {
          const imageType = item.types.find(type => type.startsWith('image/'));
          if (imageType) images.push(await item.getType(imageType));
        }
        if (!images.length) {
          setAppMessage({
            title: t('clipboard-error-title'),
            body: t('clipboard-error-body'),
          });
          return;
        }
        await processImageBlobs(images, 'clipboard', {
          initialMulti: imageSession?.source !== 'clipboard',
          showProcessingDialog: imageSession?.source !== 'clipboard',
        });
      } catch (error) {
        console.error(error);
        setAppMessage({
          title: t('clipboard-error-title'),
          body: t('clipboard-error-body'),
        });
      }
    });
  }

  function handleDownload(key) {
    const payload = downloads[key];
    if (!payload) return;
    const content = payload.bom ? `\ufeff${payload.content}` : payload.content;
    download(`${payload.prefix}-${Date.now()}.csv`, content, 'text/csv;charset=utf-8');
  }

  async function runHistoryTask(task) {
    setHistoryBusy(true);
    try {
      await task();
      setHistoryRecords(await parseHistoryRepository.list());
      return true;
    } catch (error) {
      console.error(error);
      setAppMessage({
        title: t('history-error-title'),
        body: t('history-error-body'),
      });
      return false;
    } finally {
      setHistoryBusy(false);
    }
  }

  function selectHistoryUrl(url) {
    setHistoryOpen(false);
    commitUrl(url);
  }

  async function importHistory(text) {
    await runHistoryTask(async () => {
      const { skipped } = await parseHistoryRepository.importJson(text);
      setAppMessage({
        title: t('history-import-success-title'),
        body: skipped
          ? t('history-import-success-skipped', { count: skipped })
          : t('history-import-success'),
      });
    });
  }

  async function exportHistory() {
    await runHistoryTask(async () => {
      const content = await parseHistoryRepository.exportJson();
      download(
        `classwiz-qr-history-${Date.now()}.json`,
        content,
        'application/json;charset=utf-8',
      );
    });
  }

  return (
    <div
      id="app"
      class={initialized ? undefined : 'app-initializing'}
      aria-busy={!initialized}
    >
      <form id="qr-form" onSubmit={submitUrl}>
        {(!hideLanguage || !hideUrl) && (
          <div class="controls-stack">
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
              <div class="form-field">
                <label>{t('scan-title')}</label>
                <div class="scan-actions">
                  <div class="scan-action-pair">
                    <ScanOptionButton
                      icon={CameraIcon}
                      label={t('scan-camera')}
                      onClick={() => setStreamScannerMode('camera')}
                    />
                    <ScanOptionButton
                      icon={ScreenIcon}
                      label={t('scan-screen')}
                      onClick={openScreenScanner}
                    />
                  </div>
                  <div class="scan-action-pair">
                    <ScanOptionButton
                      icon={FileImageIcon}
                      label={t('scan-file')}
                      onClick={openFilePicker}
                    />
                    <ScanOptionButton
                      icon={ClipboardIcon}
                      label={t('scan-clipboard')}
                      onClick={readClipboard}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!hideUrl && (
          <div class="form-field url-field">
            <div class="url-field-heading">
              <label for="qrUrl">{t('qr-url-label')}</label>
              <button
                class="history-open-button"
                type="button"
                onClick={() => setHistoryOpen(true)}
              >
                <HistoryIcon/>
                <span>{t('history-title')}</span>
              </button>
            </div>
            <div class="url-input-shell" onFocusOut={handleUrlControlFocusOut}>
              <textarea
                ref={urlInputRef}
                id="qrUrl"
                rows="1"
                placeholder="http://......"
                value={inputUrl}
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
                <button
                  class="form-button url-input-button copy-button"
                  type="button"
                  aria-label={t('copy-button')}
                  title={t('copy-button')}
                  disabled={!inputUrl}
                  onClick={() => copyToClipboard(inputUrl, urlInputRef.current)}
                >
                  <CopyIcon/>
                </button>
                <button
                  class="form-button url-input-button submit-button"
                  type="submit"
                  aria-label={t('parse-button')}
                  title={t('parse-button')}
                >
                  <ParseIcon/>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
      <input
        ref={fileInputRef}
        class="visually-hidden-file-input"
        type="file"
        accept="image/*"
        multiple
        tabindex="-1"
        aria-hidden="true"
        onChange={handleFileSelection}
      />

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
      <CameraScannerDialog
        open={Boolean(streamScannerMode)}
        mode={streamScannerMode || 'camera'}
        initialStream={screenStream}
        t={t}
        onClose={closeStreamScanner}
        onScan={acceptScannedUrl}
        onProgress={streamScannerMode === 'screen' ? setScreenScanProgress : undefined}
      />
      <ImageSequenceDialog
        session={imageSession}
        busy={imageBusy}
        t={t}
        onClose={closeImageSession}
        onContinue={imageSession?.source === 'clipboard' ? readClipboard : openFilePicker}
      />
      <ImageProcessingDialog progress={imageProgress} t={t}/>
      <HistoryDialog
        open={historyOpen}
        records={historyRecords}
        language={language}
        busy={historyBusy}
        t={t}
        onClose={() => setHistoryOpen(false)}
        onSelect={selectHistoryUrl}
        onUpdateNote={(url, note) => runHistoryTask(
          () => parseHistoryRepository.updateNote(url, note),
        )}
        onDelete={url => runHistoryTask(() => parseHistoryRepository.remove(url))}
        onClear={() => runHistoryTask(() => parseHistoryRepository.clear())}
        onImport={importHistory}
        onExport={exportHistory}
      />
      <MessageDialog
        open={Boolean(appMessage)}
        title={appMessage?.title || ''}
        confirmLabel={t('dialog-confirm')}
        onConfirm={() => setAppMessage(null)}
      >
        {appMessage?.body}
      </MessageDialog>
    </div>
  );
}
