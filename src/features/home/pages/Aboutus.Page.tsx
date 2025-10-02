import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AboutusPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Marie Atangana',
      role: 'Fondatrice & Linguiste',
      description: 'Docteure en linguistique africaine, spécialisée dans les langues bantoues du Cameroun.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Paul Nkomo',
      role: 'Développeur Principal',
      description: 'Ingénieur logiciel passionné par les technologies éducatives et le patrimoine culturel.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Aminata Oumarou',
      role: 'Responsable Contenu',
      description: 'Experte en pédagogie des langues et coordinatrice des contenus éducatifs.',
      image: '/api/placeholder/150/150'
    }
  ];

  const stats = [
    { number: '270+', label: 'Langues camerounaises', description: 'Répertoriées dans notre base de données' },
    { number: '50+', label: 'Leçons interactives', description: 'Créées par des experts linguistes' },
    { number: '10,000+', label: 'Mots de vocabulaire', description: 'Avec pronunciation et traductions' },
    { number: '1,000+', label: 'Utilisateurs actifs', description: 'Qui apprennent chaque mois' }
  ];

  const values = [
    {
      title: 'Préservation culturelle',
      description: 'Nous nous engageons à sauvegarder les langues traditionnelles camerounaises pour les générations futures.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Éducation accessible',
      description: 'Nous rendons l\'apprentissage des langues locales accessible à tous, partout et à tout moment.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Innovation technologique',
      description: 'Nous utilisons les dernières technologies pour créer une expérience d\'apprentissage moderne et efficace.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Communauté inclusive',
      description: 'Nous créons un espace d\'apprentissage bienveillant où chacun peut progresser à son rythme.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>À Propos - Ma’a yegue</title>
        <meta
          name="description"
          content="Découvrez Ma’a yegue, la plateforme dédiée à l'apprentissage et à la préservation des langues traditionnelles camerounaises."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-yellow-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Préservons ensemble
                <span className="block text-yellow-300">nos langues</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                Ma’a yegue est née d'une passion pour la richesse linguistique du Cameroun 
                et d'une vision : rendre l'apprentissage de nos langues traditionnelles 
                accessible à tous, partout dans le monde.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Commencer l'apprentissage
                </Link>
                <Link
                  to="/dictionary"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
                >
                  Explorer le dictionnaire
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Préserver, promouvoir et transmettre la richesse des langues traditionnelles 
                camerounaises grâce à une plateforme d'apprentissage moderne et accessible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ma’a yegue en Chiffres
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Notre impact grandit chaque jour grâce à une communauté passionnée 
                d'apprenants et d'experts linguistiques.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-gray-600">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-20 bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Notre Histoire
                </h2>
                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Ma’a yegue est née d'un constat alarmant : de nombreuses langues traditionnelles 
                    camerounaises sont en voie de disparition. Face à ce défi, nous avons décidé 
                    d'agir en créant une plateforme qui utilise la technologie pour préserver 
                    et transmettre ce patrimoine linguistique unique.
                  </p>
                  <p>
                    Lancé en 2024, notre projet rassemble linguistes, développeurs, éducateurs 
                    et membres des communautés linguistiques dans un effort collectif de 
                    sauvegarde. Chaque leçon, chaque mot du dictionnaire, chaque exercice 
                    est le fruit d'un travail méticuleux de recherche et de validation culturelle.
                  </p>
                  <p>
                    Aujourd'hui, Ma’a yegue continue d'évoluer grâce aux retours de notre communauté 
                    d'apprenants et à l'expertise de nos partenaires culturels. Notre vision : 
                    faire du Cameroun un modèle de préservation linguistique numérique.
                  </p>
                </div>
              </div>
              <div className="lg:order-first">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="aspect-w-16 aspect-h-9 mb-6">
                    <img
                      src="/api/placeholder/600/400"
                      alt="Carte du Cameroun avec ses langues"
                      className="rounded-xl object-cover w-full h-64"
                    />
                  </div>
                  <blockquote className="text-lg text-gray-700 italic text-center">
                    "Chaque langue qui disparaît, c'est une bibliothèque qui brûle. 
                    Ma’a yegue est notre façon de construire des bibliothèques numériques 
                    pour l'éternité."
                  </blockquote>
                  <cite className="block text-center mt-4 text-green-600 font-semibold">
                    — Dr. Marie Atangana, Fondatrice
                  </cite>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Équipe
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Une équipe multidisciplinaire unie par la passion de préserver 
                et transmettre les langues camerounaises.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-green-600 font-semibold mb-3">
                    {member.role}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-green-600 to-green-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Rejoignez notre Mission
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Que vous soyez apprenant, enseignant, linguiste ou simple passionné 
              de culture camerounaise, votre contribution est précieuse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Créer un compte
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutusPage;