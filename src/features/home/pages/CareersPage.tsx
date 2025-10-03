import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Helmet } from 'react-helmet-async';

const CareersPage: React.FC = () => {
  const jobOpenings = [
    {
      id: 'frontend-dev',
      title: 'Développeur Frontend React/TypeScript',
      department: 'Développement',
      location: 'Yaoundé, Cameroun / Remote',
      type: 'Temps plein',
      experience: '2-4 ans',
      description: 'Nous recherchons un développeur frontend passionné pour rejoindre notre équipe et contribuer au développement de notre plateforme d\'apprentissage des langues camerounaises.',
      requirements: [
        'Maîtrise de React, TypeScript et Next.js',
        'Expérience avec Tailwind CSS et les composants UI',
        'Connaissance de Firebase et des PWA',
        'Expérience avec les tests unitaires (Jest, React Testing Library)',
        'Maîtrise du français et de l\'anglais'
      ],
      benefits: [
        'Salaire compétitif',
        'Formation continue',
        'Environnement de travail flexible',
        'Participation aux projets open source'
      ],
      postedDate: '2024-01-15',
      isUrgent: false
    },
    {
      id: 'ui-ux-designer',
      title: 'Designer UI/UX',
      department: 'Design',
      location: 'Douala, Cameroun',
      type: 'Temps plein',
      experience: '1-3 ans',
      description: 'Rejoignez notre équipe créative pour concevoir des interfaces utilisateur exceptionnelles pour notre application d\'apprentissage des langues.',
      requirements: [
        'Maîtrise de Figma, Adobe Creative Suite',
        'Expérience en design mobile et web',
        'Connaissance des principes d\'accessibilité',
        'Portfolio démontrant des projets d\'applications éducatives',
        'Sensibilité culturelle pour les langues africaines'
      ],
      benefits: [
        'Salaire compétitif',
        'Matériel de travail fourni',
        'Formation en design inclusif',
        'Participation aux conférences design'
      ],
      postedDate: '2024-01-10',
      isUrgent: true
    },
    {
      id: 'content-manager',
      title: 'Gestionnaire de Contenu Linguistique',
      department: 'Contenu',
      location: 'Bamenda, Cameroun',
      type: 'Temps plein',
      experience: '2-5 ans',
      description: 'Nous cherchons un expert en langues camerounaises pour gérer et créer du contenu éducatif de qualité pour notre plateforme.',
      requirements: [
        'Maîtrise native d\'au moins 2 langues camerounaises',
        'Expérience en pédagogie ou linguistique',
        'Connaissance des outils de création de contenu multimédia',
        'Capacité à travailler avec des locuteurs natifs',
        'Maîtrise du français et de l\'anglais'
      ],
      benefits: [
        'Salaire compétitif',
        'Formation en technologies éducatives',
        'Voyages sur le terrain pour collecte de contenu',
        'Participation à la préservation culturelle'
      ],
      postedDate: '2024-01-08',
      isUrgent: false
    },
    {
      id: 'marketing-specialist',
      title: 'Spécialiste Marketing Digital',
      department: 'Marketing',
      location: 'Remote',
      type: 'Temps plein',
      experience: '1-3 ans',
      description: 'Aidez-nous à promouvoir notre plateforme d\'apprentissage des langues camerounaises à travers l\'Afrique et la diaspora.',
      requirements: [
        'Expérience en marketing digital et réseaux sociaux',
        'Connaissance des plateformes publicitaires (Facebook, Google)',
        'Capacité à créer du contenu engageant',
        'Compréhension du marché africain',
        'Maîtrise du français et de l\'anglais'
      ],
      benefits: [
        'Salaire compétitif',
        'Budget marketing pour expérimentation',
        'Formation en marketing international',
        'Travail à distance flexible'
      ],
      postedDate: '2024-01-05',
      isUrgent: false
    }
  ];

  const companyValues = [
    {
      title: 'Innovation',
      description: 'Nous utilisons les dernières technologies pour créer des expériences d\'apprentissage exceptionnelles.',
      icon: '🚀'
    },
    {
      title: 'Diversité',
      description: 'Nous célébrons la richesse culturelle et linguistique du Cameroun et de l\'Afrique.',
      icon: '🌍'
    },
    {
      title: 'Impact Social',
      description: 'Notre mission est de préserver et transmettre les langues traditionnelles camerounaises.',
      icon: '💝'
    },
    {
      title: 'Excellence',
      description: 'Nous nous efforçons de fournir la meilleure qualité dans tout ce que nous faisons.',
      icon: '⭐'
    }
  ];

  const benefits = [
    'Salaire compétitif et équitable',
    'Assurance santé complète',
    'Formation et développement professionnel',
    'Environnement de travail flexible',
    'Participation aux projets de préservation culturelle',
    'Équipement de travail moderne',
    'Congés payés et jours fériés',
    'Programme de bien-être'
  ];

  return (
    <>
      <Helmet>
        <title>Carrières - Ma'a yegue</title>
        <meta name="description" content="Rejoignez notre équipe passionnée pour préserver et transmettre les langues traditionnelles camerounaises. Découvrez nos offres d'emploi et opportunités de carrière." />
        <meta name="keywords" content="emploi, carrière, développement, design, marketing, langues camerounaises, Cameroun" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rejoignez notre mission
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aidez-nous à préserver et transmettre les langues traditionnelles camerounaises 
              en rejoignant notre équipe passionnée et innovante.
            </p>
          </div>

          {/* Company Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Job Openings */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Offres d'emploi actuelles
            </h2>
            
            <div className="space-y-6">
              {jobOpenings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          {job.isUrgent && (
                            <Badge variant="danger" size="sm">Urgent</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>📍 {job.location}</span>
                          <span>⏰ {job.type}</span>
                          <span>💼 {job.experience}</span>
                          <span>🏢 {job.department}</span>
                        </div>
                      </div>
                      <Badge variant="info" size="sm">
                        Publié le {new Date(job.postedDate).toLocaleDateString('fr-FR')}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-6">{job.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Exigences</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-blue-500 mt-1">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Avantages</h4>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-500 mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1">
                        Postuler maintenant
                      </Button>
                      <Button variant="outline">
                        Partager
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Pourquoi nous rejoindre ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Process */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Processus de candidature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <span>Envoyez votre CV et lettre de motivation</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <span>Entretien initial avec notre équipe RH</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <span>Test technique ou portfolio review</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <span>Entretien final avec l'équipe</span>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Contact:</strong> careers@maayegue.com
                  </p>
                  <p className="text-blue-800">
                    <strong>Téléphone:</strong> +237 6XX XXX XXX
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

export default CareersPage;