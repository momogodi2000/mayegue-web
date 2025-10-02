export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="heading-2 mb-6">Conditions d'Utilisation</h1>
        
        <div className="card space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptation des Conditions</h2>
            <p className="text-gray-700 dark:text-gray-300">
              En utilisant Ma’a yegue, vous acceptez ces conditions d'utilisation. Si vous n'êtes pas d'accord,
              veuillez ne pas utiliser l'application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Services Proposés</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Ma’a yegue offre une plateforme d'apprentissage des langues camerounaises avec :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Dictionnaire interactif</li>
              <li>Leçons structurées</li>
              <li>Assistant IA</li>
              <li>Gamification et badges</li>
              <li>Communauté d'apprenants</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Abonnements et Paiements</h2>
            <p className="text-gray-700 dark:text-gray-300">
              - Plan Gratuit : Accès limité permanent<br />
              - Plan Premium : 2,500 FCFA/mois, résiliable à tout moment<br />
              - Plan Enseignant : 15,000 FCFA/an
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Propriété Intellectuelle</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Tous les contenus (leçons, audio, textes) sont protégés par le droit d'auteur.
              Toute reproduction sans autorisation est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Responsabilités</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Les utilisateurs s'engagent à utiliser l'application de manière respectueuse et légale.
              Tout contenu offensant ou illégal sera supprimé et le compte bloqué.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Modification des Conditions</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les utilisateurs seront notifiés des changements importants.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

