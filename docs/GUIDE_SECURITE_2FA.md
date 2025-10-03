# 🔐 Guide de Sécurité - Activation 2FA pour Administrateurs

## Vue d'Ensemble

La **Two-Factor Authentication (2FA)** ajoute une couche de sécurité supplémentaire en exigeant deux formes d'identification:
1. **Quelque chose que vous connaissez** - Mot de passe
2. **Quelque chose que vous possédez** - Téléphone mobile (code SMS)

**⚠️ OBLIGATOIRE pour tous les comptes administrateurs avant la production!**

---

## 📋 Prérequis

### 1. Firebase Configuration
- ✅ Authentification par téléphone activée dans Firebase Console
- ✅ reCAPTCHA configuré (Firebase le gère automatiquement)
- ✅ Numéros de téléphone de test configurés (pour sandbox)

### 2. Compte Administrateur
- ✅ Admin créé avec `npm run create-admin`
- ✅ Email vérifié
- ✅ Accès au téléphone mobile

---

## 🚀 Activation 2FA - Guide Pas à Pas

### Méthode 1: Via l'Interface Utilisateur (Recommandé)

#### Étape 1: Se Connecter en tant qu'Admin
```
1. Aller sur: https://votre-app.com/login
2. Se connecter avec:
   - Email: admin@maayegue.com
   - Password: [votre mot de passe]
```

#### Étape 2: Aller dans Paramètres de Sécurité
```
1. Cliquer sur votre profil (en haut à droite)
2. Sélectionner "Paramètres"
3. Aller dans l'onglet "Sécurité"
4. Section "Authentification à Deux Facteurs"
```

#### Étape 3: Activer 2FA
```
1. Cliquer sur "Activer la 2FA"
2. Entrer votre numéro de téléphone
   Format: +237XXXXXXXXX (avec indicatif pays)
   Exemple: +237690123456

3. Vérifier le reCAPTCHA
   (Cocher "Je ne suis pas un robot")

4. Cliquer sur "Envoyer le code"
   → Un SMS avec un code à 6 chiffres est envoyé
```

#### Étape 4: Vérifier le Code
```
1. Entrer le code reçu par SMS
2. Cliquer sur "Vérifier"
3. Confirmation: "2FA activée avec succès!"
```

#### Étape 5: Sauvegarder les Codes de Récupération
```
1. Télécharger les codes de récupération (backup)
2. Les stocker dans un endroit sûr
3. Ces codes permettent de se connecter si vous perdez votre téléphone
```

---

### Méthode 2: Via Firebase Console (Backup)

Si l'interface UI n'est pas encore prête:

#### Étape 1: Accéder à Firebase Console
```
https://console.firebase.google.com/project/studio-6750997720-7c22e/authentication/users
```

#### Étape 2: Trouver l'Utilisateur Admin
```
1. Chercher: admin@maayegue.com
2. Cliquer sur l'utilisateur
3. Aller dans l'onglet "Multi-factor authentication"
```

#### Étape 3: Ajouter un Numéro de Téléphone
```
1. Cliquer sur "Add phone number"
2. Entrer: +237XXXXXXXXX
3. Envoyer code de vérification
4. Entrer le code reçu
5. Sauvegarder
```

---

## 🔒 Processus de Connexion avec 2FA

### Flux Normal

```
┌─────────────────────────────────────┐
│  1. Utilisateur entre email/mdp     │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  2. Firebase vérifie credentials    │
└───────────────┬─────────────────────┘
                │
        ┌───────▼───────┐
        │  2FA activée? │
        └───┬───────┬───┘
           Non     Oui
            │       │
            │       ▼
            │  ┌─────────────────────┐
            │  │ 3. Demander code SMS│
            │  └──────────┬──────────┘
            │             │
            │             ▼
            │  ┌─────────────────────┐
            │  │ 4. Vérifier code    │
            │  └──────────┬──────────┘
            │             │
            └─────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  5. Accès autorisé   │
        └──────────────────────┘
```

### Exemple de Code (Implémentation)

**Composant de Connexion avec 2FA**:

