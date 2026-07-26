import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import * as cwqr from '../../../../src/index.js';
import { copyToClipboard, download } from '../../scripts/downloads.js';
import { translate } from '../../scripts/i18n.js';
import BasicInfo from './BasicInfo.jsx';
import CameraScannerDialog from './CameraScannerDialog.jsx';
import CalculationView from './CalculationView.jsx';
import ImageSequenceDialog from './ImageSequenceDialog.jsx';
import JsonResult from './JsonResult.jsx';
import MessageDialog from './MessageDialog.jsx';
import ResultPanel from './ResultPanel.jsx';
import { CameraIcon, ClearIcon, ClipboardIcon, CopyIcon, FileImageIcon, ParseIcon, ScreenIcon, } from './Icons.jsx';
import SettingsView from './SettingsView.jsx';
import { addQrImageResults, createEmptyImageSequenceSession, } from '../../scripts/qrImageSequence.js';
import { createQrPreviewUrl, prepareQrImage, } from '../../scripts/qrPreview.js';
import { readQrCodes } from '../../scripts/qrReader.js';

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

function getIntrinsicButtonWidths(container) {
  const style = getComputedStyle(container.firstElementChild);
  const inlineInsets = ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth']
    .reduce((total, property) => total + Number.parseFloat(style[property]), 0);
  return Array.from(
    container.children,
    button => button.firstElementChild.getBoundingClientRect().width + inlineInsets,
  );
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
  const [appMessage, setAppMessage] = useState(null);
  const scanFieldRef = useRef(null);
  const urlInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const baseTitleRef = useRef('');
  const screenTitleStatusRef = useRef(null);
  const imageBusyRef = useRef(false);

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
    if (input.closest('.url-input-shell')?.matches(':focus-within')) fitUrlInput(input);
  }, [inputUrl]);

  useEffect(() => {
    const input = urlInputRef.current;
    if (!input || typeof ResizeObserver === 'undefined') return undefined;

    let previousWidth = input.clientWidth;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === previousWidth) return;
      previousWidth = entry.contentRect.width;
      if (input.closest('.url-input-shell')?.matches(':focus-within')) fitUrlInput(input);
    });
    observer.observe(input);
    return () => observer.disconnect();
  }, [hideUrl]);

  useLayoutEffect(() => {
    const scanField = scanFieldRef.current;
    const container = scanField?.querySelector('.scan-actions');
    if (!scanField || !container) return undefined;

    const scanLabel = scanField.querySelector(':scope > label');
    const scanContents = container.querySelectorAll('.scan-option-content');
    let pendingFrame = 0;

    const updateScanLayout = () => {
      const widths = getIntrinsicButtonWidths(container);
      const gap = Number.parseFloat(getComputedStyle(container).columnGap) || 0;
      const fourColumnWidth = widths.reduce((total, width) => total + width, 0)
        + gap * (widths.length - 1);
      const twoColumnWidth = Math.max(...widths) * 2 + gap;
      const scanLabelWidth = scanLabel?.scrollWidth || 0;
      const fourColumnThreshold = `${Math.max(fourColumnWidth, scanLabelWidth)}px`;

      // Flexbox uses this intrinsic threshold to decide whether the scan field
      // belongs beside the language field or on its own row.
      scanField.style.setProperty('--scan-four-column-width', fourColumnThreshold);

      const availableWidth = container.clientWidth;
      const nextColumns = availableWidth >= fourColumnWidth
        ? 4
        : availableWidth >= twoColumnWidth ? 2 : 1;

      scanField.dataset.columns = String(nextColumns);
    };

    updateScanLayout();
    if (typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(updateScanLayout);
    });
    observer.observe(scanField);
    if (scanLabel) observer.observe(scanLabel);
    for (const content of scanContents) {
      observer.observe(content);
    }

    return () => {
      cancelAnimationFrame(pendingFrame);
      observer.disconnect();
    };
  }, [hideUrl]);

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
    urlInputRef.current.style.height = '';
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

  async function decodeImageBlobs(blobs) {
    const imageBlobs = blobs.filter(blob => blob?.type?.startsWith('image/'));
    const decoded = await Promise.all(imageBlobs.map(async blob => {
      try {
        const prepared = await prepareQrImage(blob);
        const results = await readQrCodes(prepared.imageData);
        const result = results.find(item => item.isValid && item.symbology === 'QRCode');
        if (!result) return null;
        return {
          result,
          preview: await createQrPreviewUrl(prepared.canvas, result.position),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    }));
    return decoded.filter(Boolean);
  }

  async function processImageBlobs(blobs, source, lockHeld = false) {
    if (!lockHeld) {
      if (imageBusyRef.current) return;
      imageBusyRef.current = true;
      setImageBusy(true);
    }
    try {
      const items = await decodeImageBlobs(blobs);
      if (!items.length) {
        setAppMessage({
          title: t('image-read-error-title'),
          body: t('image-read-error-body'),
        });
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
        revokePreviews(current.previews);
        revokePreviews(items.map(item => item.preview));
        acceptScannedUrl(consumed.completedText);
        return;
      }

      setImageSession(consumed.session);
    } finally {
      if (!lockHeld) {
        imageBusyRef.current = false;
        setImageBusy(false);
      }
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileSelection(event) {
    const files = Array.from(event.currentTarget.files || []);
    event.currentTarget.value = '';
    if (files.length) await processImageBlobs(files, 'file');
  }

  async function readClipboard() {
    if (imageBusyRef.current) return;
    if (!navigator.clipboard?.read) {
      if (navigator.clipboard?.readText) {
        try {
          const text = (await navigator.clipboard.readText()).trim();
          if (text) {
            acceptScannedUrl(text);
            return;
          }
        } catch {
          // Fall through to the common clipboard error.
        }
      }
      setAppMessage({
        title: t('clipboard-error-title'),
        body: t('clipboard-error-body'),
      });
      return;
    }

    imageBusyRef.current = true;
    setImageBusy(true);
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
      await processImageBlobs(images, 'clipboard', true);
    } catch (error) {
      console.error(error);
      setAppMessage({
        title: t('clipboard-error-title'),
        body: t('clipboard-error-body'),
      });
    } finally {
      imageBusyRef.current = false;
      setImageBusy(false);
    }
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
      <form id="qr-form" onSubmit={submitUrl}>
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
              <div
                class="form-field scan-field"
                data-columns="4"
                ref={scanFieldRef}
              >
                <label>{t('scan-title')}</label>
                <div class="scan-actions">
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
            )}
          </div>
        )}
        {!hideUrl && (
          <div class="form-field url-field">
            <label for="qrUrl">{t('qr-url-label')}</label>
            <div class="url-input-shell" onFocusOut={handleUrlControlFocusOut}>
              <textarea
                ref={urlInputRef}
                id="qrUrl"
                rows="1"
                placeholder="http://......"
                value={inputUrl}
                onFocus={event => fitUrlInput(event.currentTarget)}
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
