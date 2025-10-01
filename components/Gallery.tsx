import React, { useRef } from 'react';

const initialImages = [
  'https://picsum.photos/400/300?image=101',
  'https://picsum.photos/400/300?image=102',
  'https://picsum.photos/400/300?image=103',
  'https://picsum.photos/400/300?image=104',
  'https://picsum.photos/400/300?image=105',
  'https://picsum.photos/400/300?image=106',
];

const Gallery: React.FC = () => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (scrollOffset: number) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 text-center mb-2">Galeria de Fotos</h2>
        <p className="text-center text-slate-600 mb-10">Veja alguns dos nossos projetos concluídos.</p>
        <div className="relative">
          <button 
            onClick={() => scroll(-300)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-slate-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 opacity-75 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed -ml-4"
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div ref={scrollContainer} className="flex overflow-x-auto space-x-6 py-4 scrollbar-hide">
            {initialImages.map((src, index) => (
              <div key={index} className="flex-shrink-0 w-80 h-60 rounded-lg overflow-hidden shadow-lg group">
                <img 
                  src={src} 
                  alt={`Projeto ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scroll(300)} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-slate-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 opacity-75 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed -mr-4"
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
