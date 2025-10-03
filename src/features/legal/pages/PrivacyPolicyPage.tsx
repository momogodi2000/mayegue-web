import React from 'react';
import { Helmet } from 'react-helmet-async';
// Replaced lucide-react imports with inline emojis to avoid extra dependency
const Shield = (props: { className?: string }) => <span className={props.className}>🛡️</span>;
const Lock = (props: { className?: string }) => <span className={props.className}>🔒</span>;
const Eye = (props: { className?: string }) => <span className={props.className}>👁️</span>;
const User = (props: { className?: string }) => <span className={props.className}>👤</span>;
const Settings = (props: { className?: string }) => <span className={props.className}>⚙️</span>;
const Mail = (props: { className?: string }) => <span className={props.className}>✉️</span>;
const Phone = (props: { className?: string }) => <span className={props.className}>📞</span>;
const MapPin = (props: { className?: string }) => <span className={props.className}>📍</span>;

export const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collectee',
      title: 'Informations que nous collectons',
      icon: <User className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Informations personnelles',
          items: [
            'Nom, prénom et adresse e-mail lors de l\'inscription',
            'Photo de profil (optionnelle)',
            'Préférences linguistiques et de localisation',
            'Paramètres d\'apprentissage personnalisés'
          ]
        },
        {
          subtitle: 'Données d\'apprentissage',
          items: [
            'Progression dans les leçons et exercices',
            'Scores et performances aux évaluations',
            'Historique des recherches dans le dictionnaire',
            'Mots favoris et listes personnalisées',
            'Statistiques d\'utilisation de l\'application'
          ]
        },
        {
          subtitle: 'Données techniques',
          items: [
            'Adresse IP et informations de connexion',
            'Type d\'appareil et système d\'exploitation',
            'Navigateur web utilisé',
            'Cookies et données de session'
          ]
        }
      ]
    },
    {
      id: 'utilisation-donnees',
      title: 'Comment nous utilisons vos données',
      icon: <Settings className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Amélioration du service',
          items: [
            'Personnaliser votre expérience d\'apprentissage',
            'Suivre vos progrès et ajuster le contenu',
            'Recommander des leçons adaptées à votre niveau',
            'Optimiser les performances de l\'application'
          ]
        },
        {
          subtitle: 'Communication',
          items: [
            'Envoyer des notifications de progression',
            'Informer des nouvelles fonctionnalités',
            'Répondre à vos demandes de support',
            'Envoyer des rappels d\'apprentissage (si activés)'
          ]
        },
        {
          subtitle: 'Sécurité et légalité',
          items: [
            'Prévenir la fraude et les abus',
            'Respecter nos obligations légales',
            'Maintenir la sécurité de nos systèmes',
            'Résoudre les problèmes techniques'
          ]
        }
      ]
    },
    {
      id: 'partage-donnees',
      title: 'Partage de vos données',
      icon: <Eye className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Nous ne vendons jamais vos données personnelles',
          items: [
            'Aucune vente à des tiers à des fins commerciales',
            'Respect strict de votre vie privée',
            'Transparence totale sur nos pratiques'
          ]
        },
        {
          subtitle: 'Partage limité dans certains cas',
          items: [
            'Prestataires de services (hébergement, analytics) sous contrat strict',
            'Autorités légales si requis par la loi',
            'Protection de nos droits et de ceux des utilisateurs',
            'Avec votre consentement explicite'
          ]
        }
      ]
    },
    {
      id: 'protection-donnees',
      title: 'Protection de vos données',
      icon: <Lock className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Mesures de sécurité',
          items: [
            'Chiffrement SSL/TLS pour toutes les communications',
            'Authentification sécurisée avec Firebase',
            'Accès restreint aux données personnelles',
            'Surveillance continue des systèmes',
            'Sauvegardes sécurisées et redondantes'
          ]
        },
        {
          subtitle: 'Conservation des données',
          items: [
            'Données conservées uniquement le temps nécessaire',
            'Suppression automatique des comptes inactifs après 2 ans',
            'Possibilité de supprimer votre compte à tout moment',
            'Anonymisation des données à des fins statistiques'
          ]
        }
      ]
    },
    {
      id: 'vos-droits',
      title: 'Vos droits',
      icon: <Shield className="w-6 h-6" />,
      content: [
        {
          subtitle: 'Droits d\'accès et de contrôle',
          items: [
            'Consulter toutes vos données personnelles',
            'Modifier ou corriger vos informations',
            'Télécharger une copie de vos données',
            'Supprimer définitivement votre compte',
            'Limiter le traitement de vos données'
          ]
        },
        {
          subtitle: 'Exercer vos droits',
          items: [
            'Accès direct via votre profil utilisateur',
            'Demande par e-mail à privacy@Ma’a yegue.com',
            'Réponse garantie sous 30 jours',
            'Assistance gratuite pour toutes démarches'
          ]
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité - Ma’a yegue</title>
        <meta
          name="description"
          content="Découvrez comment Ma’a yegue protège et utilise vos données personnelles. Transparence totale sur notre politique de confidentialité."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Politique de Confidentialité
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chez Ma’a yegue, nous nous engageons à protéger votre vie privée et à être transparents 
                sur la façon dont nous collectons, utilisons et protégeons vos données personnelles.
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
              Notre engagement envers votre vie privée
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ma’a yegue est une application dédiée à l'apprentissage des langues traditionnelles 
              camerounaises. Nous collectons et utilisons vos données uniquement pour améliorer 
              votre expérience d'apprentissage et vous fournir un service de qualité.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cette politique de confidentialité explique en détail nos pratiques concernant 
              vos données personnelles. Elle s'applique à tous les utilisateurs de notre 
              application web et mobile.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {section.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {index + 1}. {section.title}
                </h2>
              </div>

              {section.content.map((subsection, subIndex) => (
                <div key={subIndex} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    {subsection.subtitle}
                  </h3>
                  <ul className="space-y-2">
                    {subsection.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-sm p-8 text-white">
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-semibold mb-4">
                Questions sur cette politique ?
              </h2>
              <p className="text-green-100 max-w-2xl mx-auto">
                Si vous avez des questions concernant cette politique de confidentialité 
                ou vos données personnelles, n'hésitez pas à nous contacter.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <h3 className="font-medium mb-1">E-mail</h3>
                <p className="text-green-100">privacy@Ma’a yegue.com</p>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <h3 className="font-medium mb-1">Téléphone</h3>
                <p className="text-green-100">+237 XXX XXX XXX</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-90" />
                <h3 className="font-medium mb-1">Adresse</h3>
                <p className="text-green-100">Douala, Cameroun</p>
              </div>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-green-500">
              <p className="text-green-100 text-sm">
                Nous nous engageons à répondre à toutes vos demandes dans un délai de 30 jours.
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Cette politique de confidentialité peut être mise à jour périodiquement. 
              Nous vous informerons de tout changement important.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};