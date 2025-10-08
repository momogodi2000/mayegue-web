import { FormEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';
import toast from 'react-hot-toast';
import { sqliteService } from '@/core/services/offline/sqlite.service';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function ContactusPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 1. Save to SQLite first (local-first approach)
      try {
        await sqliteService.initialize();
        const localId = await sqliteService.saveContactMessage({
          userId: user?.id ? parseInt(user.id) : undefined,
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          category: category || 'general',
          message: message.trim(),
          status: 'new',
          priority: category === 'support' ? 'high' : 'medium'
        });
        
        console.log('✅ Contact message saved locally with ID:', localId);
      } catch (localError) {
        console.error('⚠️ Failed to save locally:', localError);
        // Continue to Firebase save even if local save fails
      }

      // 2. Try to sync to Firebase immediately if online
      if (navigator.onLine) {
        try {
          const docRef = await addDoc(collection(db, 'contact_messages'), {
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            category: category || 'general',
            message: message.trim(),
            createdAt: serverTimestamp(),
            status: 'new',
            priority: category === 'support' ? 'high' : 'medium',
            userId: user?.id || null
          });
          
          console.log('✅ Contact message synced to Firebase:', docRef.id);
          toast.success('Merci! Votre message a été envoyé. Nous vous répondrons dans les 24h.');
        } catch (firebaseError) {
          console.error('⚠️ Failed to sync to Firebase:', firebaseError);
          toast.success('Message enregistré. Il sera envoyé automatiquement quand vous serez en ligne.');
        }
      } else {
        toast.success('Message enregistré. Il sera envoyé automatiquement quand vous serez en ligne.');
      }
      
      // Clear form
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setCategory('');
      setMessage('');
      
    } catch (err) {
      console.error('❌ Error submitting contact form:', err);
      toast.error("Impossible d'enregistrer le message. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Helmet>
        <title>Contactez Ma'a yegue - Support, Partenariats & Presse</title>
        <meta name="description" content="Contactez l'équipe Ma'a yegue pour le support technique, les partenariats, la presse ou toute question sur l'apprentissage des langues camerounaises." />
        <meta name="keywords" content="contact ma'a yegue, support technique, partenariats, presse, aide apprentissage langues camerounaises" />
        <meta name="author" content="Ma'a yegue" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/contact` : ''} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Contactez Ma'a yegue - Support, Partenariats & Presse" />
        <meta property="og:description" content="Contactez l'équipe Ma'a yegue pour le support technique, les partenariats, la presse ou toute question sur l'apprentissage des langues camerounaises." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/contact` : ''} />
        <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/assets/logo/logo.jpg`} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Ma'a yegue" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contactez Ma'a yegue - Support, Partenariats & Presse" />
        <meta name="twitter:description" content="Contactez l'équipe Ma'a yegue pour le support technique, les partenariats, la presse ou toute question sur l'apprentissage des langues camerounaises." />
        <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/assets/logo/logo.jpg`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: "Contact Ma'a yegue",
            description: "Contactez l'équipe Ma'a yegue pour le support technique, les partenariats, la presse ou toute question",
            url: typeof window !== 'undefined' ? `${window.location.origin}/contact` : '',
            mainEntity: {
              '@type': 'Organization',
              name: "Ma'a yegue",
              email: "contact@maayegue.app",
              url: "https://maayegue.app",
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Yaoundé',
                addressCountry: 'CM'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'contact@maayegue.app',
                availableLanguage: ['French', 'English']
              }
            }
          })}
        </script>
      </Helmet>
      <div className="container-custom max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <h1 className="heading-2 mb-2">Contactez-nous</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Une question, une suggestion ou l'envie de collaborer? Notre équipe est là pour vous aider. 
              Nous répondons généralement dans les 24 heures.
            </p>
            <div className="card">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-gray-700 dark:text-gray-300">Merci! Votre message a été envoyé.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet *
                  </label>
                  <input 
                    id="name" 
                    className="input" 
                    required 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input 
                    id="email" 
                    type="email" 
                    className="input" 
                    required 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <select 
                  id="category" 
                  className="input" 
                  value={category} 
                  onChange={(e)=>setCategory(e.target.value)}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="support">Support technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="press">Presse & Médias</option>
                  <option value="teaching">Devenir enseignant</option>
                  <option value="content">Contribution de contenu</option>
                  <option value="feedback">Suggestion & Feedback</option>
                  <option value="general">Question générale</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sujet
                </label>
                <input 
                  id="subject" 
                  className="input" 
                  value={subject} 
                  onChange={(e)=>setSubject(e.target.value)}
                  placeholder="Résumé de votre message"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea 
                  id="message" 
                  className="input min-h-[140px]" 
                  required 
                  value={message} 
                  onChange={(e)=>setMessage(e.target.value)}
                  placeholder="Décrivez votre question, suggestion ou demande en détail..."
                />
              </div>
              
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Informations de Contact</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-primary-600">📍</span>
                  <div>
                    <div className="font-medium">Adresse</div>
                    <div>Yaoundé, Cameroun</div>
                    <div className="text-gray-500">Centre-ville, Quartier Bastos</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600">✉️</span>
                  <div>
                    <div className="font-medium">Email</div>
                    <div>contact@maayegue.app</div>
                    <div className="text-gray-500">Réponse sous 24h</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600">🌐</span>
                  <div>
                    <div className="font-medium">Site Web</div>
                    <div>https://maayegue.app</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600">⏰</span>
                  <div>
                    <div className="font-medium">Horaires</div>
                    <div>Lun - Ven: 8h - 18h</div>
                    <div className="text-gray-500">Heure de Yaoundé (GMT+1)</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Types de Demandes</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">🛠️</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Support technique</div>
                    <div className="text-gray-600 dark:text-gray-400">Aide avec l'application</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">🤝</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Partenariats</div>
                    <div className="text-gray-600 dark:text-gray-400">Collaborations institutionnelles</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600">📰</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Presse & Médias</div>
                    <div className="text-gray-600 dark:text-gray-400">Interviews et communiqués</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600">👨‍🏫</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Enseignement</div>
                    <div className="text-gray-600 dark:text-gray-400">Devenir professeur</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">FAQ Rapide</h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600">
                    Comment réinitialiser mon mot de passe ?
                  </summary>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    Utilisez le lien "Mot de passe oublié" sur la page de connexion.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600">
                    Comment devenir enseignant ?
                  </summary>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    Contactez-nous avec votre CV et vos langues de spécialité.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600">
                    L'application fonctionne-t-elle hors ligne ?
                  </summary>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    Oui, vous pouvez télécharger du contenu pour l'utiliser sans connexion.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600">
                    Comment contribuer au contenu ?
                  </summary>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    Contactez-nous pour proposer des leçons ou des corrections.
                  </p>
                </details>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                <a href="https://twitter.com/maayegue" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  <span className="text-xl">🐦</span>
                  <span>Twitter</span>
                </a>
                <a href="https://facebook.com/maayegue" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  <span className="text-xl">📘</span>
                  <span>Facebook</span>
                </a>
                <a href="https://youtube.com/maayegue" className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  <span className="text-xl">📺</span>
                  <span>YouTube</span>
                </a>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Restez informé des dernières actualités et fonctionnalités
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


