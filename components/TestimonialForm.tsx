import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from "firebase/database";

const TestimonialForm: React.FC = () => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) {
      setError("Por favor, preencha seu nome e a mensagem do testemunho.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const testimonialsRef = ref(database, 'testimonials');
      await push(testimonialsRef, {
        name,
        company,
        text,
      });

      setSuccess('Seu testemunho foi enviado com sucesso! Obrigado pela sua contribuição.');
      setName('');
      setCompany('');
      setText('');
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setError("Ocorreu um erro ao enviar seu testemunho. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="leave-testimonial" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto bg-slate-50 p-8 md:p-12 rounded-xl shadow-lg border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">Deixe seu Depoimento</h2>
          <p className="text-center text-slate-500 mb-8">Adoramos ouvir de nossos clientes!</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="testimonial-name" className="block mb-2 text-sm font-medium text-slate-600">Nome</label>
              <input type="text" id="testimonial-name" value={name} onChange={e => setName(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Seu nome" required />
            </div>
            <div className="mb-5">
              <label htmlFor="testimonial-company" className="block mb-2 text-sm font-medium text-slate-600">Empresa (Opcional)</label>
              <input type="text" id="testimonial-company" value={company} onChange={e => setCompany(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Sua empresa" />
            </div>
            <div className="mb-6">
              <label htmlFor="testimonial-text" className="block mb-2 text-sm font-medium text-slate-600">Sua Mensagem</label>
              <textarea id="testimonial-text" value={text} onChange={e => setText(e.target.value)} rows={5} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Escreva seu testemunho aqui..." required></textarea>
            </div>
            
            {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm mb-4 text-center">{success}</p>}
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}

            <button type="submit" disabled={submitting} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100">
              {submitting ? 'Enviando...' : 'Enviar Depoimento'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TestimonialForm;