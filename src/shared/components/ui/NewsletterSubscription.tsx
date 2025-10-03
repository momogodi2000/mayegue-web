import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { newsletterService } from '@/core/services/firebase/newsletter.service';
import { EmailVerificationModal } from './EmailVerificationModal';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);

    try {
      const result = await newsletterService.subscribe(email, 'website_footer', true);
      
      if (result.success) {
        if (result.requiresVerification) {
          setSubscribedEmail(email);
          setShowVerificationModal(true);
          setEmail('');
        } else {
          toast.success(result.message);
          setEmail('');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Une erreur s\'est produite. Veuillez réessayer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={subscribedEmail}
        type="newsletter"
        onVerificationSent={() => {
          toast.success('Email de vérification renvoyé avec succès');
        }}
      />
    </>
  );
}
