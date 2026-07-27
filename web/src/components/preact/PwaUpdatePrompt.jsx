import { useEffect, useRef, useState } from 'preact/hooks';
import { translate } from '../../scripts/i18n.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import '../../styles/pwa.css';

const UPDATE_INTERVAL = 60 * 60 * 1000;
const UPDATE_THROTTLE = 60 * 1000;
const PROGRESS_DELAY = 300;

function readStoredLanguage() {
  try {
    return localStorage.getItem('lang') || 'en';
  } catch {
    return 'en';
  }
}

export default function PwaUpdatePrompt() {
  const [notice, setNotice] = useState(null);
  const [progress, setProgress] = useState(null);
  const [hiddenProgressVersion, setHiddenProgressVersion] = useState(null);
  const [visibleProgressVersion, setVisibleProgressVersion] = useState(null);
  const registrationRef = useRef(null);

  useEffect(() => {
    if (!progress) {
      setVisibleProgressVersion(null);
      return undefined;
    }
    const timer = window.setTimeout(
      () => setVisibleProgressVersion(progress.version),
      PROGRESS_DELAY,
    );
    return () => window.clearTimeout(timer);
  }, [progress?.version]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    let disposed = false;
    let registration;
    let updateInterval;
    let hadController = Boolean(navigator.serviceWorker.controller);
    let lastUpdateCheck = 0;

    function clearProgress(version) {
      setProgress(current => (
        !version || current?.version === version ? null : current
      ));
      setHiddenProgressVersion(current => (
        !version || current === version ? null : current
      ));
    }

    function handleWorkerMessage({ data }) {
      if (data?.type === 'PRECACHE_PROGRESS') {
        if (
          typeof data.version !== 'string'
          || !Number.isInteger(data.completed)
          || !Number.isInteger(data.total)
        ) return;
        setProgress({
          completed: data.completed,
          total: data.total,
          version: data.version,
        });
        setNotice(null);
      } else if (
        data?.type === 'PRECACHE_COMPLETE'
        || data?.type === 'PRECACHE_FAILED'
      ) {
        clearProgress(data.version);
      }
    }

    function handleControllerChange() {
      if (hadController) {
        window.location.reload();
        return;
      }
      hadController = true;
    }

    function handleInstalled(worker) {
      if (disposed || worker.state !== 'installed') return;
      clearProgress();
      if (navigator.serviceWorker.controller) {
        setNotice('update');
      } else {
        setNotice('offline');
        navigator.storage?.persist?.().catch(() => {
        });
      }
    }

    function watchWorker(worker) {
      handleInstalled(worker);
      worker.addEventListener('statechange', () => {
        handleInstalled(worker);
        if (worker.state === 'redundant') clearProgress();
      });
    }

    async function checkForUpdate() {
      if (!registration) return;
      const now = Date.now();
      if (now - lastUpdateCheck < UPDATE_THROTTLE) return;
      lastUpdateCheck = now;
      try {
        await registration.update();
      } catch (error) {
        console.error('Unable to check for a service worker update.', error);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') checkForUpdate();
    }

    function handleUpdateFound() {
      if (registration?.installing) watchWorker(registration.installing);
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    navigator.serviceWorker.addEventListener('message', handleWorkerMessage);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', checkForUpdate);

    navigator.serviceWorker.register('/sw.js', {
      updateViaCache: 'none',
    }).then(registered => {
      if (disposed) return;
      registration = registered;
      registrationRef.current = registration;

      if (registration.waiting && navigator.serviceWorker.controller) {
        setNotice('update');
      }
      if (registration.installing) watchWorker(registration.installing);
      registration.addEventListener('updatefound', handleUpdateFound);
      updateInterval = window.setInterval(checkForUpdate, UPDATE_INTERVAL);
    }).catch(error => {
      console.error('Unable to register the service worker.', error);
    });

    return () => {
      disposed = true;
      window.clearInterval(updateInterval);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      navigator.serviceWorker.removeEventListener('message', handleWorkerMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', checkForUpdate);
      registration?.removeEventListener('updatefound', handleUpdateFound);
    };
  }, []);

  function activateUpdate() {
    const registration = registrationRef.current;
    if (!registration?.waiting) return;
    setNotice('updating');
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  const language = readStoredLanguage();
  const showProgress = progress
    && visibleProgressVersion === progress.version
    && hiddenProgressVersion !== progress.version;
  if (!showProgress && !notice) return null;

  if (showProgress) {
    return (
      <aside class="pwa-notice">
        <div class="pwa-progress-content">
          <LoadingSpinner/>
          <div>
            <strong>{translate('pwa-caching-title', language)}</strong>
            <span role="status" aria-live="polite">
              {translate('pwa-caching-progress', language, {
                current: progress.completed,
                total: progress.total,
              })}
            </span>
          </div>
        </div>
        <div class="pwa-notice-actions">
          <button
            type="button"
            class="form-button"
            onClick={() => setHiddenProgressVersion(progress.version)}
          >
            {translate('pwa-hide-progress', language)}
          </button>
        </div>
      </aside>
    );
  }

  const updating = notice === 'updating';
  const updateAvailable = notice !== 'offline';
  const message = translate(
    updateAvailable ? 'pwa-update-ready' : 'pwa-offline-ready',
    language,
  );

  return (
    <aside class="pwa-notice">
      <p class="pwa-notice-message" role="status">{message}</p>
      <div class="pwa-notice-actions">
        {updateAvailable && (
          <button
            type="button"
            class="form-button primary-button"
            disabled={updating}
            onClick={activateUpdate}
          >
            {translate(updating ? 'pwa-updating' : 'pwa-reload', language)}
          </button>
        )}
        <button
          type="button"
          class="form-button"
          disabled={updating}
          onClick={() => setNotice(null)}
        >
          {translate(updateAvailable ? 'pwa-later' : 'pwa-dismiss', language)}
        </button>
      </div>
    </aside>
  );
}
