import { useEffect, useRef, useState, } from 'preact/hooks';
import useModalDialog from '../../hooks/useModalDialog.js';

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

  useModalDialog(dialogRef, open);

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
