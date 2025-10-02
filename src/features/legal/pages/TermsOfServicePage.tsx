import React from 'react';
import { Helmet } from 'react-helmet-async';

export const TermsOfServicePage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptation des conditions',
      content: [
        'En utilisant l\'application Ma’a yegue, vous acceptez pleinement et sans réserve les présentes conditions d\'utilisation.',
        'Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre service.',
        'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication.',
        'Il est de votre responsabilité de consulter régulièrement ces conditions pour rester informé des éventuelles modifications.'
      ]
    },
    {
      id: 'description-service',
      title: 'Description du service',
      content: [
        'Ma’a yegue est une plateforme d\'apprentissage en ligne dédiée aux langues traditionnelles camerounaises.',
        'Nous proposons des leçons interactives, un dictionnaire multilingue, des exercices pratiques et des outils d\'évaluation.',
        'Notre service est accessible via une application web et mobile, avec des fonctionnalités en ligne et hors ligne.',
        'Nous nous efforçons de maintenir la disponibilité du service, mais ne garantissons pas un accès ininterrompu.'
      ]
    },
    {
      id: 'compte-utilisateur',
      title: 'Compte utilisateur et responsabilités',
      content: [
        'Vous devez créer un compte pour accéder à la plupart des fonctionnalités de Ma’a yegue.',
        'Vous êtes responsable de la confidentialité de vos identifiants de connexion.',
        'Vous vous engagez à fournir des informations exactes et à jour lors de votre inscription.',
        'Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte.',
        'Un seul compte par utilisateur est autorisé. Les comptes multiples peuvent être supprimés.'
      ]
    },
    {
      id: 'utilisation-acceptable',
      title: 'Utilisation acceptable',
      content: [
        'Vous vous engagez à utiliser Ma’a yegue uniquement à des fins éducatives légitimes.',
        'Il est interdit de partager, copier ou distribuer le contenu sans autorisation écrite.',
        'Vous ne devez pas tenter de pirater, perturber ou compromettre la sécurité de nos systèmes.',
        'Le harcèlement, les contenus offensants ou discriminatoires sont strictement interdits.',
        'L\'utilisation de robots, scripts automatisés ou méthodes similaires est interdite sans autorisation.'
      ]
    },
    {
      id: 'propriete-intellectuelle',
      title: 'Propriété intellectuelle',
      content: [
        'Tous les contenus de Ma’a yegue (textes, images, audio, vidéos) sont protégés par les droits d\'auteur.',
        'Nous respectons les droits culturels et linguistiques des communautés camerounaises.',
        'Vous conservez la propriété des contenus que vous créez et partagez sur la plateforme.',
        'En publiant du contenu, vous nous accordez une licence d\'utilisation pour améliorer notre service.',
        'Nous prenons les violations de propriété intellectuelle très au sérieux et agirons en conséquence.'
      ]
    },
    {
      id: 'vie-privee',
      title: 'Vie privée et données personnelles',
      content: [
        'La protection de votre vie privée est une priorité absolue pour nous.',
        'Nous collectons uniquement les données nécessaires au fonctionnement du service.',
        'Vos données personnelles ne sont jamais vendues à des tiers.',
        'Consultez notre Politique de Confidentialité pour plus de détails sur nos pratiques.',
        'Vous avez le droit d\'accéder, modifier ou supprimer vos données personnelles à tout moment.'
      ]
    },
    {
      id: 'limitation-responsabilite',
      title: 'Limitation de responsabilité',
      content: [
        'Ma’a yegue est fourni "en l\'état" sans garantie explicite ou implicite.',
        'Nous ne garantissons pas l\'exactitude complète de tous les contenus linguistiques.',
        'Notre responsabilité est limitée au montant payé pour nos services premium, le cas échéant.',
        'Nous ne sommes pas responsables des dommages indirects, consécutifs ou punitifs.',
        'Les limitations de responsabilité s\'appliquent dans toute la mesure permise par la loi.'
      ]
    },
    {
      id: 'suspension-resiliation',
      title: 'Suspension et résiliation',
      content: [
        'Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation des conditions.',
        'Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil.',
        'En cas de résiliation, vous perdez l\'accès à tous les contenus et données associés à votre compte.',
        'Certaines dispositions de ces conditions survivent à la résiliation (propriété intellectuelle, limitation de responsabilité).',
        'Nous nous efforçons de vous prévenir avant toute action de suspension ou résiliation.'
      ]
    },
    {
      id: 'droit-applicable',
      title: 'Droit applicable et juridiction',
      content: [
        'Ces conditions sont régies par le droit camerounais.',
        'Tout litige sera soumis à la juridiction exclusive des tribunaux de Douala, Cameroun.',
        'En cas de conflit, nous encourageons la résolution amiable avant toute action judiciaire.',
        'Si une disposition de ces conditions est déclarée invalide, les autres dispositions restent en vigueur.',
        'Ces conditions constituent l\'accord complet entre vous et Ma’a yegue concernant l\'utilisation du service.'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Conditions d'Utilisation - Ma’a yegue</title>
        <meta
          name="description"
          content="Consultez les conditions d'utilisation de Ma’a yegue, la plateforme d'apprentissage des langues traditionnelles camerounaises."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Conditions d'Utilisation
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ces conditions d'utilisation régissent votre accès et votre utilisation 
                de la plateforme Ma’a yegue. Veuillez les lire attentivement.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Bienvenue sur Ma’a yegue
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ma’a yegue est une plateforme dédiée à la préservation et à l'apprentissage des 
              langues traditionnelles camerounaises. En utilisant notre service, vous contribuez 
              à cette mission importante de préservation culturelle.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ces conditions d'utilisation établissent les règles et directives pour 
              l'utilisation de notre plateforme. Elles protègent à la fois nos utilisateurs 
              et notre service, tout en garantissant une expérience d'apprentissage de qualité.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {index + 1}. {section.title}
              </h2>
              
              <div className="space-y-4">
                {section.content.map((paragraph, paragraphIndex) => (
                  <div key={paragraphIndex} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-8 text-white">
            <div className="text-center mb-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-4">
                Questions sur nos conditions ?
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto mb-6">
                Si vous avez des questions concernant ces conditions d'utilisation, 
                notre équipe juridique est à votre disposition pour vous aider.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-1">E-mail</h3>
                <p className="text-blue-100">legal@Ma’a yegue.com</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-1">Adresse</h3>
                <p className="text-blue-100">Douala, Cameroun</p>
              </div>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-blue-500">
              <p className="text-blue-100 text-sm">
                En continuant à utiliser Ma’a yegue, vous acceptez automatiquement la version 
                la plus récente de nos conditions d'utilisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};