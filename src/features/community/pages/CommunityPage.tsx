export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <h1 className="heading-2 mb-6">Communauté</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Forums</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Discutez avec d'autres apprenants</p>
            <button className="btn-outline w-full">Explorer</button>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Groupes d'étude</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Rejoignez ou créez un groupe</p>
            <button className="btn-outline w-full">Voir les groupes</button>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Événements</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Participez à des sessions en direct</p>
            <button className="btn-outline w-full">Calendrier</button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Discussions récentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h3 className="font-semibold mb-1">Titre de discussion {i}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aperçu du message...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
