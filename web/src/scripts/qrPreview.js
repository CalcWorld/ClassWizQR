const PREVIEW_SIZE = 512;
const CROP_PADDING_RATIO = 0.14;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function calculateQrSquareCrop(
  position,
  imageWidth,
  imageHeight,
  paddingRatio = CROP_PADDING_RATIO,
) {
  const points = position && [
    position.topLeft,
    position.topRight,
    position.bottomLeft,
    position.bottomRight,
  ];
  if (
    !points
    || !points.every(point => Number.isFinite(point?.x) && Number.isFinite(point?.y))
    || imageWidth <= 0
    || imageHeight <= 0
  ) {
    return null;
  }

  const left = Math.min(...points.map(point => point.x));
  const right = Math.max(...points.map(point => point.x));
  const top = Math.min(...points.map(point => point.y));
  const bottom = Math.max(...points.map(point => point.y));
  const qrSize = Math.max(right - left, bottom - top);
  if (qrSize <= 0) return null;

  const size = Math.min(
    Math.max(1, qrSize * (1 + paddingRatio * 2)),
    imageWidth,
    imageHeight,
  );
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;

  return {
    x: clamp(centerX - size / 2, 0, imageWidth - size),
    y: clamp(centerY - size / 2, 0, imageHeight - size),
    size,
  };
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Unable to create the QR preview image.'));
      }
    }, 'image/png');
  });
}

function loadImageElement(imageBlob) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(imageBlob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        close() {
        },
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to decode the QR preview image.'));
    };
    image.src = objectUrl;
  });
}

async function loadDrawable(imageBlob) {
  if (typeof createImageBitmap !== 'function') return loadImageElement(imageBlob);

  const bitmap = await createImageBitmap(imageBlob);
  return {
    source: bitmap,
    width: bitmap.width,
    height: bitmap.height,
    close() {
      bitmap.close();
    },
  };
}

export async function prepareQrImage(imageBlob) {
  const drawable = await loadDrawable(imageBlob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = drawable.width;
    canvas.height = drawable.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Unable to create a canvas context.');

    // Some decoders discard alpha and expose transparent RGB pixels as black.
    // Flatten onto white before ZXing sees the pixels so transparent QR PNGs
    // retain the same contrast they have on a light page.
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(drawable.source, 0, 0);

    return {
      canvas,
      imageData: context.getImageData(0, 0, canvas.width, canvas.height),
    };
  } finally {
    drawable.close();
  }
}

export async function createQrPreviewUrl(sourceCanvas, position) {
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create a canvas context.');

  context.fillStyle = '#fff';
  context.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

  const crop = calculateQrSquareCrop(
    position,
    sourceCanvas.width,
    sourceCanvas.height,
  );
  if (crop) {
    context.drawImage(
      sourceCanvas,
      crop.x,
      crop.y,
      crop.size,
      crop.size,
      0,
      0,
      PREVIEW_SIZE,
      PREVIEW_SIZE,
    );
  } else {
    const scale = Math.min(
      PREVIEW_SIZE / sourceCanvas.width,
      PREVIEW_SIZE / sourceCanvas.height,
    );
    const width = sourceCanvas.width * scale;
    const height = sourceCanvas.height * scale;
    context.drawImage(
      sourceCanvas,
      (PREVIEW_SIZE - width) / 2,
      (PREVIEW_SIZE - height) / 2,
      width,
      height,
    );
  }

  return URL.createObjectURL(await canvasToBlob(canvas));
}
