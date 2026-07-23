import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  loadScratchblocks,
  loadScratchLanguage,
  scratchLanguageCodes,
  scratchLanguages,
} from '../../scripts/scratchblocks.js';
import { copyToClipboard, download, downloadUrl } from '../../scripts/downloads.js';
import { matchSupportedLocale } from '../../scripts/locales.js';

const SCRATCH_STYLES = [
  { value: 'scratch2', label: 'Scratch 2.0' },
  { value: 'scratch3', label: 'Scratch 3.0' },
  { value: 'scratch3-high-contrast', label: 'Scratch 3.0 (high-contrast)' },
];

function getLanguageLabel({ code, name }) {
  return `${name} (${code})`;
}

function findLanguage(value) {
  const normalizedValue = value.trim().toLocaleLowerCase();
  return scratchLanguages.find(language => (
    language.code.toLocaleLowerCase() === normalizedValue
    || language.name.toLocaleLowerCase() === normalizedValue
    || getLanguageLabel(language).toLocaleLowerCase() === normalizedValue
  ));
}

export default function ScratchBlocksView({ source, siteLanguage, t }) {
  const renderRef = useRef(null);
  const renderedViewRef = useRef(null);
  const languageControlRef = useRef(null);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [scratchStyle, setScratchStyle] = useState('scratch3');
  const [translatedSource, setTranslatedSource] = useState(source);
  const [status, setStatus] = useState('loading');
  const [copied, setCopied] = useState(false);

  const visibleLanguages = useMemo(() => {
    const query = languageInput.trim().toLocaleLowerCase();
    if (!query) return scratchLanguages;
    return scratchLanguages.filter(language => (
      language.code.toLocaleLowerCase().includes(query)
      || language.name.toLocaleLowerCase().includes(query)
      || getLanguageLabel(language).toLocaleLowerCase().includes(query)
    ));
  }, [languageInput]);

  useEffect(() => {
    const defaultLanguage = matchSupportedLocale(siteLanguage, scratchLanguageCodes);
    const language = scratchLanguages.find(({ code }) => code === defaultLanguage);
    setTargetLanguage(defaultLanguage);
    setLanguageInput(getLanguageLabel(language));
  }, [siteLanguage]);

  useEffect(() => {
    if (!languageMenuOpen) return undefined;

    function closeMenuOnOutsidePointer(event) {
      if (languageControlRef.current?.contains(event.target)) return;
      setLanguageMenuOpen(false);
      restoreSelectedLanguage();
    }

    document.addEventListener('pointerdown', closeMenuOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeMenuOnOutsidePointer);
  }, [languageMenuOpen, targetLanguage]);

  useEffect(() => {
    if (!targetLanguage || !renderRef.current) return undefined;

    let cancelled = false;
    setStatus('loading');
    setCopied(false);
    renderedViewRef.current = null;

    async function renderBlocks() {
      try {
        const [scratchblocks, locale] = await Promise.all([
          loadScratchblocks(),
          loadScratchLanguage(targetLanguage),
        ]);
        if (cancelled) return;

        if (locale && !scratchblocks.allLanguages[targetLanguage]) {
          scratchblocks.loadLanguages({ [targetLanguage]: locale });
        }

        const document = scratchblocks.parse(source, { languages: ['en'] });
        if (targetLanguage !== 'en') {
          document.translate(scratchblocks.allLanguages[targetLanguage]);
        }

        const nextSource = scratchblocks.stringify(document);
        const scale = scratchStyle.startsWith('scratch3') ? 0.675 : 1;
        const view = scratchblocks.newView(document, { style: scratchStyle, scale });
        const svg = view.render();
        svg.classList.add(`scratchblocks-style-${scratchStyle}`);
        if (cancelled || !renderRef.current) return;

        renderRef.current.replaceChildren(svg);
        renderedViewRef.current = view;
        setTranslatedSource(nextSource);
        setStatus('ready');
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          renderRef.current?.replaceChildren();
          renderedViewRef.current = null;
          setTranslatedSource(source);
          setStatus('error');
        }
      }
    }

    renderBlocks();
    return () => {
      cancelled = true;
    };
  }, [source, targetLanguage, scratchStyle]);

  function updateLanguageInput(event) {
    setLanguageInput(event.currentTarget.value);
    setLanguageMenuOpen(true);
  }

  function selectLanguage(language) {
    setTargetLanguage(language.code);
    setLanguageInput(getLanguageLabel(language));
    setLanguageMenuOpen(false);
  }

  function restoreSelectedLanguage() {
    const language = scratchLanguages.find(({ code }) => code === targetLanguage);
    if (language) setLanguageInput(getLanguageLabel(language));
  }

  function handleLanguageKeyDown(event) {
    if (event.key === 'Escape') {
      restoreSelectedLanguage();
      setLanguageMenuOpen(false);
      return;
    }
    if (event.key !== 'Enter') return;

    const language = findLanguage(languageInput) || visibleLanguages[0];
    if (language) {
      event.preventDefault();
      selectLanguage(language);
    }
  }

  function toggleLanguageMenu() {
    if (languageMenuOpen) {
      restoreSelectedLanguage();
      setLanguageMenuOpen(false);
      return;
    }
    setLanguageInput('');
    setLanguageMenuOpen(true);
  }

  async function copyTranslation() {
    const copiedSuccessfully = await copyToClipboard(translatedSource);
    if (copiedSuccessfully) setCopied(true);
  }

  function exportSvg() {
    const view = renderedViewRef.current;
    if (!view) return;

    download(
      `scratch-blocks-${Date.now()}.svg`,
      view.exportSVGString(),
      'image/svg+xml;charset=utf-8',
    );
  }

  function exportPng() {
    const view = renderedViewRef.current;
    if (!view) return;

    view.exportPNG(url => {
      downloadUrl(`scratch-blocks-${Date.now()}.png`, url);
      if (url.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(url), 0);
      }
    }, 2);
  }

  return (
    <div class="scratchblocks-view">
      <div class="scratchblocks-toolbar">
        <div class="scratchblocks-field scratchblocks-style-field">
          <label for="scratchblocks-style">
            {t('calc-algorithm-scratch-blocks-style')}
          </label>
          <select
            id="scratchblocks-style"
            value={scratchStyle}
            onChange={event => setScratchStyle(event.currentTarget.value)}
          >
            {SCRATCH_STYLES.map(style => (
              <option value={style.value} key={style.value}>{style.label}</option>
            ))}
          </select>
        </div>
        <div class="scratchblocks-field">
          <label for="scratchblocks-language-input">
            {t('calc-algorithm-scratch-blocks-language')}
          </label>
          <div class="scratchblocks-combobox" ref={languageControlRef}>
            <input
              id="scratchblocks-language-input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="scratchblocks-language-list"
              aria-expanded={languageMenuOpen}
              value={languageInput}
              placeholder={t('calc-algorithm-scratch-blocks-language-search-placeholder')}
              onFocus={event => {
                event.currentTarget.select();
                setLanguageMenuOpen(true);
              }}
              onInput={updateLanguageInput}
              onKeyDown={handleLanguageKeyDown}
            />
            <button
              type="button"
              class="scratchblocks-combobox-toggle"
              aria-label={t('calc-algorithm-scratch-blocks-language-open')}
              aria-expanded={languageMenuOpen}
              onClick={toggleLanguageMenu}
            >{languageMenuOpen ? '▲' : '▼'}</button>
            {languageMenuOpen && (
              <ul id="scratchblocks-language-list" class="scratchblocks-language-list" role="listbox">
                {visibleLanguages.map(language => (
                  <li key={language.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={language.code === targetLanguage}
                      onClick={() => selectLanguage(language)}
                    >{getLanguageLabel(language)}</button>
                  </li>
                ))}
                {visibleLanguages.length === 0 && (
                  <li class="empty">{t('calc-algorithm-scratch-blocks-language-empty')}</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div class="scratchblocks-export-actions">
        <button type="button" class="download" onClick={exportSvg} disabled={status !== 'ready'}>
          {t('calc-algorithm-scratch-blocks-export-svg')}
        </button>
        <button type="button" class="download" onClick={exportPng} disabled={status !== 'ready'}>
          {t('calc-algorithm-scratch-blocks-export-png')}
        </button>
      </div>

      <div
        class="scratchblocks-render"
        ref={renderRef}
        aria-busy={status === 'loading'}
        aria-label={t('calc-algorithm-scratch-blocks-preview')}
      />
      {status === 'loading' && <div class="scratchblocks-status">{t('loading')}</div>}
      {status === 'error' && (
        <div class="scratchblocks-status error">{t('calc-algorithm-scratch-blocks-error')}</div>
      )}

      <div class="scratchblocks-copy-action">
        <button type="button" class="download" onClick={copyTranslation} disabled={status !== 'ready'}>
          {copied ? t('calc-algorithm-scratch-blocks-copied') : t('calc-algorithm-scratch-blocks-copy')}
        </button>
      </div>
      <pre>{translatedSource}</pre>
    </div>
  );
}
