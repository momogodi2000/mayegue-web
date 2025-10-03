import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
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
      <div className="container-custom py-20">
        <div className="text-center max-w-4xl mx-auto">
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Langues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">10,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Mots</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">3M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Locuteurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Les Langues Camerounaises</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Le Cameroun abrite plus de 250 langues, faisant de lui l'un des pays les plus diversifiés linguistiquement au monde. 
          Nos cours se concentrent sur les langues les plus parlées et culturellement importantes.
        </p>
        
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
      </div>

      {/* Features Section */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Fonctionnalités Principales</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3">Dictionnaire Interactif</h3>
            <p className="text-gray-600 dark:text-gray-400">
              10,000+ mots avec prononciation audio, exemples contextuels et étymologie
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-3">Leçons Structurées</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cours progressifs du débutant à l'expert avec exercices interactifs et évaluations
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-3">Assistant IA</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Conversez en temps réel et recevez des corrections personnalisées avec l'IA
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-3">Gamification</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Badges, classements et défis pour rendre l'apprentissage ludique et motivant
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📴</div>
            <h3 className="text-xl font-semibold mb-3">Mode Hors Ligne</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Accédez au contenu même sans connexion internet grâce à notre PWA
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-3">Communauté</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Échangez avec d'autres apprenants et enseignants natifs dans notre communauté
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Comment ça marche</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[{
            step: '1',
            title: 'Créez votre compte',
            desc: 'Inscrivez-vous en quelques secondes et choisissez vos langues cibles.'
          }, {
            step: '2',
            title: 'Suivez les leçons',
            desc: 'Parcours structurés du niveau Débutant à Avancé avec exercices.'
          }, {
            step: '3',
            title: 'Pratiquez au quotidien',
            desc: 'Conversez avec l’assistant IA et débloquez des badges.'
          }, {
            step: '4',
            title: 'Progressez & certifiez-vous',
            desc: 'Suivez vos statistiques et passez des évaluations certifiantes.'
          }].map((item) => (
            <div key={item.step} className="card h-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="container-custom py-16">
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
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Impact & Statistiques</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">5,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Apprenants actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Écoles partenaires</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">15,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mots documentés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction utilisateur</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-12">Ils parlent de Ma'a yegue</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{
            quote: 'Une plateforme essentielle pour reconnecter la jeunesse à ses racines linguistiques. Mes élèves adorent les leçons interactives.',
            name: 'Nadine Mballa, Enseignante à Yaoundé',
            role: 'Professeur de langues'
          }, {
            quote: 'Le dictionnaire et les leçons audio m\'ont permis de progresser très rapidement. L\'assistant IA est incroyable !',
            name: 'Emmanuel Nguema, Étudiant',
            role: 'Apprenant Ewondo'
          }, {
            quote: 'Une expérience fluide, même en mode hors ligne. Bravo pour cette initiative qui préserve notre patrimoine !',
            name: 'Dr. Sylvie Tchoumi, Linguiste',
            role: 'Chercheuse en langues africaines'
          }].map((t, i) => (
            <div key={i} className="card h-full">
              <div className="text-4xl mb-2">""</div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t.quote}</p>
              <div className="text-sm font-semibold text-primary-700 dark:text-primary-400">{t.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-6">Partenaires & Soutiens</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Nous collaborons avec des institutions, des associations et des universités.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['MINAC', 'CRTV', 'Univ. Yaoundé I', 'Association Beti', 'Fondation Culturelle', 'Partenaire Tech'].map(p => (
            <span key={p} className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow text-sm text-gray-700 dark:text-gray-300">{p}</span>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="container-custom py-16">
        <h2 className="heading-2 text-center mb-8">Questions fréquentes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[{
            q: 'La plateforme est-elle gratuite ?',
            a: 'Oui, un plan Freemium est disponible. Des offres Premium donnent accès à tout le contenu.'
          }, {
            q: 'Puis-je apprendre hors ligne ?',
            a: 'Oui, le mode hors ligne permet d’accéder au dictionnaire et aux leçons téléchargées.'
          }, {
            q: 'Quels moyens de paiement acceptez-vous ?',
            a: 'CamPay (MTN/Orange), NouPai et les cartes bancaires sont supportés.'
          }].map((item, i) => (
            <details key={i} className="card">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom py-16 text-center">
        <h2 className="heading-2 mb-6">Prêt à Commencer?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'apprenants et préservez les langues camerounaises
        </p>
        <Link to="/register" className="btn-primary btn text-lg px-8 py-3">
          Créer un Compte Gratuit
        </Link>
      </div>
    </div>
  );
}
