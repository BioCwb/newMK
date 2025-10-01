import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
}

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const testimonialsRef = db.ref('testimonials');
    const listener = testimonialsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const loadedTestimonials: Testimonial[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setTestimonials(loadedTestimonials.reverse());
    });
    return () => testimonialsRef.off('value', listener);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    
    db.ref('testimonials').push({ name, company, text })
      .then(() => {
        setName('');
        setCompany('');
        setText('');
        setSuccessMessage('Testemunho adicionado com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => console.error("Error adding testimonial:", error));
  };

  const handleDelete = (id: string) => {
    db.ref(`testimonials/${id}`).remove()
      .then(() => {
        setSuccessMessage('Testemunho deletado com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => console.error("Error deleting testimonial:", error));
  };

  return (
    <div>
      {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow" role="alert">
            <div className="flex items-center">
              <i className="fas fa-check-circle mr-3 text-green-600"></i>
              <span>{successMessage}</span>
            </div>
          </div>
        )}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Adicionar Testemunho</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-600">Nome</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
          </div>
          <div className="mb-4">
            <label htmlFor="company" className="block mb-2 text-sm font-medium text-slate-600">Empresa (Opcional)</label>
            <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
          </div>
          <div className="mb-4">
            <label htmlFor="text" className="block mb-2 text-sm font-medium text-slate-600">Testemunho</label>
            <textarea id="text" value={text} onChange={(e) => setText(e.target.value)} rows={4} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required></textarea>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Adicionar
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Testemunhos Enviados</h2>
        <div className="space-y-4">
          {testimonials.length > 0 ? testimonials.map(t => (
            <div key={t.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-800">{t.name} <span className="font-normal text-slate-500 text-sm">- {t.company}</span></p>
                    <p className="text-slate-600 mt-1 italic">"{t.text}"</p>
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="ml-4 flex-shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">
                    Delete
                  </button>
              </div>
            </div>
          )) : (
            <p className="text-slate-500 text-center py-4">Nenhum testemunho enviado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManager;