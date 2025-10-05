import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { 
  MapIcon, 
  MusicalNoteIcon as MusicIcon, 
  CameraIcon, 
  BookOpenIcon, 
  GlobeAltIcon, 
  CalendarIcon
} from '@heroicons/react/24/outline';

interface LanguageCulture {
  id: string;
  name: string;
  region: string;
  speakers: number;
  family: string;
  historicalOverview: {
    origin: string;
    milestones: string[];
    significance: string;
  };
  culturalBackground: {
    traditions: string[];
    festivals: string[];
    artMusic: string[];
    folklore: string[];
  };
  geographicalContext: {
    location: string;
    climate: string;
    landscape: string;
    connection: string;
  };
  historicalEvents: {
    events: Array<{
      year: string;
      title: string;
      description: string;
    }>;
  };
  heritageSites: {
    sites: Array<{
      name: string;
      location: string;
      description: string;
      imageUrl?: string;
    }>;
  };
  multimedia: {
    images: string[];
    videos: string[];
    audio: string[];
  };
  educationalNotes: {
    facts: string[];
    idioms: string[];
    quotes: string[];
  };
}

const cultureData: LanguageCulture[] = [
  {
    id: 'ewo',
    name: 'Ewondo',
    region: 'Région du Centre',
    speakers: 577000,
    family: 'Beti-Pahuin (Bantu)',
    historicalOverview: {
      origin: 'Langue principale du peuple Beti, largement parlée à Yaoundé. Issue de la famille Bantou Beti-Pahuin.',
      milestones: [
        'Origine dans les forêts équatoriales',
        'Expansion avec la migration Beti',
        'Standardisation au 20ème siècle',
        'Usage officiel dans l\'administration'
      ],
      significance: 'Langue de prestige dans la capitale, utilisée dans l\'administration et les médias.'
    },
    culturalBackground: {
      traditions: ['Initiation Ekang', 'Danse Bikutsi', 'Cérémonie de mariage traditionnel'],
      festivals: ['Festival des arts et traditions', 'Célébration de la récolte', 'Festival Ekang'],
      artMusic: ['Musique Bikutsi', 'Artisanat en raphia', 'Sculpture sur bois'],
      folklore: ['Contes de Mvett', 'Légendes de la forêt', 'Histoires de chasse']
    },
    geographicalContext: {
      location: 'Zone forestière équatoriale du Cameroun central',
      climate: 'Climat équatorial humide avec deux saisons des pluies',
      landscape: 'Forêts denses, collines, cours d\'eau',
      connection: 'Le vocabulaire reflète l\'environnement forestier avec de nombreux termes liés à la nature'
    },
    historicalEvents: {
      events: [
        { year: '1890', title: 'Arrivée des Allemands', description: 'Premier contact avec les Européens' },
        { year: '1920', title: 'Colonisation française', description: 'Introduction de l\'administration française' },
        { year: '1960', title: 'Indépendance', description: 'Ewondo devient langue administrative' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Palais du Sultan', location: 'Yaoundé', description: 'Centre historique et culturel' },
        { name: 'Forêt d\'Ebolowa', location: 'Sud', description: 'Réserve naturelle et spirituelle' }
      ]
    },
    multimedia: {
      images: ['/images/culture/ewondo-1.jpg', '/images/culture/ewondo-2.jpg'],
      videos: ['/videos/culture/ewondo-dance.mp4'],
      audio: ['/audio/culture/ewondo-traditional.mp3']
    },
    educationalNotes: {
      facts: ['Plus de 500 mots pour décrire la forêt', 'Système de classes nominales complexe'],
      idioms: ['"Mvett a be tsi" - "Le conte ne meurt jamais"', '"A si me be" - "L\'arbre ne tombe pas seul"'],
      quotes: ['"La langue est la mémoire du peuple" - Proverbe Beti']
    }
  },
  {
    id: 'dua',
    name: 'Duala',
    region: 'Région du Littoral',
    speakers: 300000,
    family: 'Coastal Bantu',
    historicalOverview: {
      origin: 'Langue historique de commerce de la côte camerounaise, parlée par le peuple Duala.',
      milestones: [
        'Origine côtière',
        'Langue de commerce maritime',
        'Contact avec les Européens',
        'Modernisation portuaire'
      ],
      significance: 'Langue de commerce historique, utilisée dans les échanges maritimes.'
    },
    culturalBackground: {
      traditions: ['Rituel Ngondo', 'Danse des pêcheurs', 'Cérémonie maritime'],
      festivals: ['Festival Ngondo', 'Fête de la pêche', 'Célébration maritime'],
      artMusic: ['Chants de marins', 'Artisanat maritime', 'Musique côtière'],
      folklore: ['Légendes de la mer', 'Contes de pêcheurs', 'Histoires de commerce']
    },
    geographicalContext: {
      location: 'Zone côtière atlantique du Cameroun',
      climate: 'Climat tropical maritime',
      landscape: 'Côtes, estuaires, mangroves',
      connection: 'Vocabulaire riche en termes maritimes et commerciaux'
    },
    historicalEvents: {
      events: [
        { year: '1472', title: 'Arrivée des Portugais', description: 'Premier contact européen' },
        { year: '1884', title: 'Protectorat allemand', description: 'Développement portuaire' },
        { year: '1914', title: 'Administration française', description: 'Modernisation urbaine' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Port de Douala', location: 'Douala', description: 'Port historique et moderne' },
        { name: 'Île de Manoka', location: 'Douala', description: 'Site traditionnel et spirituel' }
      ]
    },
    multimedia: {
      images: ['/images/culture/duala-1.jpg', '/images/culture/duala-2.jpg'],
      videos: ['/videos/culture/duala-ngondo.mp4'],
      audio: ['/audio/culture/duala-maritime.mp3']
    },
    educationalNotes: {
      facts: ['Langue de commerce historique', 'Influence sur le pidgin camerounais'],
      idioms: ['"Mboa a mboa" - "La mer est la mer"', '"Nga\'a be mboa" - "Celui qui ne connaît pas la mer"'],
      quotes: ['"La mer unit les peuples" - Proverbe Duala']
    }
  },
  {
    id: 'fef',
    name: 'Fe\'efe\'e',
    region: 'Région de l\'Ouest',
    speakers: 200000,
    family: 'Grassfields (Bamileke)',
    historicalOverview: {
      origin: 'Langue du peuple Bafang, appartenant à la famille Grassfields (Bamileke).',
      milestones: [
        'Origine dans les Grassfields',
        'Migration Bafang',
        'Développement agricole',
        'Modernisation rurale'
      ],
      significance: 'Langue agricole importante, reflétant la culture rurale des Grassfields.'
    },
    culturalBackground: {
      traditions: ['Rituel agricole', 'Danse des récoltes', 'Cérémonie de semence'],
      festivals: ['Festival de la récolte', 'Fête du maïs', 'Célébration agricole'],
      artMusic: ['Chants agricoles', 'Musique des champs', 'Artisanat rural'],
      folklore: ['Contes de la terre', 'Légendes agricoles', 'Histoires de récolte']
    },
    geographicalContext: {
      location: 'Hautes terres de l\'Ouest camerounais',
      climate: 'Climat de montagne tempéré',
      landscape: 'Plateaux, collines, terres agricoles',
      connection: 'Vocabulaire centré sur l\'agriculture et la vie rurale'
    },
    historicalEvents: {
      events: [
        { year: '1800', title: 'Sédentarisation agricole', description: 'Développement de l\'agriculture' },
        { year: '1900', title: 'Colonisation allemande', description: 'Modernisation agricole' },
        { year: '1960', title: 'Coopératives agricoles', description: 'Organisation moderne' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Marché de Bafang', location: 'Bafang', description: 'Centre commercial traditionnel' },
        { name: 'Terres sacrées', location: 'Ouest', description: 'Sites spirituels agricoles' }
      ]
    },
    multimedia: {
      images: ['/images/culture/fefe-1.jpg', '/images/culture/fefe-2.jpg'],
      videos: ['/videos/culture/fefe-harvest.mp4'],
      audio: ['/audio/culture/fefe-agricultural.mp3']
    },
    educationalNotes: {
      facts: ['Plus de 100 termes agricoles', 'Système de classes nominales'],
      idioms: ['"Tsi a be" - "La terre ne ment jamais"', '"Nga\'a be tsi" - "Celui qui ne cultive pas"'],
      quotes: ['"La terre nourrit celui qui la cultive" - Proverbe Bafang']
    }
  },
  {
    id: 'ful',
    name: 'Fulfulde',
    region: 'Région du Nord',
    speakers: 1500000,
    family: 'Niger-Congo (Atlantic)',
    historicalOverview: {
      origin: 'Langue des Peuls, peuple nomade d\'Afrique de l\'Ouest, établi au Cameroun.',
      milestones: [
        'Migration depuis l\'Ouest africain',
        'Établissement pastoral',
        'Conversion à l\'Islam',
        'Intégration moderne'
      ],
      significance: 'Langue de la communauté peule, importante dans le commerce et l\'élevage.'
    },
    culturalBackground: {
      traditions: ['Rituel pastoral', 'Danse des bergers', 'Cérémonie de mariage'],
      festivals: ['Festival pastoral', 'Fête de l\'élevage', 'Célébration islamique'],
      artMusic: ['Chants pastoraux', 'Musique nomade', 'Artisanat pastoral'],
      folklore: ['Contes de bergers', 'Légendes nomades', 'Histoires d\'élevage']
    },
    geographicalContext: {
      location: 'Savanes du Nord camerounais',
      climate: 'Climat sahélien avec saison sèche',
      landscape: 'Savanes, steppes, zones pastorales',
      connection: 'Vocabulaire spécialisé en élevage et vie nomade'
    },
    historicalEvents: {
      events: [
        { year: '1400', title: 'Arrivée des Peuls', description: 'Migration depuis l\'Ouest' },
        { year: '1800', title: 'Jihads peuls', description: 'Expansion islamique' },
        { year: '1900', title: 'Colonisation', description: 'Sédentarisation partielle' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Marché de Garoua', location: 'Garoua', description: 'Centre commercial pastoral' },
        { name: 'Camps nomades', location: 'Nord', description: 'Sites traditionnels pastoraux' }
      ]
    },
    multimedia: {
      images: ['/images/culture/fulfulde-1.jpg', '/images/culture/fulfulde-2.jpg'],
      videos: ['/videos/culture/fulfulde-pastoral.mp4'],
      audio: ['/audio/culture/fulfulde-nomadic.mp3']
    },
    educationalNotes: {
      facts: ['Plus de 50 termes pour le bétail', 'Influence arabe importante'],
      idioms: ['"Na\'i a be" - "Le bétail est la vie"', '"Nga\'a be na\'i" - "Celui qui n\'a pas de bétail"'],
      quotes: ['"Le bétail est la richesse du Peul" - Proverbe pastoral']
    }
  },
  {
    id: 'bas',
    name: 'Bassa',
    region: 'Région Centre-Littoral',
    speakers: 230000,
    family: 'A40 Bantu',
    historicalOverview: {
      origin: 'Langue du peuple Bassa, établi entre le Centre et le Littoral camerounais.',
      milestones: [
        'Origine dans la zone forestière',
        'Expansion vers la côte',
        'Développement commercial',
        'Modernisation urbaine'
      ],
      significance: 'Langue de pont entre le Centre et le Littoral, importante dans le commerce.'
    },
    culturalBackground: {
      traditions: ['Rituel commercial', 'Danse des marchands', 'Cérémonie de passage'],
      festivals: ['Festival commercial', 'Fête du commerce', 'Célébration urbaine'],
      artMusic: ['Chants commerciaux', 'Musique urbaine', 'Artisanat commercial'],
      folklore: ['Contes de marchands', 'Légendes commerciales', 'Histoires urbaines']
    },
    geographicalContext: {
      location: 'Zone de transition entre forêt et côte',
      climate: 'Climat tropical humide',
      landscape: 'Forêts, zones urbaines, voies commerciales',
      connection: 'Vocabulaire reflétant le commerce et la vie urbaine'
    },
    historicalEvents: {
      events: [
        { year: '1600', title: 'Développement commercial', description: 'Expansion des échanges' },
        { year: '1800', title: 'Urbanisation', description: 'Développement urbain' },
        { year: '1900', title: 'Modernisation', description: 'Intégration économique' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Marché de Edea', location: 'Edea', description: 'Centre commercial historique' },
        { name: 'Villes commerciales', location: 'Centre-Littoral', description: 'Sites urbains traditionnels' }
      ]
    },
    multimedia: {
      images: ['/images/culture/bassa-1.jpg', '/images/culture/bassa-2.jpg'],
      videos: ['/videos/culture/bassa-commercial.mp4'],
      audio: ['/audio/culture/bassa-urban.mp3']
    },
    educationalNotes: {
      facts: ['Langue de commerce', 'Influence urbaine importante'],
      idioms: ['"Mboa a be" - "Le commerce est la vie"', '"Nga\'a be mboa" - "Celui qui ne commerce pas"'],
      quotes: ['"Le commerce unit les peuples" - Proverbe Bassa']
    }
  },
  {
    id: 'bam',
    name: 'Bamum',
    region: 'Région de l\'Ouest',
    speakers: 215000,
    family: 'Grassfields',
    historicalOverview: {
      origin: 'Langue du royaume Bamum, célèbre pour son écriture indigène unique.',
      milestones: [
        'Fondation du royaume',
        'Développement de l\'écriture',
        'Apogée culturelle',
        'Préservation moderne'
      ],
      significance: 'Langue avec écriture indigène, symbole de l\'ingéniosité culturelle camerounaise.'
    },
    culturalBackground: {
      traditions: ['Rituel royal', 'Danse de cour', 'Cérémonie de couronnement'],
      festivals: ['Festival royal', 'Fête de l\'écriture', 'Célébration culturelle'],
      artMusic: ['Chants royaux', 'Musique de cour', 'Artisanat royal'],
      folklore: ['Contes royaux', 'Légendes de l\'écriture', 'Histoires de royaume']
    },
    geographicalContext: {
      location: 'Plaines de l\'Ouest camerounais',
      climate: 'Climat tropical de savane',
      landscape: 'Plaines, collines, sites royaux',
      connection: 'Vocabulaire royal et administratif sophistiqué'
    },
    historicalEvents: {
      events: [
        { year: '1394', title: 'Fondation du royaume', description: 'Création de l\'État Bamum' },
        { year: '1896', title: 'Création de l\'écriture', description: 'Développement du script Bamum' },
        { year: '1918', title: 'Protection française', description: 'Préservation culturelle' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Palais royal de Foumban', location: 'Foumban', description: 'Centre culturel et royal' },
        { name: 'Musée de l\'écriture', location: 'Foumban', description: 'Centre de l\'écriture Bamum' }
      ]
    },
    multimedia: {
      images: ['/images/culture/bamum-1.jpg', '/images/culture/bamum-2.jpg'],
      videos: ['/videos/culture/bamum-royal.mp4'],
      audio: ['/audio/culture/bamum-court.mp3']
    },
    educationalNotes: {
      facts: ['Seule écriture indigène du Cameroun', 'Plus de 500 caractères'],
      idioms: ['"Nshu a be" - "L\'écriture ne meurt jamais"', '"Nga\'a be nshu" - "Celui qui ne sait pas écrire"'],
      quotes: ['"L\'écriture est la mémoire du royaume" - Proverbe Bamum']
    }
  },
  {
    id: 'yem',
    name: 'Yemba',
    region: 'Région de l\'Ouest (Dschang)',
    speakers: 180000,
    family: 'Grassfields (Bamileke)',
    historicalOverview: {
      origin: 'Langue traditionnelle du peuple Dschang, appartenant à la famille Bamileke des Grassfields.',
      milestones: [
        'Origine dans les Grassfields',
        'Établissement à Dschang',
        'Développement agricole et éducatif',
        'Préservation moderne'
      ],
      significance: 'Langue de la région éducative de Dschang, centre universitaire important.'
    },
    culturalBackground: {
      traditions: ['Rituel agricole', 'Danse traditionnelle', 'Cérémonie de récolte'],
      festivals: ['Festival de Dschang', 'Fête de la récolte', 'Célébration éducative'],
      artMusic: ['Chants traditionnels', 'Musique des champs', 'Artisanat local'],
      folklore: ['Contes de Dschang', 'Légendes agricoles', 'Histoires éducatives']
    },
    geographicalContext: {
      location: 'Hautes terres de Dschang',
      climate: 'Climat de montagne tempéré',
      landscape: 'Collines, vallées, terres agricoles',
      connection: 'Vocabulaire reflétant la vie agricole et éducative'
    },
    historicalEvents: {
      events: [
        { year: '1800', title: 'Sédentarisation', description: 'Établissement permanent' },
        { year: '1900', title: 'Développement éducatif', description: 'Création d\'écoles' },
        { year: '1960', title: 'Université de Dschang', description: 'Centre éducatif majeur' }
      ]
    },
    heritageSites: {
      sites: [
        { name: 'Université de Dschang', location: 'Dschang', description: 'Centre éducatif et culturel' },
        { name: 'Marché traditionnel', location: 'Dschang', description: 'Centre commercial local' },
        { name: 'Sites agricoles', location: 'Dschang', description: 'Terres traditionnelles' }
      ]
    },
    multimedia: {
      images: ['/images/culture/yemba-1.jpg', '/images/culture/yemba-2.jpg'],
      videos: ['/videos/culture/yemba-traditional.mp4'],
      audio: ['/audio/culture/yemba-agricultural.mp3']
    },
    educationalNotes: {
      facts: ['Langue de l\'éducation', 'Centre universitaire important'],
      idioms: ['"Tsi a be" - "La terre est la base"', '"Nga\'a be tsi" - "Celui qui ne cultive pas"'],
      quotes: ['"L\'éducation et la terre nourrissent" - Proverbe Dschang']
    }
  }
];

export default function CultureHistoryPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCulture>(cultureData[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'culture' | 'geography' | 'history' | 'sites' | 'multimedia'>('overview');
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({});

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: BookOpenIcon },
    { id: 'culture', label: 'Culture', icon: MusicIcon },
    { id: 'geography', label: 'Géographie', icon: GlobeAltIcon },
    { id: 'history', label: 'Histoire', icon: CalendarIcon },
    { id: 'sites', label: 'Sites', icon: MapIcon },
    { id: 'multimedia', label: 'Médias', icon: CameraIcon }
  ];



  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Aperçu Historique
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {selectedLanguage.historicalOverview.origin}
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Signification Culturelle
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200">
                    {selectedLanguage.historicalOverview.significance}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Informations Générales
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Région:</span>
                    <span className="font-medium">{selectedLanguage.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Locuteurs:</span>
                    <span className="font-medium">{selectedLanguage.speakers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Famille:</span>
                    <span className="font-medium">{selectedLanguage.family}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Jalons Historiques
              </h4>
              <div className="space-y-3">
                {selectedLanguage.historicalOverview.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'culture':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contexte Culturel
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MusicIcon className="w-5 h-5" />
                    Traditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLanguage.culturalBackground.traditions.map((tradition, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span className="text-gray-700 dark:text-gray-300">{tradition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Festivals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLanguage.culturalBackground.festivals.map((festival, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span className="text-gray-700 dark:text-gray-300">{festival}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MusicIcon className="w-5 h-5" />
                    Art & Musique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLanguage.culturalBackground.artMusic.map((art, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span className="text-gray-700 dark:text-gray-300">{art}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenIcon className="w-5 h-5" />
                    Folklore
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedLanguage.culturalBackground.folklore.map((story, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        <span className="text-gray-700 dark:text-gray-300">{story}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'geography':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contexte Géographique
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="w-5 h-5" />
                    Localisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedLanguage.geographicalContext.location}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5" />
                    Climat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedLanguage.geographicalContext.climate}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CameraIcon className="w-5 h-5" />
                    Paysage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedLanguage.geographicalContext.landscape}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenIcon className="w-5 h-5" />
                    Connexion Langue-Paysage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedLanguage.geographicalContext.connection}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Événements Historiques
            </h3>
            
            <div className="space-y-6">
              {selectedLanguage.historicalEvents.events.map((event, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {event.year}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'sites':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sites du Patrimoine
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {selectedLanguage.heritageSites.sites.map((site, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {site.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-3">
                      <MapIcon className="w-4 h-4 text-primary-600" />
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        {site.location}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {site.description}
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        <MapIcon className="w-4 h-4 mr-2" />
                        Voir sur la carte
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'multimedia':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Médias & Ressources
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CameraIcon className="w-5 h-5" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedLanguage.multimedia.images.map((image, index) => (
                      <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 text-center">
                        <CameraIcon className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {image.split('/').pop()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎥 Vidéos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedLanguage.multimedia.videos.map((video, index) => (
                      <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 text-center">
                        <span className="text-4xl">🎥</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {video.split('/').pop()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎵 Audio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedLanguage.multimedia.audio.map((audio, index) => (
                      <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">🎵</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled
                          >
                            ▶️ Écouter
                          </Button>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                          {audio.split('/').pop()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5" />
                  Notes Éducatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Faits Intéressants
                    </h5>
                    <ul className="space-y-2">
                      {selectedLanguage.educationalNotes.facts.map((fact, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Expressions
                    </h5>
                    <ul className="space-y-2">
                      {selectedLanguage.educationalNotes.idioms.map((idiom, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          <em>"{idiom}"</em>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Citations
                    </h5>
                    <ul className="space-y-2">
                      {selectedLanguage.educationalNotes.quotes.map((quote, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          <em>"{quote}"</em>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🏛️ Culture & Histoire
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explorez la richesse culturelle et historique des langues camerounaises. 
            Découvrez les origines, traditions, et patrimoine de chaque communauté linguistique.
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Choisissez une langue
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {cultureData.map((language) => (
              <button
                key={language.id}
                onClick={() => setSelectedLanguage(language)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage.id === language.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {language.id === 'ewo' && '🏛️'}
                    {language.id === 'dua' && '🌊'}
                    {language.id === 'fef' && '🌾'}
                    {language.id === 'ful' && '🐄'}
                    {language.id === 'bas' && '🏪'}
                    {language.id === 'bam' && '👑'}
                    {language.id === 'yem' && '🎓'}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {language.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language.region}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {language.speakers.toLocaleString()} locuteurs
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Language Info Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedLanguage.name}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {selectedLanguage.region} • {selectedLanguage.speakers.toLocaleString()} locuteurs
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedLanguage.family}
                </p>
              </div>
              <div className="text-6xl">
                {selectedLanguage.id === 'ewo' && '🏛️'}
                {selectedLanguage.id === 'dua' && '🌊'}
                {selectedLanguage.id === 'fef' && '🌾'}
                {selectedLanguage.id === 'ful' && '🐄'}
                {selectedLanguage.id === 'bas' && '🏪'}
                {selectedLanguage.id === 'bam' && '👑'}
                {selectedLanguage.id === 'yem' && '🎓'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <Card>
          <CardContent className="p-6">
            {renderTabContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}