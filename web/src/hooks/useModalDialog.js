import { useLayoutEffect } from 'preact/hooks';

export default function useModalDialog(dialogRef, open) {
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [dialogRef, open]);
}
