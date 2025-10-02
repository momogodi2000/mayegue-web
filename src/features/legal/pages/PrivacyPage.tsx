export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="heading-2 mb-6">Politique de Confidentialité</h1>
        
        <div className="card space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Collecte de Données</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nous collectons les informations suivantes :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Nom et email lors de l'inscription</li>
              <li>Données de progression d'apprentissage</li>
              <li>Historique d'utilisation de l'application</li>
              <li>Informations de paiement (via CamPay/NouPai)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Utilisation des Données</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Personnaliser votre expérience d'apprentissage</li>
              <li>Suivre votre progression</li>
              <li>Améliorer nos services</li>
              <li>Envoyer des notifications pertinentes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Sécurité</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nous utilisons Firebase pour sécuriser vos données avec chiffrement de bout en bout.
              Vos mots de passe sont hashés et jamais stockés en clair.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Vos Droits</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Conformément au RGPD, vous pouvez accéder, modifier ou supprimer vos données à tout moment
              depuis votre profil ou en nous contactant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pour toute question : yvangodimomo@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

