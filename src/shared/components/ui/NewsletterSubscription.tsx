import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const newsletterRef = collection(db, 'newsletter_subscriptions');
      const q = query(newsletterRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error('Cet email est déjà inscrit à notre newsletter');
        setLoading(false);
        return;
      }

      // Add to Firestore
      await addDoc(newsletterRef, {
        email: email.toLowerCase(),
        subscribedAt: Date.now(),
        status: 'active',
        source: 'website_footer',
        preferences: {
          frequency: 'weekly',
          categories: ['updates', 'news', 'promotions']
        }
      });

      toast.success('Merci ! Vous êtes maintenant inscrit à notre newsletter');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Une erreur s\'est produite. Veuillez réessayer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h3 className="text-xl font-bold text-white mb-2">
        Restez Informé
      </h3>
      <p className="text-gray-400 mb-4 text-sm">
        Inscrivez-vous à notre newsletter pour recevoir les dernières actualités, promotions et contenus exclusifs
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3">
        En vous inscrivant, vous acceptez de recevoir des emails de Ma'a yegue.
        Vous pouvez vous désabonner à tout moment.
      </p>
    </div>
  );
}
