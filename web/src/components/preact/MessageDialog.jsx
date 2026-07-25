import { useEffect, useId, useRef } from 'preact/hooks';

export default function MessageDialog(
  {
    open,
    title,
    children,
    confirmLabel,
    onConfirm,
  }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      class="message-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={event => {
        event.preventDefault();
        onConfirm();
      }}
    >
      <div class="message-dialog-content">
        <h2 id={titleId}>{title}</h2>
        <div id={descriptionId} class="message-dialog-body">{children}</div>
        <div class="message-dialog-actions">
          <button
            class="form-button message-dialog-confirm"
            type="button"
            autofocus
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
