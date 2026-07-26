import { useEffect, useRef, useState } from 'preact/hooks';
import { translate } from '../../scripts/i18n.js';
import '../../styles/pwa.css';

const UPDATE_INTERVAL = 60 * 60 * 1000;
const UPDATE_THROTTLE = 60 * 1000;

function readStoredLanguage() {
  try {
    return localStorage.getItem('lang') || 'en';
  } catch {
    return 'en';
  }
}

export default function PwaUpdatePrompt() {
  const [notice, setNotice] = useState(null);
  const [updating, setUpdating] = useState(false);
  const registrationRef = useRef(null);
  const hadControllerRef = useRef(false);
  const lastUpdateCheckRef = useRef(0);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;

    let disposed = false;
    let updateInterval;
    let updateFoundHandler;

    hadControllerRef.current = Boolean(navigator.serviceWorker.controller);

    function handleControllerChange() {
      if (hadControllerRef.current) {
        window.location.reload();
        return;
      }
      hadControllerRef.current = true;
    }

    function handleInstalled(worker) {
      if (disposed || worker.state !== 'installed') return;
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
      worker.addEventListener('statechange', () => handleInstalled(worker));
    }

    async function checkForUpdate(force = false) {
      const registration = registrationRef.current;
      if (!registration) return;
      const now = Date.now();
      if (!force && now - lastUpdateCheckRef.current < UPDATE_THROTTLE) return;
      lastUpdateCheckRef.current = now;
      try {
        await registration.update();
      } catch (error) {
        console.error('Unable to check for a service worker update.', error);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') checkForUpdate();
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', checkForUpdate);

    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    }).then(registration => {
      if (disposed) return;
      registrationRef.current = registration;

      if (registration.waiting && navigator.serviceWorker.controller) {
        setNotice('update');
      }
      if (registration.installing) watchWorker(registration.installing);

      updateFoundHandler = () => {
        if (registration.installing) watchWorker(registration.installing);
      };
      registration.addEventListener('updatefound', updateFoundHandler);

      updateInterval = window.setInterval(checkForUpdate, UPDATE_INTERVAL);
      checkForUpdate(true);
    }).catch(error => {
      console.error('Unable to register the service worker.', error);
    });

    return () => {
      disposed = true;
      window.clearInterval(updateInterval);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', checkForUpdate);
      if (registrationRef.current && updateFoundHandler) {
        registrationRef.current.removeEventListener('updatefound', updateFoundHandler);
      }
    };
  }, []);

  async function activateUpdate() {
    const registration = registrationRef.current;
    if (!registration?.waiting) return;
    setUpdating(true);
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  if (!notice) return null;

  const language = readStoredLanguage();
  const updateAvailable = notice === 'update';
  return (
    <aside
      class="pwa-notice"
      role={updateAvailable ? 'alertdialog' : 'status'}
      aria-live="polite"
      aria-label={translate(
        updateAvailable ? 'pwa-update-ready' : 'pwa-offline-ready',
        language,
      )}
    >
      <p>
        {translate(
          updateAvailable ? 'pwa-update-ready' : 'pwa-offline-ready',
          language,
        )}
      </p>
      <div class="pwa-notice-actions">
        {updateAvailable && (
          <button type="button" class="pwa-primary-button" disabled={updating} onClick={activateUpdate}>
            {translate(updating ? 'pwa-updating' : 'pwa-reload', language)}
          </button>
        )}
        <button
          type="button"
          class="pwa-secondary-button"
          disabled={updating}
          onClick={() => setNotice(null)}
        >
          {translate(updateAvailable ? 'pwa-later' : 'pwa-dismiss', language)}
        </button>
      </div>
    </aside>
  );
}
