import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-20 md:bottom-5 right-5 left-5 md:left-auto md:w-96 z-[100] animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {offlineReady ? 'Prêt pour le hors-ligne' : 'Mise à jour disponible'}
            </h3>
            <p className="text-gray-300 text-sm">
              {offlineReady
                ? 'L\'application est prête à être utilisée hors ligne.'
                : 'Une nouvelle version est disponible. Cliquez sur recharger pour mettre à jour.'}
            </p>
          </div>
          <button onClick={close} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-white text-gray-900 py-2.5 px-4 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 w-full"
          >
            <RefreshCw size={16} />
            Recharger maintenant
          </button>
        )}
      </div>
    </div>
  );
};

export default ReloadPrompt;
