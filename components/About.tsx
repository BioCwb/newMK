
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-6">Metais MK</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-10"></div>
        <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
          É uma empresa que busca sempre a plena satisfação do cliente através da qualidade dos produtos, eficiência na produção, rapidez na entrega e excelente atendimento. Estamos empenhados em garantir que o seu projeto utilize produtos da mais alta qualidade. Entre em contato conosco e faça um orçamento.
        </p>
      </div>
    </section>
  );
};

export default About;
