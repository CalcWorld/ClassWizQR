import { useEffect, useLayoutEffect, useRef, useState, } from 'preact/hooks';

const SHOW_DELAY_MS = 300;

export default function ImageProcessingDialog({
  progress,
  t,
}) {
  const dialogRef = useRef(null);
  const requested = Boolean(progress);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const open = requested && delayElapsed;

  useEffect(() => {
    if (!requested) {
      setDelayElapsed(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setDelayElapsed(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [requested]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      class="message-dialog image-processing-dialog"
      aria-label={t('image-processing-title')}
      onCancel={event => event.preventDefault()}
    >
      <div class="image-processing-content">
        <span class="image-processing-spinner" aria-hidden="true"/>
        <div>
          <h2>{t('image-processing-title')}</h2>
          <div role="status" aria-live="polite">
            {progress && t('image-processing-progress', progress)}
          </div>
        </div>
      </div>
    </dialog>
  );
}
