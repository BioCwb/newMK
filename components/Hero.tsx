
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-[60vh] min-h-[400px] bg-cover bg-center text-white flex items-center justify-center" style={{ backgroundImage: "url('https://picsum.photos/1600/900?image=20')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Qualidade e Precisão em Metais</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">Projetos sob medida que transformam seus ambientes com elegância e durabilidade.</p>
        <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
          Faça um Orçamento
        </a>
      </div>
    </section>
  );
};

export default Hero;