```tsx
// LoginPage.tsx avec support 2FA
import { useState } from 'react';
import { authService } from '@/core/services/firebase/auth.service';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [mfaResolver, setMfaResolver] = useState(null);
  const [verificationId, setVerificationId] = useState('');

  // Étape 1: Connexion normale
  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authService.signInWithEmail(email, password);

      // Connexion réussie (pas de 2FA)
      navigate('/dashboard');

    } catch (error: any) {
      // Vérifier si c'est une erreur 2FA
      if (error.code === 'auth/multi-factor-auth-required') {
        // 2FA requise
        setMfaResolver(error.resolver);
        setStep('mfa');

        // Envoyer code SMS
        const verifier = await authService.setupRecaptcha('recaptcha');
        const vid = await authService.sendMFACode(error.resolver, verifier);
        setVerificationId(vid);

        toast.info('Code envoyé par SMS');
      } else {
        toast.error('Erreur de connexion');
      }
    }
  };

  // Étape 2: Vérification code 2FA
  const handleVerifyMFA = async (code: string) => {
    try {
      const user = await authService.verifyMFACode(
        mfaResolver,
        verificationId,
        code
      );

      toast.success('Connexion réussie!');
      navigate('/dashboard');

    } catch (error) {
      toast.error('Code invalide');
    }
  };

  return (
    <div className="login-page">
      {step === 'credentials' && (
        <CredentialsForm onSubmit={handleLogin} />
      )}

      {step === 'mfa' && (
        <MFACodeForm onSubmit={handleVerifyMFA} />
      )}

      <div id="recaptcha"></div>
    </div>
  );
}
```

---

## 🧪 Tests 2FA - Environnement Sandbox

### Configuration des Numéros de Test

Dans Firebase Console:

```
1. Aller dans: Authentication → Sign-in method → Phone
2. Section "Phone numbers for testing"
3. Ajouter:
   - Numéro: +237000000001
   - Code: 123456

4. Ce numéro ne recevra PAS de SMS réel
   mais acceptera toujours le code 123456
```

### Script de Test

```typescript
// test-2fa.ts
import { authService } from './auth.service';

async function test2FA() {
  try {
    // 1. Connexion normale
    console.log('1. Connexion avec email/password...');
    await authService.signInWithEmail('admin@maayegue.com', 'password');

    // 2. Activer 2FA
    console.log('2. Activation 2FA...');
    const verifier = await authService.setupRecaptcha('recaptcha');
    const verificationId = await authService.enrollPhoneMFA(
      '+237000000001', // Numéro de test
      verifier
    );

    // 3. Vérifier avec code de test
    console.log('3. Vérification code...');
    await authService.verifyPhoneMFA(verificationId, '123456');

    console.log('✅ 2FA activée avec succès!');

    // 4. Déconnexion
    await authService.signOut();

    // 5. Reconnexion avec 2FA
    console.log('4. Test connexion avec 2FA...');
    // ... (voir code complet ci-dessus)

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

test2FA();
```

---

## 🚨 Gestion des Codes de Récupération

### Génération des Codes de Récupération

```typescript
// generateRecoveryCodes.ts
import { randomBytes } from 'crypto';

function generateRecoveryCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    // Générer code de 8 caractères alphanumériques
    const code = randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }

  return codes;
}

// Exemple d'utilisation
const recoveryCodes = generateRecoveryCodes();
console.log('Codes de récupération:');
recoveryCodes.forEach((code, index) => {
  console.log(`${index + 1}. ${code}`);
});

// Sauvegarder dans Firestore
await db.collection('users').doc(userId).update({
  recoveryCodes: recoveryCodes.map(code => ({
    code,
    used: false,
    createdAt: Date.now()
  }))
});
```

### Utilisation d'un Code de Récupération

```typescript
async function signInWithRecoveryCode(email: string, recoveryCode: string) {
  // 1. Récupérer utilisateur par email
  const userDoc = await db.collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userDoc.empty) {
    throw new Error('Utilisateur non trouvé');
  }

  const userData = userDoc.docs[0].data();
  const userId = userDoc.docs[0].id;

  // 2. Vérifier code de récupération
  const validCode = userData.recoveryCodes?.find(
    (rc: any) => rc.code === recoveryCode && !rc.used
  );

  if (!validCode) {
    throw new Error('Code de récupération invalide ou déjà utilisé');
  }

  // 3. Marquer code comme utilisé
  const updatedCodes = userData.recoveryCodes.map((rc: any) =>
    rc.code === recoveryCode ? { ...rc, used: true, usedAt: Date.now() } : rc
  );

  await db.collection('users').doc(userId).update({
    recoveryCodes: updatedCodes
  });

  // 4. Créer token de session temporaire pour désactiver 2FA
  // ... (implémentation spécifique)

  return { success: true, message: 'Connecté avec code de récupération' };
}
```

---

## 🔧 Dépannage

### Problème 1: Code SMS Non Reçu

**Solutions**:
1. Vérifier le numéro de téléphone (format international)
2. Vérifier que le numéro peut recevoir des SMS
3. Attendre 1-2 minutes (délai réseau)
4. Demander un nouveau code
5. Utiliser un code de récupération si disponible

