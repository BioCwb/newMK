
import React, { useState } from 'react';
import { db } from '../firebase';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) {
      setError("Por favor, preencha os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    db.ref('testimonials').push({ name, company, text })
      .then(() => {
        setSuccess('Obrigado por seu testemunho! Ele foi enviado com sucesso.');
        setName('');
        setCompany('');
        setText('');
      })
      .catch(error => {
        console.error("Error submitting testimonial:", error);
        setError("Ocorreu um erro ao enviar seu testemunho. Tente novamente.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section id="contact" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Enviar Testemunho</h2>
          <p className="text-center text-slate-500 mb-8">Adoramos ouvir o que você tem a dizer!</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-600">Nome</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Seu nome" required />
            </div>
            <div className="mb-5">
              <label htmlFor="company" className="block mb-2 text-sm font-medium text-slate-600">Empresa (Opcional)</label>
              <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Sua empresa" />
            </div>
            <div className="mb-6">
              <label htmlFor="testimonial" className="block mb-2 text-sm font-medium text-slate-600">Testemunho</label>
              <textarea id="testimonial" value={text} onChange={e => setText(e.target.value)} rows={5} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Escreva seu testemunho aqui..." required></textarea>
            </div>
            
            {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-4 text-center">{success}</p>}
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}

            <button type="submit" disabled={submitting} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100">
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
