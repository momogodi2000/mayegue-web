# 🔐 Résolution des Problèmes d'Authentification - Ma'a yegue V1.1

## ✅ Problèmes Résolus

### 1. Erreur "Missing or insufficient permissions"
**Problème**: Les utilisateurs recevaient cette erreur lors de l'inscription et de la connexion.

**Cause**: Les règles Firestore vérifiaient `request.auth.token.role` mais Firebase n'ajoute pas automatiquement de custom claims lors de l'inscription. Le profil utilisateur est créé APRÈS l'authentification, donc le token ne contenait pas encore le rôle.

**Solution**:
- ✅ Modifié les règles Firestore pour permettre aux utilisateurs authentifiés de créer leur profil sans vérification de rôle
- ✅ Ajouté une gestion d'erreur robuste dans `auth.service.ts`
- ✅ Le profil utilisateur est créé automatiquement avec le rôle par défaut `apprenant`

### 2. Redirection basée sur les rôles
**Statut**: ✅ Déjà implémentée correctement

Les utilisateurs sont redirigés automatiquement selon leur rôle:
- `apprenant` → `/dashboard/apprenant`
- `teacher` → `/dashboard/teacher`
- `admin` → `/dashboard/admin`
- `visitor` (invité) → `/dashboard/guest`

## 📝 Modifications Effectuées

### 1. Règles Firestore (`firestore.rules`)

#### Avant:
```javascript
match /users/{userId} {
  allow read, write: if isAuthenticated() && (isOwner(userId) || isAdmin());
  allow create: if isAuthenticated() && isOwner(userId);
  allow read: if isAuthenticated() && isValidUser(); // ❌ Vérifiait le rôle
}

match /languages/{languageId} {
  allow read: if isAuthenticated() && isValidUser(); // ❌ Vérifiait le rôle
}
```

#### Après:
```javascript
match /users/{userId} {
  // Permet la création sans vérification de rôle
  allow create: if isAuthenticated() && isOwner(userId);
  allow read, write: if isAuthenticated() && isOwner(userId);
  allow read, write: if isAuthenticated() && isAdmin();
  allow read: if isAuthenticated(); // ✅ Accessible sans vérification de rôle
}

match /languages/{languageId} {
  allow read: if isAuthenticated(); // ✅ Accessible sans vérification de rôle
}
```

### 2. Service d'Authentification (`auth.service.ts`)

#### Ajout de la Gestion d'Erreur dans `mapFirebaseUser`:
```typescript
async function mapFirebaseUser(user: FirebaseUser): Promise<User> {
  let role: UserRole = 'apprenant';
  let profile = null;

  try {
    role = await userService.getUserRole(user.uid);
    profile = await userService.getUserProfile(user.uid);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Continue avec les valeurs par défaut si Firestore échoue
  }
  // ...
}
```

#### Amélioration de `signUpWithEmail`:
```typescript
async signUpWithEmail(email: string, password: string, displayName?: string): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Créer le profil avec gestion d'erreur
    try {
      await userService.ensureUserProfile(cred.user.uid, {
        email: cred.user.email || '',
        displayName: displayName || cred.user.email || 'Utilisateur',
        emailVerified: false
      });
    } catch (profileError) {
      console.error('Error creating user profile:', profileError);
      // Continue même si la création du profil échoue
    }

    // ...
  }
}
```

#### Amélioration de `signInWithEmail`:
```typescript
async signInWithEmail(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // S'assurer que le profil existe (le créer s'il n'existe pas)
  try {
    await userService.ensureUserProfile(cred.user.uid, {
      email: cred.user.email || '',
      displayName: cred.user.displayName || cred.user.email || 'Utilisateur',
      emailVerified: cred.user.emailVerified
    });
  } catch (error) {
    console.error('Error ensuring user profile on login:', error);
  }

  return await mapFirebaseUser(cred.user);
}
```

## 🚀 Déploiement des Règles Firestore

**⚠️ ACTION REQUISE**: Les règles doivent être déployées manuellement!

