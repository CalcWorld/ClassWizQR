import { useEffect, useRef, useState } from 'preact/hooks';
import { consumeQrResult, createEmptySequence, getPendingSequenceIndexes, } from '../../scripts/qrSequence.js';
import { filterValidQrResults, resolveInitialQrResults, } from '../../scripts/qrMultiResult.js';
import { MULTI_QR_LIMIT, readQrCodes } from '../../scripts/qrReader.js';
import MessageDialog from './MessageDialog.jsx';
import { BackIcon, ScreenIcon } from './Icons.jsx';
import useModalDialog from '../../hooks/useModalDialog.js';

const CAMERA_STORAGE_KEY = 'qr-camera-device-id';
const CAMERA_SEQUENCE_HINT_KEY = 'qr-camera-sequence-hint-shown';
const SCAN_INTERVAL_MS = 200;
const MAX_SCAN_EDGE = 1280;
let cameraSequenceHintShown = false;

function getRememberedCamera() {
  try {
    return localStorage.getItem(CAMERA_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function rememberCamera(deviceId) {
  try {
    localStorage.setItem(CAMERA_STORAGE_KEY, deviceId);
  } catch {
    // Camera selection still works when storage is unavailable.
  }
}

function hasShownCameraSequenceHint() {
  if (cameraSequenceHintShown) return true;
  try {
    cameraSequenceHintShown = sessionStorage.getItem(CAMERA_SEQUENCE_HINT_KEY) === 'true';
  } catch {
    // Fall back to the in-memory flag when session storage is unavailable.
  }
  return cameraSequenceHintShown;
}

function rememberCameraSequenceHint() {
  cameraSequenceHintShown = true;
  try {
    sessionStorage.setItem(CAMERA_SEQUENCE_HINT_KEY, 'true');
  } catch {
    // The in-memory flag still suppresses repeat prompts on the current page.
  }
}

function cameraErrorTag(error) {
  switch (error?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'camera-error-permission';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'camera-error-not-found';
    case 'NotReadableError':
    case 'AbortError':
      return 'camera-error-busy';
    default:
      return 'camera-error-generic';
  }
}

function vibrateOnCameraScan() {
  try {
    navigator.vibrate?.(80);
  } catch {
    // Vibration is optional and may be blocked by the browser or device.
  }
}

function SequenceProgress({ sequence, t }) {
  if (!sequence.sequenceSize) return null;

  return (
    <div
      class="camera-sequence-progress"
      aria-label={t('camera-sequence-progress')}
    >
      {sequence.parts.map((part, index) => (
        <span
          class={part === null ? 'sequence-step' : 'sequence-step is-scanned'}
          aria-label={`${index + 1}: ${
            part === null ? t('camera-sequence-pending') : t('camera-sequence-scanned')
          }`}
          key={index}
        >
          {index + 1}
        </span>
      ))}
    </div>
  );
}

export default function CameraScannerDialog(
  {
    open,
    mode = 'camera',
    initialStream = null,
    t,
    onClose,
    onScan,
    onProgress,
  }) {
  const dialogRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const generationRef = useRef(0);
  const decodingRef = useRef(false);
  const pausedRef = useRef(false);
  const multiScanPendingRef = useRef(false);
  const sequenceRef = useRef(createEmptySequence());
  const [status, setStatus] = useState('idle');
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [sequence, setSequence] = useState(createEmptySequence());
  const [message, setMessage] = useState(null);

  useModalDialog(dialogRef, open);

  function resetSequence() {
    const empty = createEmptySequence();
    sequenceRef.current = empty;
    setSequence(empty);
  }

  function stopStream() {
    generationRef.current += 1;
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function attachScreenStream(stream) {
    if (!stream) {
      setStatus('idle');
      return;
    }

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const previousStream = streamRef.current;
    streamRef.current = stream;
    if (previousStream && previousStream !== stream) {
      previousStream.getTracks().forEach(track => track.stop());
    }

    const [track] = stream.getVideoTracks();
    track?.addEventListener('ended', () => {
      if (generation !== generationRef.current) return;
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setStatus('idle');
      onProgress?.(null);
    }, { once: true });

    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        // The autoplay attribute can still start playback once metadata is ready.
      }
    }
    setDevices([]);
    setStatus('scanning');
  }

  async function requestScreen() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setMessage({
        title: t('screen-error-title'),
        body: t('screen-error-unsupported'),
        closesScanner: false,
      });
      return;
    }

    const hadStream = Boolean(streamRef.current);
    setStatus('loading');
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true,
      });
      resetSequence();
      multiScanPendingRef.current = true;
      onProgress?.({ pending: [], total: 0, complete: false });
      await attachScreenStream(stream);
    } catch (error) {
      setStatus(hadStream ? 'scanning' : 'idle');
      if (error?.name !== 'NotAllowedError') {
        setMessage({
          title: t('screen-error-title'),
          body: t('screen-error-generic'),
          closesScanner: false,
        });
      }
    }
  }

  function closeScanner() {
    stopStream();
    setMessage(null);
    pausedRef.current = false;
    resetSequence();
    onClose();
  }

  async function listCameras() {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const cameras = mediaDevices.filter(device => device.kind === 'videoinput');
    setDevices(cameras);
    return cameras;
  }

  async function requestCamera(deviceId, allowFallback) {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const previousStream = streamRef.current;
    streamRef.current = null;
    previousStream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('loading');

    const preferredVideo = deviceId
      ? {
        deviceId: { exact: deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      }
      : {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      };

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: preferredVideo,
      });
    } catch (error) {
      if (deviceId && allowFallback) {
        return requestCamera('', false);
      }
      if (generation !== generationRef.current) return;
      setStatus('error');
      pausedRef.current = true;
      setMessage({
        title: t('camera-error-title'),
        body: t(cameraErrorTag(error)),
        closesScanner: true,
      });
      return;
    }

    if (generation !== generationRef.current || !open) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        // The stream remains attached; the autoplay attribute can still start it.
      }
    }

    const actualDeviceId = stream.getVideoTracks()[0]?.getSettings().deviceId || deviceId;
    if (actualDeviceId) {
      setSelectedDeviceId(actualDeviceId);
      rememberCamera(actualDeviceId);
    }
    try {
      await listCameras();
    } catch {
      setDevices([]);
    }
    setStatus('scanning');
  }

  async function switchCamera(deviceId) {
    if (!deviceId || deviceId === selectedDeviceId) return;
    setSelectedDeviceId(deviceId);
    resetSequence();
    await requestCamera(deviceId, false);
  }

  useEffect(() => {
    if (!open) {
      stopStream();
      setStatus('idle');
      return undefined;
    }

    if (mode === 'screen') {
      pausedRef.current = false;
      multiScanPendingRef.current = true;
      setMessage(null);
      resetSequence();
      onProgress?.({ pending: [], total: 0, complete: false });
      attachScreenStream(initialStream);
      return () => stopStream();
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      pausedRef.current = true;
      setMessage({
        title: t('camera-error-title'),
        body: t('camera-error-unsupported'),
        closesScanner: true,
      });
      return undefined;
    }

    pausedRef.current = false;
    multiScanPendingRef.current = false;
    setMessage(null);
    resetSequence();
    requestCamera(getRememberedCamera(), true);

    return () => stopStream();
  }, [open, mode, initialStream]);

  useEffect(() => {
    if (!open || status !== 'scanning') return undefined;

    const timer = window.setInterval(async () => {
      if (pausedRef.current || decodingRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      if (!video.videoWidth || !video.videoHeight) return;

      const scale = Math.min(1, MAX_SCAN_EDGE / Math.max(video.videoWidth, video.videoHeight));
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      decodingRef.current = true;
      try {
        const results = await readQrCodes(
          context.getImageData(0, 0, canvas.width, canvas.height),
          mode === 'screen' && multiScanPendingRef.current ? MULTI_QR_LIMIT : 1,
        );
        const validResults = filterValidQrResults(results);
        if (!validResults.length || pausedRef.current) return;

        if (mode === 'screen' && multiScanPendingRef.current) {
          multiScanPendingRef.current = false;
          const resolution = resolveInitialQrResults(validResults);

          if (resolution.status === 'complete') {
            const total = resolution.kind === 'sequence'
              ? resolution.results[0].sequenceSize
              : 1;
            onProgress?.({ pending: [], total, complete: true });
            stopStream();
            onScan(resolution.text);
            return;
          }

          let nextSequence = sequenceRef.current;
          for (const initialResult of resolution.results) {
            const consumed = consumeQrResult(nextSequence, initialResult);
            nextSequence = consumed.sequence;
          }
          sequenceRef.current = nextSequence;
          setSequence(nextSequence);
          onProgress?.({
            pending: getPendingSequenceIndexes(nextSequence),
            total: nextSequence.sequenceSize,
            complete: false,
          });
          return;
        }

        const [result] = validResults;
        const consumed = consumeQrResult(sequenceRef.current, result);
        sequenceRef.current = consumed.sequence;
        setSequence(consumed.sequence);

        const accepted = (
          consumed.completedText !== null
          || consumed.acceptedIndex !== null
        );
        if (mode === 'camera' && accepted) vibrateOnCameraScan();

        if (consumed.completedText !== null) {
          const total = result.sequenceSize >= 1 ? result.sequenceSize : 1;
          onProgress?.({ pending: [], total, complete: true });
          stopStream();
          onScan(consumed.completedText);
          return;
        }

        onProgress?.({
          pending: getPendingSequenceIndexes(consumed.sequence),
          total: consumed.sequence.sequenceSize,
          complete: false,
        });

        if (
          mode === 'camera'
          && consumed.sequenceStarted
          && !hasShownCameraSequenceHint()
        ) {
          rememberCameraSequenceHint();
          pausedRef.current = true;
          setMessage({
            title: t('camera-sequence-title', {
              count: consumed.sequence.sequenceSize,
            }),
            body: t('camera-sequence-instruction'),
            closesScanner: false,
          });
        }
      } catch (error) {
        console.error(error);
        pausedRef.current = true;
        setMessage({
          title: t('camera-error-title'),
          body: t('camera-error-decode'),
          closesScanner: true,
        });
      } finally {
        decodingRef.current = false;
      }
    }, SCAN_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [open, status, mode]);

  function confirmMessage() {
    const closesScanner = message?.closesScanner;
    setMessage(null);
    if (closesScanner) {
      closeScanner();
    } else {
      pausedRef.current = false;
    }
  }

  return (
    <>
      <dialog
        ref={dialogRef}
        class="app-panel-dialog camera-scanner-dialog"
        aria-label={mode === 'screen' ? t('screen-scanner-title') : t('camera-title')}
        onCancel={event => {
          event.preventDefault();
          closeScanner();
        }}
      >
        <div class="camera-scanner-shell">
          <header class="camera-scanner-header">
            <button
              class="camera-back-button"
              type="button"
              aria-label={t('camera-close')}
              title={t('camera-close')}
              onClick={closeScanner}
            >
              <BackIcon/>
            </button>
            <strong>
              {mode === 'screen' ? t('screen-scanner-title') : t('camera-title')}
            </strong>
            {mode === 'screen' ? (
              <button
                class="form-button scanner-header-action"
                type="button"
                disabled={status === 'loading'}
                onClick={requestScreen}
              >
                <ScreenIcon/>
                {t('screen-reshare')}
              </button>
            ) : (
              <div class="camera-device-control">
                <label for="camera-device">{t('camera-select')}</label>
                <select
                  id="camera-device"
                  value={selectedDeviceId}
                  disabled={devices.length < 2 || status === 'loading'}
                  onChange={event => switchCamera(event.currentTarget.value)}
                >
                  {devices.length === 0 && (
                    <option value="">{t('camera-default-device')}</option>
                  )}
                  {devices.map((device, index) => (
                    <option value={device.deviceId} key={device.deviceId}>
                      {device.label || `${t('camera-device')} ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </header>

          <div class={mode === 'screen' ? 'camera-preview is-screen' : 'camera-preview'}>
            <video ref={videoRef} autoplay muted playsinline/>
            <canvas ref={canvasRef} hidden/>
            {mode === 'camera' && <div class="camera-scan-guide" aria-hidden="true"/>}
            <SequenceProgress sequence={sequence} t={t}/>
            {status === 'loading' && (
              <div class="camera-status">
                {mode === 'screen' ? t('screen-loading') : t('camera-loading')}
              </div>
            )}
            {status === 'scanning' && (
              <div class="camera-hint">
                {mode === 'screen' ? t('screen-hint') : t('camera-hint')}
              </div>
            )}
            {mode === 'screen' && status === 'idle' && (
              <div class="camera-status screen-ended-status">
                {t('screen-ended')}
              </div>
            )}
          </div>
        </div>
      </dialog>

      <MessageDialog
        open={Boolean(message)}
        title={message?.title || ''}
        confirmLabel={t('dialog-confirm')}
        onConfirm={confirmMessage}
      >
        {message?.body}
      </MessageDialog>
    </>
  );
}
