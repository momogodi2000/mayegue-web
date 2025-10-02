import { Link } from 'react-router-dom';

export default function AboutusPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="heading-2 mb-6">À propos de Mayegue</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Mayegue est une initiative dédiée à la préservation et à la transmission des langues traditionnelles
          camerounaises. Notre mission est de rendre l'apprentissage accessible à tous grâce à une approche
          moderne alliant pédagogie, technologie et communauté.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Préserver le patrimoine linguistique du Cameroun en offrant une plateforme d'apprentissage
              interactive et inclusive.
            </p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Nos Valeurs</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
              <li>Authenticité culturelle</li>
              <li>Accessibilité et inclusion</li>
              <li>Innovation et excellence</li>
            </ul>
          </div>
        </div>

        <div className="card mb-10">
          <h3 className="text-xl font-semibold mb-4">Langues Ciblées</h3>
          <div className="flex flex-wrap gap-2">
            {['Ewondo', 'Duala', 'Fulfulde', 'Bassa', 'Bamum', "Fe'efe'e"].map(l => (
              <span key={l} className="badge-primary">{l}</span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact" className="btn-primary">Nous Contacter</Link>
        </div>
      </div>
    </div>
  );
}


