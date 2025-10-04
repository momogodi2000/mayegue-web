import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  TrophyIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CameraIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  EyeIcon,
  HandRaisedIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { AnimatedSection, CountUp, FloatingCard, ParallaxHero } from '@/shared/components/ui/AnimatedComponents';
import { FeaturesCarousel } from '@/shared/components/ui/FeaturesCarousel';
import { VERSION_INFO } from '@/shared/constants/version';

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample media data - in a real app, this would come from an API
  const featuredVideos = [
    {
      id: 1,
      title: "Apprentissage Ewondo avec l'IA",
      description: "Découvrez comment notre assistant IA Gemini vous aide à apprendre l'Ewondo",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/api/placeholder/video1.mp4",
      duration: "2:30",
      views: "15.2K",
      likes: "1.8K"
    },
    {
      id: 2,
      title: "Visite Virtuelle du Palais Bamoun",
      description: "Explorez le patrimoine historique camerounais en réalité virtuelle",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/api/placeholder/video2.mp4",
      duration: "4:15",
      views: "8.7K",
      likes: "945"
    },
    {
      id: 3,
      title: "Traditions Musicales Duala",
      description: "Immersion dans la musique traditionnelle et les instruments locaux",
      thumbnail: "/api/placeholder/400/225",
      videoUrl: "/api/placeholder/video3.mp4",
      duration: "3:45",
      views: "12.1K",
      likes: "1.2K"
    }
  ];

  const culturalImages = [
    {
      id: 1,
      title: "Masques Traditionnels Bamoun",
      description: "Collection de masques royaux du royaume Bamoun",
      imageUrl: "/api/placeholder/600/400",
      category: "Art Traditionnel"
    },
    {
      id: 2,
      title: "Danse Ekang",
      description: "Cérémonie traditionnelle des peuples Beti",
      imageUrl: "/api/placeholder/600/400",
      category: "Danse"
    },
    {
      id: 3,
      title: "Cuisine Bamiléké",
      description: "Plats traditionnels et techniques culinaires ancestrales",
      imageUrl: "/api/placeholder/600/400",
      category: "Cuisine"
    },
    {
      id: 4,
      title: "Architecture Grassfields",
      description: "Maisons traditionnelles et palais royaux",
      imageUrl: "/api/placeholder/600/400",
      category: "Architecture"
    }
  ];

  const achievements = [
    {
      icon: TrophyIcon,
      title: "Champion Linguistique",
      description: "Maîtrisez 3 langues camerounaises",
      progress: 85,
      color: "text-yellow-500"
    },
    {
      icon: StarIcon,
      title: "Explorateur Culturel",
      description: "Découvrez 50 sites historiques",
      progress: 60,
      color: "text-purple-500"
    },
    {
      icon: HeartIcon,
      title: "Gardien du Patrimoine",
      description: "Contribuez à la préservation culturelle",
      progress: 40,
      color: "text-red-500"
    },
    {
      icon: RocketLaunchIcon,
      title: "Innovateur AR/VR",
      description: "Explorez 10 expériences immersives",
      progress: 25,
      color: "text-blue-500"
    }
  ];

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % featuredVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % culturalImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + culturalImages.length) % culturalImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Ma'a yegue - Apprenez les Langues Camerounaises | Ewondo, Duala, Fulfulde</title>
        <meta name="description" content="Plateforme d'apprentissage des langues traditionnelles camerounaises. Apprenez Ewondo, Duala, Fulfulde, Bassa, Bamum et Fe'efe'e avec des leçons interactives, dictionnaire audio et assistant IA. Mode hors ligne disponible." />
        <meta name="keywords" content="langues camerounaises, ewondo, duala, fulfulde, bassa, bamum, fe'efe'e, apprentissage langues, dictionnaire camerounais, cours langues traditionnelles, IA linguistique" />
        <meta name="author" content="Ma'a yegue" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Ma'a yegue - Apprenez les Langues Camerounaises" />
        <meta property="og:description" content="Plateforme d'apprentissage des langues traditionnelles camerounaises avec IA et mode hors ligne" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.origin : ''} />
        <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/assets/logo/logo.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Ma'a yegue" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ma'a yegue - Apprenez les Langues Camerounaises" />
        <meta name="twitter:description" content="Plateforme d'apprentissage des langues traditionnelles camerounaises avec IA et mode hors ligne" />
        <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/assets/logo/logo.jpg`} />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#10B981" />
        <meta name="msapplication-TileColor" content="#10B981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ma'a yegue" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: "Ma'a yegue",
            url: typeof window !== 'undefined' ? window.location.origin : 'https://maayegue.app',
            description: "Plateforme d'apprentissage des langues traditionnelles camerounaises",
            logo: `${typeof window !== 'undefined' ? window.location.origin : 'https://maayegue.app'}/assets/logo/logo.jpg`,
            sameAs: [
              'https://facebook.com/maayegue',
              'https://twitter.com/maayegue',
              'https://instagram.com/maayegue'
            ],
            potentialAction: {
              '@type': 'SearchAction',
              target: `${typeof window !== 'undefined' ? window.location.origin : 'https://maayegue.app'}/dictionary?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'XAF',
              description: 'Plan gratuit disponible'
            }
          })}
        </script>
        
        {/* Language Learning Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: "Apprentissage des Langues Camerounaises",
            description: "Cours complets pour apprendre les langues traditionnelles camerounaises",
            provider: {
              '@type': 'Organization',
              name: "Ma'a yegue"
            },
            courseMode: ['online', 'offline'],
            educationalLevel: ['beginner', 'intermediate', 'advanced'],
            inLanguage: ['ewondo', 'duala', 'fulfulde', 'bassa', 'bamum', 'fe\'efe\'e'],
            teaches: 'Langues traditionnelles camerounaises'
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <ParallaxHero>
        <div className="container-custom py-20">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            {/* Version Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              🎉 Nouveau : Version {VERSION_INFO.version} - {VERSION_INFO.name}
            </div>
            
            {/* Logo/Title */}
          <h1 className="heading-1 mb-6 gradient-text">
            Ma’a yegue
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Apprenez les langues traditionnelles camerounaises avec une technologie moderne
          </p>

          {/* Language Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Ewondo', 'Duala', 'Fulfulde', 'Bassa', 'Bamum', "Fe'efe'e"].map((lang) => (
              <span key={lang} className="badge-primary text-base px-4 py-2">
                {lang}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-primary btn text-lg px-8 py-3">
              Commencer Gratuitement
            </Link>
            <Link to="/dictionary" className="btn-outline btn text-lg px-8 py-3">
              Explorer le Dictionnaire
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={280} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Langues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={15000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mots</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={5000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Apprenants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={50} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Nouvelles Fonctionnalités</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </ParallaxHero>

      {/* Enhanced Languages Section */}
      <AnimatedSection className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-6">Les Langues Camerounaises</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Le Cameroun abrite plus de 250 langues, faisant de lui l'un des pays les plus diversifiés linguistiquement au monde. 
            Nos cours se concentrent sur les langues les plus parlées et culturellement importantes.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/atlas" className="btn-primary btn">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Voir l'Atlas Linguistique
            </Link>
            <Link to="/encyclopedia" className="btn-outline btn">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Explorer l'Encyclopédie
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Ewondo',
              speakers: '1.2M',
              region: 'Centre, Sud',
              description: 'Langue bantoue parlée principalement par les Beti. Langue officielle de l\'Église catholique au Cameroun.',
              cultural: 'Utilisée dans la littérature, la musique et les médias'
            },
            {
              name: 'Duala',
              speakers: '1.1M',
              region: 'Littoral',
              description: 'Langue bantoue côtière, langue de commerce historique. Première langue camerounaise écrite.',
              cultural: 'Langue de la musique makossa et du commerce traditionnel'
            },
            {
              name: 'Fulfulde',
              speakers: '2.2M',
              region: 'Nord, Extrême-Nord, Adamaoua',
              description: 'Langue peule parlée dans toute l\'Afrique de l\'Ouest. Langue de l\'islam et du commerce transsaharien.',
              cultural: 'Langue de la poésie, de l\'épopée et de la tradition orale'
            },
            {
              name: 'Bassa',
              speakers: '800K',
              region: 'Littoral, Centre',
              description: 'Langue bantoue avec un système tonal complexe. Langue de la culture bassa.',
              cultural: 'Langue de la musique traditionnelle et des cérémonies'
            },
            {
              name: 'Bamum',
              speakers: '420K',
              region: 'Ouest',
              description: 'Langue bantoue avec un système d\'écriture unique créé par le roi Njoya au 19ème siècle.',
              cultural: 'Langue de la royauté bamoun et de l\'art traditionnel'
            },
            {
              name: 'Fe\'efe\'e',
              speakers: '120K',
              region: 'Ouest',
              description: 'Langue bantoue des Grassfields, connue pour sa complexité phonologique.',
              cultural: 'Langue de la tradition orale et des cérémonies traditionnelles'
            }
          ].map((lang) => (
            <div key={lang.name} className="card h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400">{lang.name}</h3>
                <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {lang.speakers} locuteurs
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Région:</strong> {lang.region}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{lang.description}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                <strong>Culture:</strong> {lang.cultural}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* V1.1 Features Showcase */}
      <AnimatedSection className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 mb-4 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              🆕 Nouveau dans la Version {VERSION_INFO.version}
            </div>
            <h2 className="heading-2 mb-6">Découvrez les Nouvelles Fonctionnalités</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {VERSION_INFO.description}
            </p>
          </div>
          
          <FeaturesCarousel items={[
            {
              id: 'atlas',
              title: 'Atlas Linguistique Interactif',
              description: 'Explorez les 280+ langues du Cameroun sur une carte 3D interactive avec données géolocalisées et informations culturelles.',
              icon: '🗺️',
              link: '/atlas',
              category: 'Navigation'
            },
            {
              id: 'encyclopedia',
              title: 'Encyclopédie Culturelle',
              description: 'Découvrez la richesse culturelle camerounaise : traditions, art, histoire et pratiques de plus de 280 groupes ethniques.',
              icon: '📚',
              link: '/encyclopedia',
              category: 'Culture'
            },
            {
              id: 'historical-sites',
              title: 'Sites Historiques & Patrimoniaux',
              description: 'Visitez virtuellement les palais royaux, sites archéologiques et monuments historiques du Cameroun.',
              icon: '🏛️',
              link: '/historical-sites',
              category: 'Patrimoine'
            },
            {
              id: 'marketplace',
              title: 'Marketplace Culturel',
              description: 'Soutenez l\'artisanat camerounais authentique : sculptures, tissages, musique et créations locales.',
              icon: '🛍️',
              link: '/marketplace',
              category: 'Commerce'
            },
            {
              id: 'ar-vr',
              title: 'Expériences AR/VR',
              description: 'Immersion culturelle en réalité augmentée et virtuelle dans les villages traditionnels camerounais.',
              icon: '🥽',
              link: '/ar-vr',
              category: 'Innovation'
            },
            {
              id: 'rpg',
              title: 'Gamification RPG Complète',
              description: 'Système de jeu avec avatars, quêtes, compétitions et économie virtuelle Ngondo Coins.',
              icon: '🎮',
              link: '/rpg',
              category: 'Gaming'
            },
            {
              id: 'ai-features',
              title: 'Fonctionnalités IA Avancées',
              description: 'Assistant IA Gemini, mentor virtuel, grand-mère virtuelle et apprentissage adaptatif.',
              icon: '🤖',
              link: '/ai-features',
              category: 'Intelligence Artificielle'
            }
          ]} />
          
          <div className="text-center mt-12">
            <Link to="/atlas" className="btn-primary btn text-lg px-8 py-3 mr-4">
              Explorer l'Atlas Linguistique
            </Link>
            <Link to="/encyclopedia" className="btn-outline btn text-lg px-8 py-3">
              Découvrir l'Encyclopédie
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* New Video Showcase Section */}
      <AnimatedSection className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-6">Découvrez Ma'a yegue en Vidéo</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Plongez dans l'univers de Ma'a yegue à travers nos vidéos de démonstration et témoignages d'utilisateurs.
          </p>
        </div>

        <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px] md:h-[600px]">
            <img 
              src={featuredVideos[currentVideoIndex].thumbnail} 
              alt={featuredVideos[currentVideoIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {isVideoPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
              </button>
            </div>
            
            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{featuredVideos[currentVideoIndex].title}</h3>
              <p className="text-gray-200 mb-4">{featuredVideos[currentVideoIndex].description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>{featuredVideos[currentVideoIndex].duration}</span>
                <span>•</span>
                <span>{featuredVideos[currentVideoIndex].views} vues</span>
                <span>•</span>
                <span>{featuredVideos[currentVideoIndex].likes} likes</span>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Video Thumbnails */}
          <div className="flex gap-3 p-6 bg-gray-800">
            {featuredVideos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => setCurrentVideoIndex(index)}
                className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentVideoIndex ? 'ring-2 ring-red-500' : 'opacity-60 hover:opacity-80'
                }`}
              >
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Cultural Images Gallery */}
      <AnimatedSection className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-6">Galerie Culturelle</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explorez la richesse visuelle du patrimoine camerounais à travers notre collection d'images culturelles.
          </p>
        </div>

        <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative h-[400px] md:h-[500px]">
            <img 
              src={culturalImages[currentImageIndex].imageUrl} 
              alt={culturalImages[currentImageIndex].title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{culturalImages[currentImageIndex].title}</h3>
                  <p className="text-gray-200 mb-2">{culturalImages[currentImageIndex].description}</p>
                  <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                    {culturalImages[currentImageIndex].category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all">
                    <CameraIcon className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Image Thumbnails */}
          <div className="flex gap-3 p-6 bg-gray-100 dark:bg-gray-700">
            {culturalImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentImageIndex ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-80'
                }`}
              >
                <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Achievements & Progress Section */}
      <AnimatedSection className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-6">Défis & Récompenses</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Progressez dans votre apprentissage et débloquez des récompenses exclusives en explorant la culture camerounaise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <FloatingCard key={index} className="card p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 ${achievement.color}`}>
                  <achievement.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{achievement.description}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{achievement.progress}% complété</p>
              </FloatingCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/rpg" className="btn-primary btn text-lg px-8 py-3">
              <TrophyIcon className="w-5 h-5 mr-2" />
              Voir tous les Défis
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Fonctionnalités Principales</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3">Dictionnaire Interactif</h3>
            <p className="text-gray-600 dark:text-gray-400">
              15,000+ mots avec prononciation audio, exemples contextuels et étymologie
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-3">Leçons Structurées</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cours progressifs du débutant à l'expert avec exercices interactifs et évaluations
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">Assistant IA Gemini</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conversez en temps réel et recevez des corrections personnalisées avec l'IA
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-3">Gamification RPG</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Système complet de RPG avec avatars, quêtes et progression épique
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">�</div>
            <h3 className="text-xl font-semibold mb-3">Mode Hors Ligne</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Accédez au contenu même sans connexion internet grâce à notre PWA
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-3">Atlas Linguistique</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Carte interactive 3D des langues du Cameroun avec données géolocalisées
            </p>
          </FloatingCard>
          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-3">Sites Historiques</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visites virtuelles 360° des monuments et palais royaux camerounais
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold mb-3">Marketplace Culturel</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Soutenez l'artisanat local et découvrez des créations authentiques
            </p>
          </FloatingCard>

          <FloatingCard className="text-center">
            <div className="text-4xl mb-4">🥽</div>
            <h3 className="text-xl font-semibold mb-3">Expériences AR/VR</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Immersion culturelle en réalité augmentée et virtuelle
            </p>
          </FloatingCard>
        </div>
      </AnimatedSection>

      {/* Enhanced How It Works */}
      <AnimatedSection className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Comment ça marche</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[{
            step: '1',
            title: 'Créez votre compte',
            desc: 'Inscrivez-vous en quelques secondes et choisissez vos langues cibles.',
            icon: '👤'
          }, {
            step: '2',
            title: 'Explorez & Apprenez',
            desc: 'Parcours l\'atlas linguistique, l\'encyclopédie culturelle et les sites historiques.',
            icon: '🗺️'
          }, {
            step: '3',
            title: 'Pratiquez & Jouez',
            desc: 'Conversez avec l\'IA, participez aux quêtes RPG et débloquez des récompenses.',
            icon: '🎮'
          }, {
            step: '4',
            title: 'Progressez & Contribuez',
            desc: 'Suivez vos statistiques, certifiez-vous et contribuez au patrimoine culturel.',
            icon: '🏆'
          }].map((item) => (
            <FloatingCard key={item.step} className="card h-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {item.icon}
                </div>
                <div>
                  <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold mb-1">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </FloatingCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Enhanced Mission Section */}
      <AnimatedSection className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-2 mb-6">Notre Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Préserver et promouvoir les langues traditionnelles camerounaises à travers la technologie moderne. 
              Nous croyons que chaque langue porte une richesse culturelle unique qui mérite d'être préservée et transmise.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Préservation Culturelle</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Documenter et préserver les langues menacées pour les générations futures
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Accessibilité</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Rendre l'apprentissage accessible à tous, partout au Cameroun et dans le monde
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Utiliser l'IA et les technologies modernes pour enrichir l'expérience d'apprentissage
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/about" className="btn-primary btn mr-4">
                En savoir plus
              </Link>
              <Link to="/register" className="btn-outline btn">
                Rejoindre la mission
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Impact & Statistiques</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={5000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Apprenants actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={50} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Écoles partenaires</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={15000} suffix="+" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mots documentés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  <CountUp end={95} suffix="%" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction utilisateur</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white dark:bg-gray-600 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Nouveautés V1.1</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>• {VERSION_INFO.majorFeatures.length} nouveaux modules</p>
                <p>• Expériences AR/VR immersives</p>
                <p>• Marketplace culturel</p>
                <p>• Gamification RPG complète</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Testimonials */}
      <AnimatedSection className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Ils parlent de Ma'a yegue</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            quote: 'Une plateforme essentielle pour reconnecter la jeunesse à ses racines linguistiques. Mes élèves adorent les leçons interactives et l\'atlas linguistique.',
            name: 'Nadine Mballa, Enseignante à Yaoundé',
            role: 'Professeur de langues',
            rating: 5,
            avatar: '/api/placeholder/64/64'
          }, {
            quote: 'Le dictionnaire et les leçons audio m\'ont permis de progresser très rapidement. L\'assistant IA et les expériences AR/VR sont incroyables !',
            name: 'Emmanuel Nguema, Étudiant',
            role: 'Apprenant Ewondo',
            rating: 5,
            avatar: '/api/placeholder/64/64'
          }, {
            quote: 'Une expérience fluide, même en mode hors ligne. L\'encyclopédie culturelle et le marketplace sont des ajouts fantastiques !',
            name: 'Dr. Sylvie Tchoumi, Linguiste',
            role: 'Chercheuse en langues africaines',
            rating: 5,
            avatar: '/api/placeholder/64/64'
          }].map((t, i) => (
            <FloatingCard key={i} className="card h-full p-6">
              <div className="flex items-center mb-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <div className="text-sm font-semibold text-primary-700 dark:text-primary-400">{t.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{t.role}</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <StarIcon key={j} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-2xl mb-2 text-primary-600">"</div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t.quote}</p>
              <div className="text-2xl text-primary-600 text-right">"</div>
            </FloatingCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Enhanced Partners */}
      <AnimatedSection className="container-custom py-16">
        <h2 className="heading-2 text-center mb-6">Partenaires & Soutiens</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Nous collaborons avec des institutions, des associations et des universités pour préserver le patrimoine culturel camerounais.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'MINAC', logo: '/api/placeholder/120/60', type: 'Ministère' },
            { name: 'CRTV', logo: '/api/placeholder/120/60', type: 'Média' },
            { name: 'Univ. Yaoundé I', logo: '/api/placeholder/120/60', type: 'Université' },
            { name: 'Association Beti', logo: '/api/placeholder/120/60', type: 'Association' },
            { name: 'Fondation Culturelle', logo: '/api/placeholder/120/60', type: 'Fondation' },
            { name: 'Google AI', logo: '/api/placeholder/120/60', type: 'Technologie' }
          ].map((partner, index) => (
            <FloatingCard key={index} className="card p-4 text-center">
              <img src={partner.logo} alt={partner.name} className="w-full h-12 object-contain mb-2" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{partner.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{partner.type}</div>
            </FloatingCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Enhanced FAQ */}
      <AnimatedSection className="container-custom py-16">
        <h2 className="heading-2 text-center mb-8">Questions fréquentes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[{
            q: 'La plateforme est-elle gratuite ?',
            a: 'Oui, un plan Freemium est disponible avec accès aux fonctionnalités de base. Des offres Premium donnent accès à l\'atlas linguistique, l\'encyclopédie culturelle, les expériences AR/VR et le marketplace.'
          }, {
            q: 'Puis-je apprendre hors ligne ?',
            a: 'Oui, le mode hors ligne permet d\'accéder au dictionnaire, aux leçons téléchargées et à l\'encyclopédie culturelle. L\'assistant IA fonctionne aussi en mode hors ligne pour les conversations de base.'
          }, {
            q: 'Quels moyens de paiement acceptez-vous ?',
            a: 'CamPay (MTN/Orange), NouPai, les cartes bancaires et les cryptomonnaies sont supportés. Le marketplace culturel accepte aussi les paiements en Ngondo Coins (monnaie virtuelle de la plateforme).'
          }, {
            q: 'Comment fonctionnent les expériences AR/VR ?',
            a: 'Les expériences AR utilisent votre caméra pour superposer des éléments culturels dans votre environnement. Les expériences VR nécessitent un casque VR compatible WebXR pour une immersion complète dans les villages traditionnels.'
          }, {
            q: 'Puis-je contribuer au contenu ?',
            a: 'Absolument ! Vous pouvez soumettre de nouveaux mots, enregistrements audio, photos culturelles et même créer des quêtes pour la communauté. Les contributions sont validées par des experts linguistiques.'
          }].map((item, i) => (
            <FloatingCard key={i} className="card">
              <details className="group">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white p-4 list-none flex items-center justify-between">
                  <span>{item.q}</span>
                  <ChevronRightIcon className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.a}</p>
                </div>
              </details>
            </FloatingCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Enhanced CTA Section */}
      <AnimatedSection className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-6 text-white">Prêt à Commencer votre Voyage Culturel?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers d'apprenants et découvrez la richesse des langues et cultures camerounaises avec les nouvelles fonctionnalités V1.1
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/register" className="btn-white btn text-lg px-8 py-3">
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Créer un Compte Gratuit
            </Link>
            <Link to="/atlas" className="btn-outline-white btn text-lg px-8 py-3">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Explorer l'Atlas
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-100 mb-1">
                <CountUp end={280} suffix="+" />
              </div>
              <div className="text-sm text-primary-200">Langues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-100 mb-1">
                <CountUp end={50} suffix="+" />
              </div>
              <div className="text-sm text-primary-200">Nouvelles Fonctionnalités</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-100 mb-1">
                <CountUp end={5000} suffix="+" />
              </div>
              <div className="text-sm text-primary-200">Apprenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-100 mb-1">
                <CountUp end={95} suffix="%" />
              </div>
              <div className="text-sm text-primary-200">Satisfaction</div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
