
import React from 'react';

const ContactForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here,
    // like sending the data to Firebase.
    alert('Obrigado por seu testemunho! Ele será revisado em breve.');
    (e.target as HTMLFormElement).reset();
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
              <input type="text" id="name" className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Seu nome" required />
            </div>
            <div className="mb-5">
              <label htmlFor="company" className="block mb-2 text-sm font-medium text-slate-600">Empresa (Opcional)</label>
              <input type="text" id="company" className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Sua empresa" />
            </div>
            <div className="mb-6">
              <label htmlFor="testimonial" className="block mb-2 text-sm font-medium text-slate-600">Testemunho</label>
              <textarea id="testimonial" rows={5} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300" placeholder="Escreva seu testemunho aqui..." required></textarea>
            </div>
            <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center transition-all duration-300 transform hover:scale-105">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;