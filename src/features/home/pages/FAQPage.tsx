import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/components/ui';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqData: FAQItem[] = [
    // Général
    {
      id: 'what-is-maayegue',
      question: 'Qu\'est-ce que Ma\'a yegue ?',
      answer: 'Ma\'a yegue est une plateforme d\'apprentissage des langues traditionnelles camerounaises. Notre mission est de préserver et transmettre ces langues précieuses à travers des méthodes d\'apprentissage modernes et interactives.',
      category: 'general'
    },
    {
      id: 'supported-languages',
      question: 'Quelles langues camerounaises sont disponibles ?',
      answer: 'Nous proposons actuellement l\'apprentissage de plusieurs langues camerounaises incluant l\'Ewondo, le Duala, le Fulfulde, le Bassa, le Bamileke, et bien d\'autres. Notre catalogue s\'enrichit régulièrement avec de nouvelles langues.',
      category: 'general'
    },
    {
      id: 'target-audience',
      question: 'Qui peut utiliser Ma\'a yegue ?',
      answer: 'Ma\'a yegue s\'adresse à tous : étudiants, professionnels, diaspora camerounaise, chercheurs en linguistique, et toute personne intéressée par l\'apprentissage des langues traditionnelles camerounaises.',
      category: 'general'
    },

    // Compte et inscription
    {
      id: 'create-account',
      question: 'Comment créer un compte ?',
      answer: 'Cliquez sur "S\'inscrire" en haut de la page, remplissez le formulaire avec votre email et mot de passe, puis confirmez votre email. Vous pouvez aussi vous inscrire avec Google ou Facebook.',
      category: 'account'
    },
    {
      id: 'forgot-password',
      question: 'J\'ai oublié mon mot de passe, que faire ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, entrez votre email, et suivez les instructions reçues par email pour réinitialiser votre mot de passe.',
      category: 'account'
    },
    {
      id: 'change-email',
      question: 'Comment changer mon adresse email ?',
      answer: 'Allez dans vos paramètres de profil, section "Informations personnelles", et modifiez votre adresse email. Vous devrez confirmer la nouvelle adresse.',
      category: 'account'
    },

    // Apprentissage
    {
      id: 'how-lessons-work',
      question: 'Comment fonctionnent les leçons ?',
      answer: 'Nos leçons sont structurées par niveaux (débutant, intermédiaire, avancé) et incluent du contenu multimédia, des exercices interactifs, et des tests de progression. Chaque leçon dure environ 15-30 minutes.',
      category: 'learning'
    },
    {
      id: 'offline-access',
      question: 'Puis-je apprendre hors ligne ?',
      answer: 'Oui ! Vous pouvez télécharger certaines leçons pour les consulter hors ligne. Cette fonctionnalité est disponible pour les utilisateurs premium.',
      category: 'learning'
    },
    {
      id: 'progress-tracking',
      question: 'Comment suivre mes progrès ?',
      answer: 'Votre tableau de bord affiche vos statistiques d\'apprentissage : leçons complétées, temps d\'étude, scores, et badges obtenus. Vous pouvez aussi voir votre progression par langue.',
      category: 'learning'
    },
    {
      id: 'difficulty-levels',
      question: 'Comment choisir mon niveau ?',
      answer: 'Nous proposons un test de placement gratuit qui évalue votre niveau actuel et vous recommande le niveau approprié. Vous pouvez aussi commencer par le niveau débutant.',
      category: 'learning'
    },

    // Paiement et abonnements
    {
      id: 'pricing-plans',
      question: 'Quels sont les plans tarifaires ?',
      answer: 'Nous proposons un plan gratuit avec accès limité, un plan Premium mensuel (2 500 FCFA), un plan Premium annuel (25 000 FCFA), et un plan Enseignant (15 000 FCFA/an).',
      category: 'payment'
    },
    {
      id: 'payment-methods',
      question: 'Quels modes de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), MTN Mobile Money, Orange Money, et d\'autres méthodes de paiement locales via CamPay.',
      category: 'payment'
    },
    {
      id: 'refund-policy',
      question: 'Puis-je obtenir un remboursement ?',
      answer: 'Oui, nous offrons une garantie de remboursement de 30 jours. Contactez notre support client pour toute demande de remboursement.',
      category: 'payment'
    },
    {
      id: 'cancel-subscription',
      question: 'Comment annuler mon abonnement ?',
      answer: 'Allez dans vos paramètres de compte, section "Abonnement", et cliquez sur "Annuler l\'abonnement". Vous garderez l\'accès jusqu\'à la fin de votre période de facturation.',
      category: 'payment'
    },

    // Communauté
    {
      id: 'community-features',
      question: 'Quelles fonctionnalités communautaires proposez-vous ?',
      answer: 'Notre communauté inclut des forums de discussion, des groupes d\'étude, des défis linguistiques, et la possibilité de pratiquer avec d\'autres apprenants.',
      category: 'community'
    },
    {
      id: 'language-exchange',
      question: 'Comment participer aux échanges linguistiques ?',
      answer: 'Rejoignez notre section "Échanges linguistiques" pour trouver des partenaires de conversation. Vous pouvez proposer votre langue maternelle en échange d\'apprendre une autre langue.',
      category: 'community'
    },
    {
      id: 'moderation',
      question: 'Comment la communauté est-elle modérée ?',
      answer: 'Notre équipe de modérateurs surveille activement la communauté pour maintenir un environnement respectueux et constructif. Vous pouvez signaler tout contenu inapproprié.',
      category: 'community'
    },

    // Technique
    {
      id: 'browser-support',
      question: 'Quels navigateurs sont supportés ?',
      answer: 'Ma\'a yegue fonctionne sur tous les navigateurs modernes : Chrome, Firefox, Safari, Edge. Nous recommandons d\'utiliser la dernière version de votre navigateur.',
      category: 'technical'
    },
    {
      id: 'mobile-app',
      question: 'Y a-t-il une application mobile ?',
      answer: 'Oui ! Ma\'a yegue est une Progressive Web App (PWA) qui fonctionne comme une application native sur mobile. Vous pouvez l\'installer depuis votre navigateur.',
      category: 'technical'
    },
    {
      id: 'system-requirements',
      question: 'Quelles sont les exigences système ?',
      answer: 'Ma\'a yegue fonctionne sur tous les appareils avec une connexion internet. Pour une expérience optimale, nous recommandons au moins 2GB de RAM et une connexion stable.',
      category: 'technical'
    },
    {
      id: 'data-usage',
      question: 'Combien de données internet utilise l\'application ?',
      answer: 'L\'utilisation de données varie selon le contenu. Les leçons avec audio/vidéo consomment plus de données. Vous pouvez télécharger du contenu en Wi-Fi pour économiser vos données mobiles.',
      category: 'technical'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les questions', count: faqData.length },
    { id: 'general', name: 'Général', count: faqData.filter(f => f.category === 'general').length },
    { id: 'account', name: 'Compte', count: faqData.filter(f => f.category === 'account').length },
    { id: 'learning', name: 'Apprentissage', count: faqData.filter(f => f.category === 'learning').length },
    { id: 'payment', name: 'Paiement', count: faqData.filter(f => f.category === 'payment').length },
    { id: 'community', name: 'Communauté', count: faqData.filter(f => f.category === 'community').length },
    { id: 'technical', name: 'Technique', count: faqData.filter(f => f.category === 'technical').length }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Questions fréquentes - Ma'a yegue</title>
        <meta name="description" content="Trouvez des réponses aux questions fréquentes sur Ma'a yegue, notre plateforme d'apprentissage des langues camerounaises." />
        <meta name="keywords" content="FAQ, aide, support, questions, langues camerounaises, apprentissage" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trouvez rapidement des réponses à vos questions sur Ma'a yegue 
              et l'apprentissage des langues camerounaises.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher dans les FAQ..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? undefined : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleExpanded(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-left">
                      {faq.question}
                    </CardTitle>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedItems.has(faq.id) ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </CardHeader>
                
                {expandedItems.has(faq.id) && (
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Vous ne trouvez pas votre réponse ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Notre équipe de support est là pour vous aider. 
                  Contactez-nous et nous vous répondrons dans les plus brefs délais.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button>
                    Contacter le support
                  </Button>
                  <Button variant="outline">
                    Chat en direct
                  </Button>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> support@maayegue.com<br />
                    <strong>Téléphone:</strong> +237 6XX XXX XXX<br />
                    <strong>Heures d'ouverture:</strong> Lun-Ven 8h-18h (GMT+1)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;