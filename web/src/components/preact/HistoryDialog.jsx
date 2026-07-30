import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, } from 'preact/hooks';
import useModalDialog from '../../hooks/useModalDialog.js';
import { MAX_HISTORY_ITEMS, MAX_HISTORY_NOTE_LENGTH, } from '../../scripts/parseHistory.js';
import { BackIcon, CheckIcon, DeleteIcon, EditIcon, ExportIcon, ImportIcon, } from './Icons.jsx';

const PAGE_SIZE = 50;

function recordSearchText(record) {
  return [
    record.note,
    record.summary.model,
    record.summary.mode,
    record.summary.subMode,
    record.url,
  ].join('\n').toLocaleLowerCase();
}

function recordSummaryText(record, t) {
  const parts = [
    record.summary.model,
    record.summary.mode,
    record.summary.subMode,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : t('history-summary-unavailable');
}

export default function HistoryDialog({
  open,
  records,
  language,
  busy,
  t,
  onClose,
  onSelect,
  onUpdateNote,
  onDelete,
  onClear,
  onImport,
  onExport,
}) {
  const dialogRef = useRef(null);
  const importInputRef = useRef(null);
  const noteInputRef = useRef(null);
  const titleId = useId();
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [editingUrl, setEditingUrl] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDeleteUrl, setConfirmDeleteUrl] = useState('');

  useModalDialog(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    setVisibleCount(PAGE_SIZE);
    setEditingUrl('');
    setConfirmClear(false);
    setConfirmDeleteUrl('');
  }, [open]);

  useLayoutEffect(() => {
    if (!editingUrl) return;
    noteInputRef.current?.focus();
    noteInputRef.current?.select();
  }, [editingUrl]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return records;
    return records.filter(record => recordSearchText(record).includes(normalizedQuery));
  }, [query, records]);

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }), [language]);

  async function saveNote(record) {
    const saved = await onUpdateNote(record.url, draftNote);
    if (saved !== false) setEditingUrl('');
  }

  async function handleImport(event) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (file) await onImport(await file.text());
  }

  return (
    <dialog
      ref={dialogRef}
      class="history-dialog"
      aria-labelledby={titleId}
      onCancel={event => {
        event.preventDefault();
        if (editingUrl) {
          setEditingUrl('');
          setConfirmDeleteUrl('');
          return;
        }
        onClose();
      }}
    >
      <div class="history-dialog-shell">
        <header class="history-dialog-header">
          <button
            class="history-icon-button"
            type="button"
            aria-label={t('history-close')}
            title={t('history-close')}
            onClick={onClose}
          >
            <BackIcon/>
          </button>
          <h2 id={titleId}>{t('history-title')}</h2>
          <span class="history-count">
            {records.length}/{MAX_HISTORY_ITEMS}
          </span>
        </header>

        <div class="history-controls">
          <input
            class="history-search"
            type="search"
            value={query}
            placeholder={t('history-search-placeholder')}
            aria-label={t('history-search-placeholder')}
            onInput={event => {
              setQuery(event.currentTarget.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
          <input
            ref={importInputRef}
            class="visually-hidden-file-input"
            type="file"
            accept="application/json,.json"
            tabindex="-1"
            onChange={handleImport}
          />
        </div>

        <div
          class="history-list"
          onScroll={event => {
            const element = event.currentTarget;
            if (element.scrollTop + element.clientHeight >= element.scrollHeight - 80) {
              setVisibleCount(count => Math.min(count + PAGE_SIZE, filteredRecords.length));
            }
          }}
        >
          <div class="history-toolbar">
            <button
              class="form-button history-tool-button"
              type="button"
              disabled={busy}
              onClick={() => importInputRef.current?.click()}
            >
              <ImportIcon/>
              {t('history-import')}
            </button>
            <button
              class="form-button history-tool-button"
              type="button"
              disabled={busy || !records.length}
              onClick={onExport}
            >
              <ExportIcon/>
              {t('history-export')}
            </button>
            <button
              class={`form-button history-tool-button history-clear-button${
                confirmClear ? ' is-confirming' : ''
              }`}
              type="button"
              disabled={busy || !records.length}
              onClick={async () => {
                if (!confirmClear) {
                  setConfirmClear(true);
                  return;
                }
                const cleared = await onClear();
                if (cleared !== false) setConfirmClear(false);
              }}
            >
              <DeleteIcon/>
              {t(confirmClear ? 'history-clear-confirm' : 'history-clear')}
            </button>
          </div>

          {!filteredRecords.length && (
            <div class="history-empty">
              {t(query.trim() ? 'history-no-results' : 'history-empty')}
            </div>
          )}

          {filteredRecords.slice(0, visibleCount).map(record => {
            const isEditing = editingUrl === record.url;
            const isConfirmingDelete = confirmDeleteUrl === record.url;
            const summary = recordSummaryText(record, t);
            const formattedDate = dateFormatter.format(new Date(record.lastParsedAt));
            const editLabel = t(isEditing ? 'history-note-save' : 'history-note-edit');
            const deleteLabel = t(
              isConfirmingDelete ? 'history-delete-confirm' : 'history-delete',
            );
            return (
              <article class="history-record" key={record.url}>
                {isEditing ? (
                  <div class="history-record-open is-editing">
                    <input
                      ref={noteInputRef}
                      class="history-note-input"
                      type="text"
                      maxlength={MAX_HISTORY_NOTE_LENGTH}
                      value={draftNote}
                      aria-label={t('history-note-label')}
                      placeholder={t('history-note-placeholder')}
                      onInput={event => setDraftNote(event.currentTarget.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          saveNote(record);
                        }
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          event.stopPropagation();
                          setEditingUrl('');
                        }
                      }}
                    />
                    {record.note && (
                      <span class="history-record-summary">
                        {summary}
                      </span>
                    )}
                    <span class="history-record-time">{formattedDate}</span>
                    <span class="history-record-url">{record.url}</span>
                  </div>
                ) : (
                  <button
                    class="history-record-open"
                    type="button"
                    title={record.url}
                    onClick={() => {
                      setConfirmDeleteUrl('');
                      onSelect(record.url);
                    }}
                  >
                    <strong>{record.note || summary}</strong>
                    {record.note && (
                      <span class="history-record-summary">{summary}</span>
                    )}
                    <span class="history-record-time">{formattedDate}</span>
                    <span class="history-record-url">{record.url}</span>
                  </button>
                )}

                <div class="history-record-actions">
                  <button
                    class="history-icon-button"
                    type="button"
                    aria-label={editLabel}
                    title={editLabel}
                    disabled={busy}
                    onClick={async () => {
                      setConfirmDeleteUrl('');
                      if (isEditing) {
                        await saveNote(record);
                        return;
                      }
                      setEditingUrl(record.url);
                      setDraftNote(record.note || summary);
                    }}
                  >
                    {isEditing ? <CheckIcon/> : <EditIcon/>}
                  </button>
                  <button
                    class={`history-icon-button history-delete-button${
                      isConfirmingDelete ? ' is-confirming' : ''
                    }`}
                    type="button"
                    aria-label={deleteLabel}
                    title={deleteLabel}
                    disabled={busy}
                    onClick={async () => {
                      if (!isConfirmingDelete) {
                        setConfirmDeleteUrl(record.url);
                        return;
                      }
                      const deleted = await onDelete(record.url);
                      if (deleted !== false) {
                        setConfirmDeleteUrl('');
                        if (isEditing) setEditingUrl('');
                      }
                    }}
                  >
                    {isConfirmingDelete ? <CheckIcon/> : <DeleteIcon/>}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
