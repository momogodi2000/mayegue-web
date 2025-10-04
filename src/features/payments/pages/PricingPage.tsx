import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CheckIcon,
  StarIcon,
  SparklesIcon,
  GlobeAltIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { AnimatedSection, FloatingCard } from '@/shared/components/ui/AnimatedComponents';
import { VERSION_INFO } from '@/shared/constants/version';

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = (plan: { id: string; name: string; price: number | string; features: string[] }) => {
    navigate('/checkout', { state: { plan } });
  };

  const plans = [
    {
      id: 'freemium',
      name: 'Freemium',
      description: 'Parfait pour débuter',
      price: 0,
      period: 'toujours',
      currency: 'FCFA',
      popular: false,
      features: [
        '5 leçons par mois',
        'Dictionnaire de base (1,000 mots)',
        'Assistant IA limité (10 requêtes/jour)',
        'Mode hors ligne basique',
        'Support communautaire',
        'Certificat de participation'
      ],
      limitations: [
        'Pas d\'accès à l\'Atlas Linguistique',
        'Pas d\'Encyclopédie Culturelle',
        'Pas d\'expériences AR/VR',
        'Pas de Marketplace'
      ],
      color: 'gray'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Le plus populaire',
      price: billingPeriod === 'monthly' ? 2500 : 25000,
      period: billingPeriod === 'monthly' ? 'mois' : 'an',
      currency: 'FCFA',
      popular: true,
      features: [
        'Leçons illimitées',
        'Dictionnaire complet (15,000+ mots)',
        'Assistant IA Gemini illimité',
        'Atlas Linguistique Interactif',
        'Encyclopédie Culturelle',
        'Sites Historiques avec visites virtuelles',
        'Mode hors ligne complet',
        'Certificats officiels',
        'Gamification de base',
        'Support prioritaire'
      ],
      color: 'primary'
    },
    {
      id: 'family',
      name: 'Famille',
      description: 'Pour toute la famille',
      price: billingPeriod === 'monthly' ? 5000 : 50000,
      period: billingPeriod === 'monthly' ? 'mois' : 'an',
      currency: 'FCFA',
      popular: false,
      features: [
        'Tout Premium +',
        'Jusqu\'à 6 comptes familiaux',
        'Mode Famille Intergénérationnel',
        'Arbre Linguistique Familial',
        'Mode "Apprendre avec Grand-mère"',
        'Partage de progression',
        'Contrôle parental',
        'Statistiques familiales',
        'Ngondo Coins partagés'
      ],
      color: 'secondary'
    },
    {
      id: 'teacher',
      name: 'Enseignant',
      description: 'Pour les éducateurs',
      price: billingPeriod === 'monthly' ? 8000 : 80000,
      period: billingPeriod === 'monthly' ? 'mois' : 'an',
      currency: 'FCFA',
      popular: false,
      features: [
        'Tout Premium +',
        'Gestion de classes (jusqu\'à 100 élèves)',
        'Création de contenu personnalisé',
        'Analytics avancés des élèves',
        'Outils d\'évaluation',
        'Certificats personnalisés',
        'Support dédié',
        'Formation et webinaires',
        'Accès aux ressources pédagogiques'
      ],
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      description: 'Pour les organisations',
      price: 'Sur devis',
      period: 'personnalisé',
      currency: '',
      popular: false,
      features: [
        'Tout Teacher +',
        'Gestion multi-utilisateurs illimitée',
        'API et intégrations',
        'Support 24/7',
        'Formation personnalisée',
        'Branding personnalisé',
        'Analytics avancés',
        'Sécurité renforcée',
        'Conformité RGPD'
      ],
      color: 'gold'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <Helmet>
        <title>Tarifs - Ma'a yegue V1.1 | Plans Premium, Famille, Enseignant</title>
        <meta name="description" content="Découvrez nos plans tarifaires pour apprendre les langues camerounaises avec les nouvelles fonctionnalités V1.1 : Atlas, Encyclopédie, AR/VR, Marketplace." />
      </Helmet>

      <div className="container-custom">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            🆕 Nouveau : Version {VERSION_INFO.version} - {VERSION_INFO.name}
          </div>
          <h1 className="heading-1 mb-6">Choisissez Votre Plan V1.1</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Accédez aux nouvelles fonctionnalités révolutionnaires : Atlas Linguistique, Encyclopédie Culturelle, 
            expériences AR/VR, Marketplace et bien plus encore.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Annuel
            </span>
            {billingPeriod === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Économisez 20%
              </span>
            )}
          </div>
        </AnimatedSection>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <FloatingCard 
              key={plan.id} 
              className={`relative card p-6 h-full flex flex-col ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">Gratuit</div>
                  ) : typeof plan.price === 'number' ? (
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        {plan.currency}/{plan.period}
                      </span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</div>
                  )}
                </div>
              </div>

              <div className="flex-grow">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Fonctionnalités incluses :</h4>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Limitations :</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0">✕</span>
                          <span className="text-gray-500 dark:text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleUpgrade(plan)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : plan.color === 'gray'
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                }`}
              >
                {plan.id === 'freemium' ? 'Plan Actuel' : 
                 plan.id === 'enterprise' ? 'Contactez-nous' : 
                 `Choisir ${plan.name}`}
              </button>
            </FloatingCard>
          ))}
        </div>

        {/* V1.1 Features Showcase */}
        <AnimatedSection className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Nouvelles Fonctionnalités V1.1
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GlobeAltIcon,
                title: 'Atlas Linguistique',
                description: 'Carte interactive de 280+ langues camerounaises'
              },
              {
                icon: SparklesIcon,
                title: 'Encyclopédie Culturelle',
                description: 'Traditions, art et histoire des ethnies'
              },
              {
                icon: TrophyIcon,
                title: 'Gamification RPG',
                description: 'Système de jeu complet avec avatars et quêtes'
              },
              {
                icon: HeartIcon,
                title: 'Marketplace Culturel',
                description: 'Soutenez l\'artisanat local authentique'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Questions Fréquentes sur les Tarifs
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Puis-je changer de plan à tout moment ?',
                a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.'
              },
              {
                q: 'Les nouveaux utilisateurs ont-ils une période d\'essai ?',
                a: 'Oui, tous les nouveaux utilisateurs bénéficient de 7 jours d\'essai gratuit du plan Premium.'
              },
              {
                q: 'Que se passe-t-il si je n\'utilise pas toutes mes fonctionnalités ?',
                a: 'Aucun problème ! Vous payez pour l\'accès, pas pour l\'utilisation. Utilisez ce dont vous avez besoin.'
              },
              {
                q: 'Y a-t-il des frais cachés ?',
                a: 'Non, le prix affiché est le prix final. Aucun frais caché, pas de taxes supplémentaires.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
