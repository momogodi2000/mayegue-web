# 🔧 Mise à Jour des Règles Firestore - IMPORTANT

## ⚠️ Action Requise

Les règles de sécurité Firestore ont été mises à jour pour corriger les erreurs d'authentification. **Vous DEVEZ déployer ces règles manuellement** pour que l'authentification fonctionne correctement.

## 📋 Étapes de Déploiement

### Option 1: Firebase Console (Recommandé pour les débutants)

1. **Ouvrir Firebase Console**
   - Allez sur [https://console.firebase.google.com](https://console.firebase.google.com)
   - Sélectionnez votre projet: `studio-6750997720-7c22e`

2. **Accéder aux Règles Firestore**
   - Dans le menu latéral, cliquez sur **"Firestore Database"**
   - Cliquez sur l'onglet **"Règles"** (Rules)

3. **Copier les Nouvelles Règles**
   - Ouvrez le fichier `firestore.rules` à la racine du projet
   - Copiez tout le contenu

4. **Remplacer les Règles Existantes**
   - Collez le contenu dans l'éditeur Firebase Console
   - Cliquez sur **"Publier"** (Publish)

5. **Vérifier**
   - Vous devriez voir un message de succès
   - Les règles sont maintenant actives

### Option 2: Firebase CLI (Pour les développeurs)

1. **Se Connecter à Firebase**
   ```bash
   firebase login
   ```

2. **Déployer les Règles**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Vérifier le Déploiement**
   - Vous devriez voir: "✔ Deploy complete!"

## 🔑 Changements Principaux

Les règles ont été modifiées pour:

1. **Permettre la création de profil utilisateur** lors de l'inscription
   - Les nouveaux utilisateurs peuvent créer leur document dans `/users/{userId}`
   - Pas besoin d'avoir un rôle dans le token Firebase

2. **Permettre l'accès aux collections essentielles**
   - `/languages` - accessible par tous les utilisateurs authentifiés
   - `/lessons` - accessible par tous les utilisateurs authentifiés
   - Pas besoin de vérification de rôle initiale

3. **Permettre la lecture des profils utilisateurs**
   - Les utilisateurs peuvent lire leur propre profil
   - Les fonctionnalités communautaires fonctionnent correctement

## ✅ Test Après Déploiement

1. **Tester l'Inscription**
   - Créez un nouveau compte
   - Vérifiez qu'il n'y a pas d'erreur "Missing or insufficient permissions"
   - L'utilisateur devrait être redirigé vers `/dashboard/apprenant`

2. **Tester la Connexion**
   - Connectez-vous avec un compte existant
   - Vérifiez la redirection basée sur le rôle:
     - `apprenant` → `/dashboard/apprenant`
     - `teacher` → `/dashboard/teacher`
     - `admin` → `/dashboard/admin`

## 🐛 Résolution des Problèmes

### Erreur: "Failed to authenticate"
- Vous devez vous connecter avec Firebase CLI: `firebase login`

### Erreur: "Permission denied"
- Vérifiez que vous avez les droits d'accès au projet Firebase
- Assurez-vous d'être propriétaire ou éditeur du projet

### Les Règles ne S'Appliquent Pas
- Attendez 30-60 secondes après le déploiement
- Videz le cache du navigateur (Ctrl+Shift+Delete)
- Déconnectez-vous et reconnectez-vous

## 📝 Notes Importantes

- **SQLite Local**: Le SQLite local est utilisé UNIQUEMENT pour les mots/leçons de base pour les utilisateurs invités (visitors)
- **Firebase**: Tous les utilisateurs authentifiés (apprenant, teacher, admin) utilisent Firebase Firestore
- **Rôles par Défaut**: Les nouveaux utilisateurs reçoivent automatiquement le rôle `apprenant`
- **Redirection Automatique**: Après connexion, redirection automatique selon le rôle

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs de la console navigateur (F12 → Console)
2. Vérifiez les logs Firebase Console (Authentication → Users)
3. Consultez la documentation: [https://firebase.google.com/docs/firestore/security](https://firebase.google.com/docs/firestore/security)
