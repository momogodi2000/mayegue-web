import { FormEvent, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';
import toast from 'react-hot-toast';

export default function ContactusPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'contact_messages'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setSent(true);
      toast.success('Merci! Votre message a été envoyé.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.error("Impossible d'envoyer le message. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="heading-2 mb-6">Contactez-nous</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          Une question, une suggestion ou l'envie de collaborer? Écrivez-nous.
        </p>

        <div className="card">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-gray-700 dark:text-gray-300">Merci! Votre message a été envoyé.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input id="name" className="input" required value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input id="email" type="email" className="input" required value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea id="message" className="input min-h-[140px]" required value={message} onChange={(e)=>setMessage(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


