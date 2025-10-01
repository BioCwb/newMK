import React from 'react';

const testimonialsData = [
  {
    name: 'Fábio',
    company: 'Fabioteck',
    text: 'Um lugar espetacular, voltarei em breve!',
  },
  {
    name: 'David',
    company: 'Kooa',
    text: 'O melhor serviço de serralharia, excelência e garantia dos nossos serviços. Utilizamos aço inoxidável, aço carbono, latão e cobre.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 text-center mb-10">Testemunhos de Clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 p-8 rounded-lg shadow-md border border-slate-200 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:scale-[1.02]">
              <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl mb-4 shadow-lg mx-auto">
                 <i className="fas fa-quote-left"></i>
              </div>
              <p className="text-slate-600 mb-6 italic flex-grow">"{testimonial.text}"</p>
              <div>
                <h4 className="font-bold text-lg text-blue-700">{testimonial.name}</h4>
                <p className="text-sm text-slate-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
