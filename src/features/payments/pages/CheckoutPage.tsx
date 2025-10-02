import { useState, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { campayService } from '@/core/services/payment/campay.service';
import { analyticsService } from '@/core/services/firebase/analytics.service';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan || { name: 'Premium', amount: 2500 };
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      analyticsService.trackPaymentInitiated(plan.amount, 'XAF', plan.name);
      
      const payment = await campayService.initiatePayment({
        amount: plan.amount,
        currency: 'XAF',
        description: `Abonnement ${plan.name} - Ma’a yegue`,
        externalReference: `Ma’a yegue-${Date.now()}`,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
      });

      if (payment.ussdCode) {
        toast.success(`Composez ${payment.ussdCode} pour valider le paiement`);
      } else {
        toast.success('Paiement initié avec succès');
      }

      // Poll for payment status
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error: any) {
      toast.error(error?.message || 'Erreur de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="heading-2 mb-6">Finaliser le Paiement</h1>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-2">Récapitulatif</h3>
          <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
            <span>Plan {plan.name}</span>
            <span className="text-xl font-bold text-primary-600">{plan.amount.toLocaleString()} FCFA</span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Méthode de Paiement</h3>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéro de téléphone Mobile Money
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="237 6XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports MTN Mobile Money et Orange Money
              </p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1">
                Annuler
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Traitement...' : 'Payer maintenant'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>🔒 Paiement sécurisé via CamPay</p>
          </div>
        </div>
      </div>
    </div>
  );
}

