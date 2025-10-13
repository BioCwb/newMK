import React, { useState } from 'react';
import { firestore, firebase } from '../firebase';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const messagesCollection = firestore.collection('messages');
      await messagesCollection.add({
        name,
        email,
        company,
        text: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      setSuccess('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch (err) {
      console.error("Error submitting message:", err);
      setError("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Entre em Contato</h2>
          <p className="text-center text-slate-500 mb-8">Tem alguma pergunta ou quer um orçamento?</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-600">Nome</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Seu nome" required />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-600">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="seu@email.com" required />
            </div>
            <div className="mb-5">
              <label htmlFor="company" className="block mb-2 text-sm font-medium text-slate-600">Empresa (Opcional)</label>
              <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Sua empresa" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-slate-600">Mensagem</label>
              <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Escreva sua mensagem aqui..." required></textarea>
            </div>
            
            {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-4 text-center">{success}</p>}
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}

            <button type="submit" disabled={submitting} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100">
              {submitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;