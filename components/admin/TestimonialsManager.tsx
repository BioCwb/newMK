import React, { useState, useEffect } from 'react';
import { firestore, firebase } from '../../firebase'; // Import firebase for timestamp

interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  approved: boolean; // Approval status
  rating: number;
  createdAt: { // Firestore timestamp type
    seconds: number;
    nanoseconds: number;
  } | null;
}

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex space-x-1 text-yellow-400">
        {[...Array(5)].map((_, index) => (
            <i key={index} className={`fas fa-star text-sm ${index < rating ? 'text-yellow-400' : 'text-slate-300'}`}></i>
        ))}
    </div>
);

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  useEffect(() => {
    const testimonialsCollection = firestore.collection('testimonials').orderBy('createdAt', 'desc');
    
    const unsubscribe = testimonialsCollection.onSnapshot((snapshot) => {
      const loadedTestimonials = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      })) as Testimonial[];
      setTestimonials(loadedTestimonials);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text || rating === 0) return;
    
    try {
      const testimonialsCollection = firestore.collection('testimonials');
      await testimonialsCollection.add({ 
        name, 
        company, 
        text,
        rating, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        approved: true, // Auto-approve testimonials added by admin
      });
      
      setName('');
      setCompany('');
      setText('');
      setRating(0);
      setSuccessMessage('Testemunho adicionado e aprovado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error adding testimonial:", error);
    }
  };

  const handleApprove = async (testimonialId: string) => {
    try {
      const testimonialDoc = firestore.collection('testimonials').doc(testimonialId);
      await testimonialDoc.update({ approved: true });
      setSuccessMessage('Testemunho aprovado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error approving testimonial:", error);
    }
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsModalOpen(true);
  };
  
  const cancelDelete = () => {
    setIsModalOpen(false);
    setTestimonialToDelete(null);
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      const testimonialDoc = firestore.collection('testimonials').doc(testimonialToDelete.id);
      await testimonialDoc.delete();
      
      setSuccessMessage('Testemunho deletado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    } finally {
      setIsModalOpen(false);
      setTestimonialToDelete(null);
    }
  };

  return (
    <div>
      {successMessage && (
          <div className="fixed top-24 right-8 z-50 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-lg flex items-center" role="alert">
            <i className="fas fa-check-circle mr-3 text-lg"></i>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Adicionar Testemunho</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-600">Nome</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div>
              <label htmlFor="company" className="block mb-2 text-sm font-medium text-slate-600">Empresa (Opcional)</label>
              <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
          </div>
           <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-slate-600">Avaliação</label>
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                            <button
                                type="button"
                                key={starValue}
                                className={`text-2xl transition-colors duration-200 ${
                                    starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-slate-300'
                                }`}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                aria-label={`Avaliar com ${starValue} estrelas`}
                            >
                                <i className="fas fa-star"></i>
                            </button>
                        );
                    })}
                </div>
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
                    <div className="flex items-center space-x-4">
                        <p className="font-bold text-slate-800">{t.name} <span className="font-normal text-slate-500 text-sm">- {t.company}</span></p>
                        <StarRatingDisplay rating={t.rating || 0} />
                    </div>
                     <div className="mt-2">
                        {t.approved ? (
                            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Aprovado</span>
                        ) : (
                            <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pendente</span>
                        )}
                    </div>
                    <p className="text-slate-600 mt-2 italic">"{t.text}"</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    {!t.approved && (
                        <button onClick={() => handleApprove(t.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">
                            Aprovar
                        </button>
                    )}
                    <button onClick={() => handleDeleteClick(t)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">
                        Delete
                    </button>
                  </div>
              </div>
            </div>
          )) : (
            <p className="text-slate-500 text-center py-4">Nenhum testemunho enviado.</p>
          )}
        </div>
      </div>
      
      {isModalOpen && testimonialToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title-testimonial">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
              <h3 id="modal-title-testimonial" className="text-xl font-bold text-slate-800 mb-4">Confirmar Exclusão</h3>
              <p className="text-slate-600 mb-6">
                Tem certeza que deseja deletar o testemunho de "<span className="font-semibold">{testimonialToDelete.name}</span>"?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default TestimonialsManager;