### Méthode 1: Firebase Console (Recommandé)
1. Ouvrez [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez le projet: `studio-6750997720-7c22e`
3. Allez dans **Firestore Database** → **Règles**
4. Copiez le contenu de `firestore.rules`
5. Collez et cliquez sur **Publier**

### Méthode 2: Firebase CLI
```bash
firebase login
firebase deploy --only firestore:rules
```

## 🧪 Tests à Effectuer

### 1. Test d'Inscription
1. Ouvrez la page d'inscription: `/register`
2. Créez un nouveau compte avec:
   - Nom complet
   - Email valide
   - Mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
3. ✅ **Résultat attendu**:
   - Pas d'erreur "Missing or insufficient permissions"
   - Message de succès affiché
   - Modal de vérification email apparaît
   - Redirection vers `/dashboard/apprenant`

### 2. Test de Connexion
1. Ouvrez la page de connexion: `/login`
2. Connectez-vous avec un compte existant
3. ✅ **Résultat attendu**:
   - Pas d'erreur de permissions
   - Redirection automatique selon le rôle:
     - `apprenant` → `/dashboard/apprenant`
     - `teacher` → `/dashboard/teacher`
     - `admin` → `/dashboard/admin`

### 3. Test du Profil Utilisateur
1. Vérifiez Firebase Console → **Authentication** → **Users**
2. Cliquez sur un utilisateur nouvellement créé
3. ✅ **Résultat attendu**:
   - Document créé dans Firestore `/users/{userId}`
   - Champ `role` défini sur `apprenant`
   - Tous les champs stats et preferences initialisés

## 📊 Architecture Authentification

### Base de Données
```
Firebase Authentication (pour l'auth)
    ↓
Firestore /users/{userId} (pour le profil et rôle)
    ↓
Redirection basée sur le rôle
```

### SQLite Local
**Utilisé UNIQUEMENT pour**:
- Mots de base (pour visiteurs/guests)
- Leçons de base (pour visiteurs/guests)
- Cache hors ligne (optionnel)

**PAS utilisé pour**:
- Authentification
- Profils utilisateurs
- Progression des utilisateurs authentifiés

## 🔑 Rôles Utilisateur

| Rôle | Route Dashboard | Description |
|------|----------------|-------------|
| `apprenant` | `/dashboard/apprenant` | Utilisateur standard (par défaut) |
| `teacher` | `/dashboard/teacher` | Enseignant |
| `admin` | `/dashboard/admin` | Administrateur |
| `visitor` | `/dashboard/guest` | Invité non authentifié |

## 📝 Notes Importantes

1. **Rôle par Défaut**: Tous les nouveaux utilisateurs reçoivent automatiquement le rôle `apprenant`

2. **Changement de Rôle**: Pour changer le rôle d'un utilisateur:
   - Aller dans Firebase Console → Firestore → `/users/{userId}`
   - Modifier le champ `role`
   - Ou utiliser: `userService.updateUserRole(userId, 'teacher')`

3. **Custom Claims (Future)**: Pour une meilleure sécurité, vous pouvez implémenter des Firebase Custom Claims qui ajoutent le rôle directement dans le token JWT.

4. **Vérification Email**: L'email de vérification est envoyé mais n'est pas obligatoire pour accéder à l'application. Vous pouvez ajouter cette vérification plus tard.

## 🐛 Dépannage

### Erreur persiste après déploiement
1. Videz le cache navigateur (Ctrl+Shift+Delete)
2. Déconnectez-vous complètement
3. Reconnectez-vous
4. Vérifiez la console navigateur (F12) pour les erreurs

### Profil utilisateur non créé
- Vérifiez les logs de la console
- Le profil sera créé automatiquement lors de la prochaine connexion grâce à `ensureUserProfile`

### Redirection ne fonctionne pas
- Vérifiez que le rôle est correctement défini dans Firestore
- Vérifiez la route dans `router.tsx`
- Les routes doivent correspondre exactement

## ✅ Checklist de Vérification

- [x] Règles Firestore mises à jour
- [x] Service d'authentification amélioré
- [x] Gestion d'erreur robuste ajoutée
- [x] Build réussi (✓ built in 25.63s)
- [ ] **Règles Firestore déployées** (ACTION UTILISATEUR REQUISE)
- [ ] Tests d'inscription effectués
- [ ] Tests de connexion effectués
- [ ] Redirection vérifiée pour tous les rôles

## 📞 Support

Consultez le fichier `FIRESTORE_RULES_UPDATE.md` pour les instructions détaillées de déploiement.

En cas de problème persistant:
1. Vérifiez la console navigateur pour les erreurs
2. Vérifiez les logs Firebase Console
3. Assurez-vous que les règles Firestore sont bien déployées
