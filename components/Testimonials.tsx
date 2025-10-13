import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null; // Firestore timestamp type
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testimonialsCollection = firestore.collection('testimonials').orderBy('createdAt', 'desc');
    
    const unsubscribe = testimonialsCollection.onSnapshot((snapshot) => {
      const loadedTestimonials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];
      setTestimonials(loadedTestimonials);
      setLoading(false);
    }, (error) => {
        console.error("Firestore read failed:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderTestimonialsContent = () => {
    if (loading) {
      return <p className="col-span-full text-center text-slate-500">Carregando testemunhos...</p>;
    }
    if (testimonials.length === 0) {
      return <p className="col-span-full text-center text-slate-500">Ainda não há testemunhos para exibir.</p>;
    }
    return testimonials.map((testimonial) => (
      <div key={testimonial.id} className="bg-slate-50 p-8 rounded-lg shadow-md border border-slate-200 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:scale-[1.02]">
        <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl mb-4 shadow-lg mx-auto">
           <i className="fas fa-quote-left"></i>
        </div>
        <p className="text-slate-600 mb-6 italic flex-grow">"{testimonial.text}"</p>
        <div>
          <h4 className="font-bold text-lg text-blue-700">{testimonial.name}</h4>
          <p className="text-sm text-slate-500">{testimonial.company}</p>
        </div>
      </div>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 text-center mb-10">Testemunhos de Clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {renderTestimonialsContent()}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;