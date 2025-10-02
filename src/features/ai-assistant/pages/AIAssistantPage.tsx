import { useState, FormEvent } from 'react';
import { geminiService } from '@/core/services/ai/gemini.service';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: 'Bonjour! Je suis votre assistant IA. Comment puis-je vous aider à apprendre les langues camerounaises?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userMessage }]);
    
    setLoading(true);
    try {
      const response = await geminiService.sendMessage(userMessage);
      setMessages((m) => [...m, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages((m) => [...m, { role: 'ai', text: 'Désolé, une erreur est survenue. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="heading-2 mb-6">Assistant IA</h1>
        <div className="card min-h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2">
            <input 
              className="input flex-1" 
              placeholder="Posez une question..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
