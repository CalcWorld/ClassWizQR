let readerPromise;

export const MULTI_QR_LIMIT = 16;

async function loadReader() {
  if (!readerPromise) {
    readerPromise = import('zxing-wasm/reader').then(module => {
      const wasmUrl = new URL(
        'vendor/zxing-wasm/zxing_reader.wasm',
        document.baseURI,
      ).href;
      module.prepareZXingModule({
        overrides: {
          locateFile(path, prefix) {
            return path.endsWith('.wasm') ? wasmUrl : prefix + path;
          },
        },
      });
      return module;
    });
  }
  return readerPromise;
}

export async function readQrCodes(imageSource, maxNumberOfSymbols = 1) {
  const { readBarcodes } = await loadReader();
  return readBarcodes(imageSource, {
    formats: ['QRCode'],
    maxNumberOfSymbols,
    textMode: 'Plain',
  });
}
