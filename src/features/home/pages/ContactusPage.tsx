import { FormEvent, useState } from 'react';

export default function ContactusPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In V1, we just display success. Hook to backend/email provider later.
    setSent(true);
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
              <button type="submit" className="btn-primary">Envoyer</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


