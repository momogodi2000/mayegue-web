import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Show manual instructions
      setShowModal(true);
      return;
    }

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Application installée
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        Installer l'application
      </button>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Comment installer Ma'a yegue
            </Dialog.Title>

            {isIOS ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Sur iOS (iPhone/iPad):
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>Appuyez sur le bouton Partager (carré avec flèche) en bas de Safari</li>
                      <li>Faites défiler et appuyez sur "Sur l'écran d'accueil"</li>
                      <li>Appuyez sur "Ajouter" en haut à droite</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ComputerDesktopIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Sur Android:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>Appuyez sur le menu (⋮) en haut à droite</li>
                      <li>Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"</li>
                      <li>Suivez les instructions</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ComputerDesktopIcon className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      Sur Ordinateur (Chrome/Edge):
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>Cliquez sur l'icône d'installation (⊕) dans la barre d'adresse</li>
                      <li>Ou Menu → "Installer Ma'a yegue"</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              J'ai compris
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
