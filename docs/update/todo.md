CAHIER DES CHARGES
 Application Mobile d'Apprentissage des Langues Traditionnelles
 Camerounaises
 Version : 1.0
 Date : 24 septembre 2025
 Client : [Nom du client]
 Équipe projet : [Nom de l'équipe]
 TABLE DES MATIÈRES
 1. 
2. 
3. 
4. 
5. 
6. 
7. 
8. 
9. 
10. 
11. 
12. 
Présentation du projet
 Contexte et objectifs
 Périmètre fonctionnel
 Architecture technique
 Spécifications fonctionnelles
 Acteurs du système
 Modules fonctionnels
 Spécifications techniques
 Système de paiement
 Contraintes et exigences
 Planning et livrables
 Budget prévisionnel
 1. PRÉSENTATION DU PROJET
 1.1 Description générale
 L'application mobile d'apprentissage des langues traditionnelles camerounaises est une plateforme
 éducative innovante permettant aux utilisateurs d'apprendre et de préserver les langues locales du
 Cameroun à travers des méthodes interactives et modernes.
 1.2 Objectifs principaux
Préservation et transmission des langues traditionnelles camerounaises
 Démocratisation de l'accès à l'apprentissage linguistique
 Création d'une communauté d'apprenants et d'enseignants
 Utilisation des technologies modernes (IA, reconnaissance vocale, etc.)
 1.3 Public cible
 Étudiants et chercheurs en langues africaines
 Diaspora camerounaise souhaitant maintenir ses liens culturels
 Touristes et expatriés au Cameroun
 Institutions éducatives et culturelles
 2. CONTEXTE ET OBJECTIFS
 2.1 Problématique
 Érosion progressive des langues traditionnelles camerounaises
 Manque d'outils numériques pour l'apprentissage de ces langues
 Difficulté d'accès aux ressources pédagogiques de qualité
 Besoin de méthodes d'apprentissage adaptées aux nouvelles générations
 2.2 Enjeux
 Culturel : Préservation du patrimoine linguistique
 Éducatif : Facilitation de l'apprentissage multi-langue
 Technologique : Innovation dans l'e-learning mobile
 Économique : Création d'un modèle économique viable
 2.3 Valeur ajoutée
 Interface intuitive et moderne
 Contenu authentique validé par des locuteurs natifs
 Gamification de l'apprentissage
 Intégration de l'intelligence artificielle
 Système de paiement mobile adapté au contexte local
3. PÉRIMÈTRE FONCTIONNEL
 3.1 Fonctionnalités incluses
 Module de leçons interactives
 Section dictionnaire et prononciation
 Jeux éducatifs gamifiés
 Communauté d'apprentissage
 Système d'évaluation et progression
 Intégration IA pour conversation
 Système de paiement mobile (CamPay/NouPai)
 Dashboard personnalisé par profil utilisateur
 3.2 Fonctionnalités exclues (V1)
 Mode hors-ligne complet
 Intégration réseaux sociaux externes
 Système de visioconférence intégré
 Marketplace de contenus tiers
 4. ARCHITECTURE TECHNIQUE
 4.1 Architecture générale
 Pattern MVVM (Model-View-ViewModel)
 Model : Gestion des données et logique métier
 View : Interface utilisateur (Flutter UI)
 ViewModel : Liaison entre Model et View, gestion des états
 4.2 Stack technique
 Frontend : Flutter (Dart) - Version mobile iOS/Android
 Backend : Firebase Suite
 Authentication : Firebase Auth
 Base de données : Firestore
 Stockage : Firebase Storage
Fonctions : Firebase Functions
 Analytics : Firebase Analytics
 Messagerie : Firebase Cloud Messaging
 IA : Intégration modèle de traitement du langage naturel
 Paiement : CamPay API / NouPai (fallback)
 4.3 Architecture des données
 ├── Users/
 │   ├── profile_data
 ├── Users/
 │   ├── profile_data
 │   ├── learning_progress
 │   ├── learning_progress
 │   └── preferences
 │   └── preferences
 ├── Languages/
 ├── Languages/
 │   ├── lessons
 │   ├── lessons
 │   ├── vocabulary
 │   ├── vocabulary
 │   └── pronunciation_files
 │   └── pronunciation_files
 ├── Community/
 ├── Community/
 │   ├── discussions
 │   ├── discussions
 │   ├── user_contributions
 │   ├── user_contributions
 │   └── ratings_reviews
 │   └── ratings_reviews
 └── Assessments/
 └── Assessments/
 ├── test_results
 ├── test_results
 ├── progress_tracking
 ├── progress_tracking
 └── certifications
 └── certifications
 5. SPÉCIFICATIONS FONCTIONNELLES
 5.1 Gestion des utilisateurs
 Inscription/Connexion multi-méthodes
 Email/mot de passe
 Numéro de téléphone (SMS)
 Réseaux sociaux (Google, Facebook)
 Gestion des profils utilisateurs
 Système de rôles et permissions
 Récupération de mot de passe
 5.2 Module d'apprentissage
Parcours d'apprentissage personnalisés
 Leçons interactives avec audio/vidéo
 Tests de niveau adaptatifs
 Suivi de progression en temps réel
 Badges et récompenses
 5.3 Outils pédagogiques
 Dictionnaire multimédia
 Exercices de prononciation avec reconnaissance vocale
 Traducteur intégré
 Flashcards intelligentes
 Quizz adaptatifs
 6. ACTEURS DU SYSTÈME
 6.1 Acteurs principaux
 6.1.1 Visiteur
 Permissions :
 Créer un compte utilisateur
 Consulter les offres et tarifs de la plateforme
 Accéder aux contenus de démonstration
 Parcourir les langues disponibles
 Consulter les témoignages et avis
 6.1.2 Apprenant
 Permissions héritées du Visiteur +
 S'authentifier sur la plateforme
 Consulter son tableau de bord personnalisé
 Participer aux discussions communautaires (chat)
 Gérer son profil utilisateur
 Sélectionner une ou plusieurs langues d'apprentissage
Publier des commentaires et avis
 Passer des tests de niveau
 Converser avec l'assistant IA
 Consulter l'historique de ses résultats
 Utiliser l'outil de traduction
 Accéder aux contenus pédagogiques payants
 Être évalué et recevoir des certifications
 Recevoir et gérer ses notifications
 Effectuer des exercices interactifs
 Participer aux quizz
 Suivre des leçons structurées
 Visualiser sa progression d'apprentissage
 6.1.3 Enseignant
 Permissions spécifiques :
 Créer et gérer les leçons pédagogiques
 Développer et administrer les exercices
 Concevoir des quizz personnalisés
 Accéder au dashboard des apprenants
 Organiser et superviser les évaluations
 Créer des contenus interactifs multimédia
 Suivre la progression individuelle des apprenants
 Générer des rapports de performance
 Valider les certifications
 6.1.4 Administrateur
 Permissions étendues :
 Assurer la maintenance technique du système
 Gérer l'ensemble des comptes utilisateurs
 Modérer les contenus et discussions
 Configurer les paramètres de la plateforme
Accéder aux analytics et statistiques
 Gérer les paiements et abonnements
 Superviser la qualité des contenus
 Administrer les rôles et permissions
 6.2 Acteurs secondaires
 6.2.1 API de Paiement (CamPay/NouPai)
 Traitement des transactions financières
 Vérification des paiements
 Gestion des remboursements
 Reporting des transactions
 6.2.2 Modèle IA
 Traitement du langage naturel
 Assistance conversationnelle
 Recommandations personnalisées
 Correction automatique
 6.2.3 Application de Messagerie
 Gestion des notifications push
 Messages système
 Communications inter-utilisateurs
 Alertes de progression
 7. MODULES FONCTIONNELS
 7.1 Module Leçons Interactives
 7.1.1 Structure des leçons
 Niveaux : Débutant, Intermédiaire, Avancé
 Thématiques : Salutations, Famille, Commerce, Culture, etc.
 Format multimédia : Texte, Audio, Vidéo, Images
 Progression linéaire et adaptative
7.1.2 Fonctionnalités
 Lecture audio par locuteurs natifs
 Transcription phonétique
 Exercices intégrés
 Évaluation en temps réel
 Répétition espacée
 7.2 Module Dictionnaire et Prononciation
 7.2.1 Base de données lexicale
 Dictionnaire multilingue (Français, Anglais, Langues locales)
 Catégories grammaticales
 Exemples d'usage en contexte
 Variantes régionales
 7.2.2 Outils de prononciation
 Enregistrements audio haute qualité
 Reconnaissance vocale pour correction
 Visualisation phonétique
 Comparaison de prononciation
 7.3 Module Jeux Éducatifs
 7.3.1 Types de jeux
 Memory linguistique
 Puzzle de mots
 Quiz chronométrés
 Associations image-mot
 Jeux de rôle conversationnels
 7.3.2 Gamification
 Système de points et niveaux
 Classements et compétitions
 Badges de réussite
Défis quotidiens/hebdomadaires
 7.4 Module Communauté
 7.4.1 Espaces d'échange
 Forums thématiques par langue
 Chat en temps réel
 Groupes d'étude
 Sessions de conversation
 7.4.2 Fonctionnalités sociales
 Profils utilisateurs publics
 Système de mentorship
 Partage de ressources
 Évaluations et commentaires
 7.5 Module Évaluation et Certification
 7.5.1 Types d'évaluations
 Tests de positionnement
 Évaluations continues
 Examens de certification
 Auto-évaluations
 7.5.2 Reporting et analytics
 Tableaux de bord détaillés
 Analyse de progression
 Recommandations personnalisées
 Historique complet
 8. SPÉCIFICATIONS TECHNIQUES
 8.1 Architecture Frontend (Flutter)
 8.1.2 Structure MVVM
dart
 lib/ /
 ├── core
 lib
 ├── core/ /
 │   ├── constants
 │   ├── constants/ /
 │   ├── errors
 │   ├── errors/ /
 │   ├── utils
 │   ├── utils/ /
 │   └── services
 │   └── services/ /
 ├── features
 ├── features/ /
 │   ├── authentication
 │   ├── authentication/ /
 │   │   ├── data
 │   │   ├── data/ /
 │   │   ├── domain
 │   │   ├── domain/ /
 │   │   └── presentation
 │   │   └── presentation/ /
 │   ├── lessons
 │   ├── lessons/ /
 │   │   ├── data
 │   │   ├── data/ /
 │   │   ├── domain
 │   │   ├── domain/ /
 │   │   └── presentation
 │   │   └── presentation/ /
 │   └── community
 │       
│   └── community/ /
 │       
├── data
 ├── data/ /
 │       
│       
│       
│       
├── domain
 ├── domain/ /
 └── presentation/ /
 └── shared
 └── presentation
 └── shared/ /
 ├── widgets
 ├── widgets/ /
 └── themes
 └── themes/ /
 8.1.2 Packages principaux
 State Management : Provider/Riverpod
 Navigation : Go Router
 HTTP : Dio
 Local Storage : Hive/SharedPreferences
 Audio/Video : Just Audio, Video Player
 Reconnaissance vocale : Speech to Text
 Internationalisation : Flutter Intl
 8.2 Architecture Backend (Firebase)
 8.2.1 Firebase Services
 Authentication : Gestion multi-provider
 Firestore : Base de données NoSQL
Storage : Stockage des médias
 Functions : Logique métier serveur
 Analytics : Suivi utilisateur
 Crashlytics : Monitoring erreurs
 8.2.2 Structure Firestore
 8.3 Intégration IA
 8.3.1 Services IA
 Modèle de conversation : GPT/Claude API
 Reconnaissance vocale : Google Speech-to-Text
 Synthèse vocale : Google Text-to-Speech
 javascript
 // Collections principales // Collections principales
 users users: :  { {
    userId userId: :  { {
        profile profile: :  { {} }, ,
        progress progress: :  { {} }, ,
        preferences preferences: :  { {} }
    } }
 } }
 languages languages: :  { {
    languageId languageId: :  { {
        metadata metadata: :  { {} }, ,
        lessons lessons: :  { {} }, ,
        vocabulary vocabulary: :  { {} }
    } }
 } }
 communities communities: :  { {
    communityId communityId: :  { {
        discussions discussions: :  { {} }, ,
        members members: :  { {} }, ,
        resources resources: :  { {} }
    } }
 } }
Traduction : Google Translate API
 8.3.2 Fonctionnalités IA
 Assistant conversationnel intelligent
 Correction automatique de prononciation
 Recommandations de contenu personnalisées
 Analyse de progression automatisée
 9. SYSTÈME DE PAIEMENT
 9.1 Intégration CamPay
 9.1.1 Services CamPay
 CamPay Core : Paiements standard
 NouPai : Solution de fallback
 Mobile Money : MTN Mobile Money, Orange Money
 Cartes bancaires : Visa, Mastercard
 9.1.2 Processus de paiement
 1. Sélection de l'offre par l'utilisateur
 2. Redirection vers l'interface CamPay
 3. Authentification et validation du paiement
 4. Callback de confirmation
 5. Activation automatique des services
 9.2 Modèle économique
 9.2.1 Types d'abonnements
 Freemium : Accès limité gratuit
 Premium mensuel : 2 500 FCFA/mois
 Premium annuel : 25 000 FCFA/an
 Premium enseignant : 15 000 FCFA/an
 Achat de cours individuels : 1 000 - 5 000 FCFA
9.2.2 Fonctionnalités par plan
 Fonctionnalité Freemium Premium Enseignant
 Leçons de base
 5/mois
 Illimité
 Jeux éducatifs
 Limité
 IA Assistant
 Non
 Communauté
 Certificats
 
 Complet
 Illimité
 Complet
 Oui
 Oui
 Lecture
 Complet
 Modération
 Non
 Oui
 Création
 
 10. CONTRAINTES ET EXIGENCES
 10.1 Contraintes techniques
 10.1.1 Performance
 Temps de chargement : < 3 secondes
 Fluidité animations : 60 FPS minimum
 Taille application : < 100 MB
 Consommation batterie : Optimisée
 10.1.2 Compatibilité
 iOS : Version 12.0 et supérieures
 Android : API Level 21 (Android 5.0) et supérieures
 Résolution : Support multi-écrans
 Orientation : Portrait prioritaire, paysage optionnel
 10.2 Exigences de sécurité
 10.2.1 Authentification
 Chiffrement des mots de passe (bcrypt)
 Authentification à deux facteurs (2FA)
 Sessions sécurisées avec tokens JWT
 Protection contre les attaques par force brute
 10.2.2 Données
Chiffrement des données sensibles
 Conformité RGPD pour les utilisateurs européens
 Sauvegarde automatique quotidienne
 Audit trail des actions critiques
 10.3 Exigences d'accessibilité
 Support des technologies d'assistance
 Navigation clavier complète
 Contrastes de couleurs conformes WCAG 2.1
 Tailles de police ajustables
 Sous-titres pour les contenus vidéo
 10.4 Contraintes légales et réglementaires
 Conformité à la réglementation camerounaise sur les données
 Respect des droits d'auteur pour les contenus
 Politique de confidentialité claire
 Conditions générales d'utilisation
 Déclaration à la CNIL si applicable
 11. PLANNING ET LIVRABLES
 11.1 Phases du projet
 Phase 1 : Analyse et conception (4 semaines)
 Semaine 1-2 : Analyse détaillée des besoins
 Semaine 3-4 : Conception UI/UX et architecture technique
 Livrables : Maquettes, Architecture technique, Spécifications détaillées
 Phase 2 : Développement MVP (8 semaines)
 Semaine 1-2 : Configuration environnement et authentification
 Semaine 3-4 : Module leçons et dictionnaire
 Semaine 5-6 : Module jeux et évaluation
 Semaine 7-8 : Intégration paiement et tests
Livrables : Application MVP fonctionnelle
 Phase 3 : Développement avancé (6 semaines)
 Semaine 1-2 : Module communauté et chat
 Semaine 3-4 : Intégration IA et reconnaissance vocale
 Semaine 5-6 : Dashboard administrateur et analytics
 Livrables : Version complète Beta
 Phase 4 : Tests et déploiement (4 semaines)
 Semaine 1-2 : Tests utilisateurs et corrections
 Semaine 3 : Préparation déploiement stores
 Semaine 4 : Lancement et formation
 Livrables : Application production, Documentation
 11.2 Jalons critiques
 J+28 : Validation des maquettes
 J+56 : MVP prêt pour tests internes
 J+98 : Version Beta disponible
 J+126 : Lancement officiel
 11.3 Livrables finaux
 Code source complet avec documentation
 Applications mobiles déployées sur les stores
 Documentation technique complète
 Manuel utilisateur multilingue
 Formation équipe client
 Maintenance 3 mois incluse
 12. BUDGET PRÉVISIONNEL
 12.1 Coûts de développement
 12.1.1 Ressources humaines (22 semaines)
 Chef de projet : 15 000 000 FCFA
Développeur Flutter Senior : 20 000 000 FCFA
 Développeur Backend/Firebase : 18 000 000 FCFA
 Designer UX/UI : 12 000 000 FCFA
 Testeur QA : 8 000 000 FCFA
 Intégrateur IA : 10 000 000 FCFA
 Sous-total développement : 83 000 000 FCFA
 12.1.2 Licences et services
 Firebase : 2 000 000 FCFA/an
 Licences outils développement : 1 500 000 FCFA
 Services IA (GPT/Claude) : 3 000 000 FCFA/an
 Stores (Apple/Google) : 200 000 FCFA
 Domaine et SSL : 150 000 FCFA
 Sous-total licences : 6 850 000 FCFA
 12.1.3 Infrastructure et hébergement
 Serveurs de production : 2 400 000 FCFA/an
 CDN pour médias : 1 200 000 FCFA/an
 Monitoring et analytics : 800 000 FCFA/an
 Backup et sécurité : 600 000 FCFA/an
 Sous-total infrastructure : 5 000 000 FCFA
 12.2 Budget total
 12.2.1 Première année
 Développement : 83 000 000 FCFA
 Licences et services : 6 850 000 FCFA
 Infrastructure : 5 000 000 FCFA
 Marketing et lancement : 8 000 000 FCFA
 Formation et support : 3 000 000 FCFA
 Contingence (10%) : 10 585 000 FCFA
 TOTAL PREMIÈRE ANNÉE : 116 435 000 FCFA
12.2.2 Années suivantes (maintenance)
 Maintenance et évolutions : 25 000 000 FCFA/an
 Licences récurrentes : 6 000 000 FCFA/an
 Infrastructure : 5 000 000 FCFA/an
 Support utilisateurs : 4 000 000 FCFA/an
 TOTAL RÉCURRENT : 40 000 000 FCFA/an
 12.3 Retour sur investissement prévisionnel
 12.3.1 Projections utilisateurs
 Année 1 : 1 000 utilisateurs premium
 Année 2 : 5 000 utilisateurs premium
 Année 3 : 15 000 utilisateurs premium
 12.3.2 Revenus prévisionnels
 Année 1 : 30 000 000 FCFA
 Année 2 : 150 000 000 FCFA
 Année 3 : 450 000 000 FCFA
 ROI attendu : Break-even à 18 mois
 CONCLUSION
 Ce cahier des charges définit les spécifications complètes pour le développement d'une application
 mobile innovante d'apprentissage des langues traditionnelles camerounaises. Le projet s'appuie sur
 des technologies modernes (Flutter, Firebase, IA) et une architecture MVVM robuste pour offrir une
 expérience utilisateur exceptionnelle.
 L'application répond à un besoin réel de préservation culturelle tout en exploitant les opportunités du
 marché de l'e-learning mobile en Afrique. Le modèle économique freemium, couplé à l'intégration de
 solutions de paiement locales (CamPay/NouPai), assure une viabilité commerciale à long terme.
 Le planning en 4 phases sur 22 semaines permet un développement itératif et une validation continue
 avec les utilisateurs finaux. L'investissement initial de 116 millions FCFA est justifié par un potentiel de
 marché important et un retour sur investissement attendu dès la deuxième année.
Document approuvé par :
 Chef de projet : [Nom] - [Date] - [Signature]
 Client : [Nom] - [Date] - [Signature]
 Équipe technique : [Nom] - [Date] - [Signature]
 Ce document est confidentiel et propriétaire. Toute reproduction ou diffusion sans autorisation est
 interdite.





ANALYSE DES ACTEURS ET PERMISSIONS
 Acteurs Principaux Identifiés
 1. 
�
�
 VISITEUR (Non-authentifié)
 ✅
 Consultation des offres/tarifs
 ✅
 Accès contenu démo
 ✅
 Parcours des langues disponibles
 ✅
 Création de compte
 ✅
 Témoignages et avis
 2. 
�
�
 APPRENANT (Utilisateur authentifié)
 Hérite des permissions Visiteur +
 ✅
 Authentification multi-provider
 ✅
 Dashboard personnalisé
 ✅
 Gestion profil utilisateur
 ✅
 Sélection langues d'apprentissage
 ✅
 Chat communautaire
 │   │   ├── app_theme.dart │   │   ├── app_theme.dart
 │   │   ├── light_theme.dart │   │   ├── light_theme.dart
 │   │   ├── dark_theme.dart │   │   ├── dark_theme.dart
 │   │   ├── colors.dart │   │   ├── colors.dart
 │   │   ├── text_styles.dart │   │   ├── text_styles.dart
 │   │   └── dimensions.dart │   │   └── dimensions.dart
 │   ├── providers/ │   ├── providers/
 │   │   ├── theme_provider.dart │   │   ├── theme_provider.dart
 │   │   ├── language_provider.dart │   │   ├── language_provider.dart
 │   │   ├── connectivity_provider.dart │   │   ├── connectivity_provider.dart
 │   │   └── user_provider.dart │   │   └── user_provider.dart
 │   └── mixins/ │   └── mixins/
 │       ├── validation_mixin.dart │       ├── validation_mixin.dart
 │       ├── loading_mixin.dart │       ├── loading_mixin.dart
 │       ├── error_handling_mixin.dart │       ├── error_handling_mixin.dart
 │       └── analytics_mixin.dart │       └── analytics_mixin.dart
 │ │
 └── main.dart                       # Point d'entrée └── main.dart                       # Point d'entrée
✅
 Commentaires et avis
 ✅
 Tests de niveau adaptatifs
 ✅
 Conversation IA
 ✅
 Historique résultats
 ✅
 Traduction intégrée
 ✅
 Contenus pédagogiques premium
 ✅
 Évaluations et certifications
 ✅
 Notifications push
 ✅
 Exercices interactifs
 ✅
 Quizz et jeux
 ✅
 Leçons structurées
 ✅
 Suivi progression
 3. 
�
�‍🏫
 ENSEIGNANT (Rôle spécialisé)
 Hérite des permissions Apprenant +
 ✅
 Création/gestion leçons
 ✅
 Développement exercices
 ✅
 Conception quizz
 ✅
 Dashboard apprenants
 ✅
 Organisation évaluations
 ✅
 Contenus interactifs multimédia
 ✅
 Suivi progression individuelle
 ✅
 Rapports de performance
 ✅
 Validation certifications
 4. 
�
�‍💻
 ADMINISTRATEUR (Accès total)
 Permissions système complètes
 ✅
 Maintenance technique
 ✅
 Gestion utilisateurs globale
 ✅
 Modération contenus
 ✅
 Configuration plateforme
✅
 Analytics et statistiques
 ✅
 Gestion paiements/abonnements
 ✅
 Supervision qualité
 ✅
 Administration rôles/permissions
 Acteurs Secondaires
 🔐
 API DE PAIEMENT
 CamPay Core (Principal)
 NouPai (Fallback)
 Mobile Money (MTN, Orange)
 Cartes bancaires (stripe)
 🤖
 MODÈLE IA
 Conversation NLP
 Correction prononciation
 Recommandations personnalisées
 Assistance contextuelle
 📨
 SERVICE MESSAGERIE
 Notifications push Firebase
 Messages système
 Communications inter-utilisateurs
 Alertes progression
 📋
 TODO LIST COMPLÈTE PAR PHASE
 🚀
 PHASE 1: SETUP & FONDATIONS (Semaines 1-2)
 ⚙
 Configuration Projet
 Setup Firebase projet (Auth, Firestore, Storage, Functions, Analytics)
 Configuration CI/CD (GitHub Actions/GitLab CI)
 Setup environnements (dev, staging, prod)
 Configuration lint rules et analyse statique
 Setup gestion d'état (Provider/Riverpod)
 Configuration Go Router pour navigation
 🎨
 Design System & Théming
 Créer système de couleurs (mode sombre/clair)
 Définir typographie adaptée (support caractères locaux)
 Créer composants UI réutilisables (buttons, inputs, cards)
 Setup animations et transitions
 Créer iconographie et assets
 Design responsive pour différentes tailles écrans
 🔐
 Core Services
 CRITIQUE: Service Firebase (initialisation et configuration)
 Service stockage local (Hive/SharedPreferences


 my firebase web credentail (
Your project
Project name
Firebase app
Project ID 
studio-6750997720-7c22e
Project number 
853678151393
Web API Key 
AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0
Environment
This setting customizes your project for different stages of the app lifecycle
Environment type
Production
Public settings
These settings control instances of your project shown to the public
Public-facing name 
project-853678151393
Support email 
yvangodimomo@gmail.com
Your apps
Android apps
Ma’a yegue Android
com.Ma’a yegue.app
Apple apps
Ma’a yegue iOS
com.Ma’a yegue.app
Web apps
Firebase app
Web App
App nickname
Firebase app
App ID 
1:853678151393:web:40332d5cd4cedb029cc9a0
Linked Firebase Hosting site
studio-6750997720-7c22e

SDK setup and configuration

npm

CDN

Config
If you're already using npm and a module bundler such as webpack or Rollup, you can run the following command to install the latest SDK (Learn more):

npm install firebase
Then, initialize Firebase and begin using the SDKs for the products you'd like to use.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe4_2NdHl3zvkukTg18WRTiZC7RecMRw0",
  authDomain: "studio-6750997720-7c22e.firebaseapp.com",
  projectId: "studio-6750997720-7c22e",
  storageBucket: "studio-6750997720-7c22e.firebasestorage.app",
  messagingSenderId: "853678151393",
  appId: "1:853678151393:web:40332d5cd4cedb029cc9a0",
  measurementId: "G-F60NV25RDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
Note: This option uses the modular JavaScript SDK, which provides reduced SDK size.

Learn more about Firebase for web: Get Started, Web SDK API Reference, Samples

)


 