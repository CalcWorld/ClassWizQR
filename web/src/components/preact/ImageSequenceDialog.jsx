import { useRef } from 'preact/hooks';
import { BackIcon, ClipboardIcon, FileImageIcon } from './Icons.jsx';
import useModalDialog from '../../hooks/useModalDialog.js';

export default function ImageSequenceDialog(
  {
    session,
    busy,
    t,
    onClose,
    onContinue,
  }) {
  const dialogRef = useRef(null);
  const open = Boolean(session);
  const source = session?.source;
  const Icon = source === 'clipboard' ? ClipboardIcon : FileImageIcon;
  const title = source === 'clipboard'
    ? t('clipboard-scanner-title')
    : t('file-scanner-title');
  const actionLabel = source === 'clipboard'
    ? t('clipboard-continue')
    : t('file-continue');

  useModalDialog(dialogRef, open);

  return (
    <dialog
      ref={dialogRef}
      class="app-panel-dialog camera-scanner-dialog image-sequence-dialog"
      aria-label={title}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
    >
      <div class="camera-scanner-shell">
        <header class="camera-scanner-header">
          <button
            class="camera-back-button"
            type="button"
            aria-label={t('scanner-close')}
            title={t('scanner-close')}
            onClick={onClose}
          >
            <BackIcon/>
          </button>
          <strong>{title}</strong>
          <button
            class="form-button scanner-header-action"
            type="button"
            disabled={busy}
            onClick={onContinue}
          >
            <Icon/>
            {busy ? t('scanner-reading') : actionLabel}
          </button>
        </header>

        {session && (
          <div
            class="image-sequence-grid"
            aria-label={t('camera-sequence-progress')}
          >
            {session.previews.map((preview, index) => (
              preview ? (
                <figure class="image-sequence-cell is-scanned" key={index}>
                  <img src={preview} alt=""/>
                  <figcaption
                    aria-label={`${index + 1}: ${t('camera-sequence-scanned')}`}
                  >
                    {index + 1}
                  </figcaption>
                </figure>
              ) : (
                <button
                  class="image-sequence-cell image-sequence-placeholder"
                  type="button"
                  disabled={busy}
                  aria-label={`${index + 1}: ${t('camera-sequence-pending')}; ${
                    actionLabel
                  }`}
                  onClick={onContinue}
                  key={index}
                >
                  <span aria-hidden="true">{index + 1}</span>
                </button>
              )
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
