import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/shared/components/ui';
import { Helmet } from 'react-helmet-async';

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  type: 'academic' | 'corporate' | 'ngo' | 'government';
  website: string;
  country: string;
  partnershipType: string;
  isFeatured: boolean;
}

interface PartnershipOpportunity {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  type: 'academic' | 'corporate' | 'ngo' | 'government';
}

const PartnersPage: React.FC = () => {
  const partners: Partner[] = [
    {
      id: 'university-yaounde',
      name: 'Université de Yaoundé I',
      logo: '/logos/university-yaounde.png',
      description: 'Partenariat académique pour la recherche en linguistique et l\'intégration de nos outils dans les programmes d\'études.',
      type: 'academic',
      website: 'https://www.univ-yaounde1.org',
      country: 'Cameroun',
      partnershipType: 'Recherche & Formation',
      isFeatured: true
    },
    {
      id: 'mtn-cameroon',
      name: 'MTN Cameroun',
      logo: '/logos/mtn-cameroon.png',
      description: 'Partenariat stratégique pour l\'intégration des services de paiement mobile et l\'accès à nos contenus via les réseaux mobiles.',
      type: 'corporate',
      website: 'https://www.mtn.cm',
      country: 'Cameroun',
      partnershipType: 'Technologie & Paiement',
      isFeatured: true
    },
    {
      id: 'unesco',
      name: 'UNESCO',
      logo: '/logos/unesco.png',
      description: 'Collaboration pour la préservation du patrimoine linguistique camerounais dans le cadre du programme de sauvegarde des langues en danger.',
      type: 'ngo',
      website: 'https://www.unesco.org',
      country: 'International',
      partnershipType: 'Préservation Culturelle',
      isFeatured: true
    },
    {
      id: 'ministry-culture',
      name: 'Ministère des Arts et de la Culture',
      logo: '/logos/ministry-culture.png',
      description: 'Partenariat institutionnel pour la promotion et la préservation des langues traditionnelles camerounaises.',
      type: 'government',
      website: 'https://www.minac.cm',
      country: 'Cameroun',
      partnershipType: 'Politique Culturelle',
      isFeatured: false
    },
    {
      id: 'alliance-francaise',
      name: 'Alliance Française du Cameroun',
      logo: '/logos/alliance-francaise.png',
      description: 'Collaboration pour l\'échange culturel et linguistique entre le français et les langues camerounaises.',
      type: 'ngo',
      website: 'https://www.alliancefr.cm',
      country: 'Cameroun',
      partnershipType: 'Échange Culturel',
      isFeatured: false
    },
    {
      id: 'orange-cameroon',
      name: 'Orange Cameroun',
      logo: '/logos/orange-cameroon.png',
      description: 'Partenariat technologique pour l\'optimisation de l\'accès mobile à nos contenus éducatifs.',
      type: 'corporate',
      website: 'https://www.orange.cm',
      country: 'Cameroun',
      partnershipType: 'Connectivité & Accès',
      isFeatured: false
    }
  ];

  const partnershipOpportunities: PartnershipOpportunity[] = [
    {
      id: 'academic-research',
      title: 'Partenariat de Recherche Académique',
      description: 'Collaborons avec des universités et centres de recherche pour développer des méthodes d\'apprentissage innovantes.',
      requirements: [
        'Institution académique reconnue',
        'Expertise en linguistique ou éducation',
        'Accès à des locuteurs natifs',
        'Capacité de recherche et publication'
      ],
      benefits: [
        'Accès à nos données et outils',
        'Co-publication de recherches',
        'Formation de nos équipes',
        'Visibilité internationale'
      ],
      type: 'academic'
    },
    {
      id: 'corporate-csr',
      title: 'Partenariat RSE Entreprise',
      description: 'Intégrez la préservation culturelle dans votre stratégie RSE en soutenant l\'apprentissage des langues camerounaises.',
      requirements: [
        'Entreprise établie au Cameroun ou en Afrique',
        'Programme RSE existant',
        'Intérêt pour la préservation culturelle',
        'Capacité de financement'
      ],
      benefits: [
        'Impact social mesurable',
        'Visibilité positive de la marque',
        'Accès à nos contenus pour employés',
        'Rapports d\'impact détaillés'
      ],
      type: 'corporate'
    },
    {
      id: 'ngo-collaboration',
      title: 'Collaboration ONG',
      description: 'Travaillez avec nous pour promouvoir l\'éducation et la préservation culturelle dans les communautés.',
      requirements: [
        'ONG enregistrée et active',
        'Mission alignée avec la nôtre',
        'Présence sur le terrain',
        'Expérience en éducation communautaire'
      ],
      benefits: [
        'Accès gratuit à nos outils',
        'Formation de vos équipes',
        'Support technique continu',
        'Réseau de partenaires étendu'
      ],
      type: 'ngo'
    },
    {
      id: 'government-initiative',
      title: 'Initiative Gouvernementale',
      description: 'Soutenez les politiques publiques de préservation linguistique et d\'éducation inclusive.',
      requirements: [
        'Institution gouvernementale',
        'Mandat en éducation ou culture',
        'Budget alloué aux projets',
        'Capacité de mise en œuvre'
      ],
      benefits: [
        'Impact national',
        'Reconnaissance officielle',
        'Accès aux données nationales',
        'Support politique'
      ],
      type: 'government'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      academic: '🎓',
      corporate: '🏢',
      ngo: '🤝',
      government: '🏛️'
    };
    return icons[type as keyof typeof icons] || '🤝';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      corporate: 'bg-green-100 text-green-800',
      ngo: 'bg-purple-100 text-purple-800',
      government: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const featuredPartners = partners.filter(p => p.isFeatured);
  const otherPartners = partners.filter(p => !p.isFeatured);

  return (
    <>
      <Helmet>
        <title>Partenaires - Ma'a yegue</title>
        <meta name="description" content="Découvrez nos partenaires qui nous aident à préserver et transmettre les langues traditionnelles camerounaises. Rejoignez notre réseau de partenaires." />
        <meta name="keywords" content="partenaires, collaboration, université, entreprise, ONG, gouvernement, langues camerounaises" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nos partenaires
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous travaillons avec des institutions, entreprises et organisations 
              partageant notre vision de préservation des langues camerounaises.
            </p>
          </div>

          {/* Featured Partners */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Partenaires stratégiques
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getTypeIcon(partner.type)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <Badge className={getTypeColor(partner.type)} size="sm">
                          {partner.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {partner.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pays:</span>
                        <span className="font-medium">{partner.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium">{partner.partnershipType}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => window.open(partner.website, '_blank')}
                    >
                      Visiter le site
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Other Partners */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Autres partenaires
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getTypeIcon(partner.type)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">{partner.name}</CardTitle>
                        <Badge className={getTypeColor(partner.type)} size="sm">
                          {partner.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {partner.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pays:</span>
                        <span className="font-medium">{partner.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium">{partner.partnershipType}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Partnership Opportunities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Opportunités de partenariat
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {partnershipOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getTypeIcon(opportunity.type)}</span>
                      <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">
                      {opportunity.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Exigences</h4>
                        <ul className="space-y-2">
                          {opportunity.requirements.map((req, index) => (
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
                          {opportunity.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-500 mt-1">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6">
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Become a Partner */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Devenez notre partenaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Rejoignez notre réseau de partenaires et contribuez à la préservation 
                  des langues traditionnelles camerounaises. Ensemble, nous pouvons faire 
                  une différence durable.
                </p>
                
                <div className="space-y-4">
                  <Button size="lg" className="w-full">
                    Proposer un partenariat
                  </Button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline">
                      Télécharger le kit partenaire
                    </Button>
                    <Button variant="outline">
                      Voir les témoignages
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Contact Partenariats
                  </h4>
                  <p className="text-blue-800 text-sm">
                    <strong>Email:</strong> partnerships@maayegue.com<br />
                    <strong>Téléphone:</strong> +237 6XX XXX XXX<br />
                    <strong>Responsable:</strong> Marie Kamga, Directrice des Partenariats
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

export default PartnersPage;