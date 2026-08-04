const getImageType = item => item.types.find(type => type.startsWith('image/'));

async function readText(item) {
  if (!item.types.includes('text/plain')) return '';
  try {
    return (await (await item.getType('text/plain')).text()).trim();
  } catch {
    return '';
  }
}

/**
 * Preserve explicit text-copy behavior while treating an item that contains
 * both an image and text as image content with a text fallback.
 */
export async function readClipboardContent(items) {
  for (const item of items) {
    if (getImageType(item)) continue;
    const text = await readText(item);
    if (text) return { text, images: [], fallbackText: '' };
  }

  const images = [];
  let fallbackText = '';
  for (const item of items) {
    const imageType = getImageType(item);
    if (!imageType) continue;
    images.push(await item.getType(imageType));
    if (!fallbackText) fallbackText = await readText(item);
  }

  return { text: '', images, fallbackText };
}