### Problème 2: Code Invalide

**Solutions**:
1. Vérifier que le code n'a pas expiré (valide 10 minutes)
2. Entrer exactement 6 chiffres
3. Ne pas ajouter d'espaces
4. Demander un nouveau code

### Problème 3: reCAPTCHA Ne S'affiche Pas

**Solutions**:
1. Vérifier que l'élément `<div id="recaptcha"></div>` existe
2. Vérifier le domaine dans Firebase Console → reCAPTCHA
3. Désactiver bloqueur de publicités
4. Essayer dans un autre navigateur

### Problème 4: Téléphone Perdu

**Solutions**:
1. Utiliser un code de récupération
2. Contacter support admin (autre admin)
3. Si aucune solution: Créer nouveau compte admin via script

---

## 📊 Monitoring et Logs

### Événements à Logger

```typescript
// Événements importants à enregistrer
const events = {
  '2FA_ENABLED': 'Utilisateur a activé la 2FA',
  '2FA_DISABLED': 'Utilisateur a désactivé la 2FA',
  '2FA_CODE_SENT': 'Code 2FA envoyé par SMS',
  '2FA_CODE_VERIFIED': 'Code 2FA vérifié avec succès',
  '2FA_CODE_FAILED': 'Échec vérification code 2FA',
  'RECOVERY_CODE_USED': 'Code de récupération utilisé',
  '2FA_BYPASS_ATTEMPT': 'Tentative de contournement 2FA',
};

// Logger dans Firestore
async function logSecurityEvent(userId: string, eventType: string, metadata: any) {
  await db.collection('security_logs').add({
    userId,
    eventType,
    metadata,
    timestamp: Date.now(),
    ip: metadata.ip,
    userAgent: metadata.userAgent
  });
}
```

### Alertes de Sécurité

```typescript
// Envoyer alerte si événement suspect
async function checkSuspiciousActivity(userId: string) {
  // Compter échecs 2FA dernières 15 minutes
  const recentFailures = await db.collection('security_logs')
    .where('userId', '==', userId)
    .where('eventType', '==', '2FA_CODE_FAILED')
    .where('timestamp', '>', Date.now() - 15 * 60 * 1000)
    .get();

  if (recentFailures.size >= 3) {
    // Envoyer alerte admin
    await sendAdminAlert({
      type: 'SUSPICIOUS_ACTIVITY',
      userId,
      message: `${recentFailures.size} échecs 2FA en 15 minutes`,
      action: 'REVIEW_ACCOUNT'
    });

    // Bloquer temporairement compte
    await db.collection('users').doc(userId).update({
      accountLocked: true,
      lockReason: 'Multiple failed 2FA attempts',
      lockedAt: Date.now()
    });
  }
}
```

---

## ✅ Checklist de Sécurité Avant Production

### Pour Chaque Compte Admin

- [ ] **2FA Activée**
  - [ ] Numéro de téléphone vérifié
  - [ ] Code de test validé
  - [ ] Codes de récupération générés et sauvegardés

- [ ] **Mot de Passe Fort**
  - [ ] Minimum 12 caractères
  - [ ] Majuscules + minuscules + chiffres + symboles
  - [ ] Différent des autres comptes
  - [ ] Stocké dans gestionnaire de mots de passe

- [ ] **Email Vérifié**
  - [ ] Adresse email professionnelle
  - [ ] Accès sécurisé (2FA sur email aussi)

- [ ] **Permissions Vérifiées**
  - [ ] Rôle = 'admin' dans Firestore
  - [ ] Permissions dans `admin_permissions` collection
  - [ ] Accès testé à toutes les fonctionnalités admin

- [ ] **Logging Activé**
  - [ ] Événements de connexion loggés
  - [ ] Actions admin auditées
  - [ ] Alertes de sécurité configurées

---

## 📞 Support

### En Cas de Problème

1. **Vérifier Documentation**: Ce guide
2. **Logs Firebase**: Console → Authentication → Logs
3. **Support Firebase**: https://firebase.google.com/support
4. **Email Dev**: dev@maayegue.com

### Contact d'Urgence

Si un admin est bloqué (téléphone perdu, codes de récupération perdus):

```bash
# Créer nouvel admin temporaire
npm run create-admin

# Puis désactiver 2FA de l'ancien compte via Firebase Console
# Authentication → Users → [Utilisateur] → Multi-factor → Disable
```

---

**✅ 2FA est OBLIGATOIRE pour tous les comptes admin en production!**

**🔒 La sécurité de votre application dépend de cette couche de protection.**

**Dernière mise à jour**: Janvier 2025
