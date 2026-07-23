export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      if (!document.execCommand('copy')) throw new Error('Copy command was rejected.');
      return true;
    } catch (error) {
      console.error('Failed to copy to the clipboard.', error);
      window.prompt('', text);
      return false;
    } finally {
      textarea.remove();
    }
  }
}

export function elementSelection(dom) {
  if (!dom || !(dom instanceof HTMLElement)) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(dom);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export function download(filename, content, type) {
  const a = document.createElement('a');
  const file = new Blob([content], { type });
  const objectUrl = URL.createObjectURL(file);
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
