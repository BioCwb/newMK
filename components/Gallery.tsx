import React, { useRef, useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';

interface GalleryImage {
  id: string;
  url: string;
  name: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storage = getStorage(app);
    const listRef = ref(storage, 'photo/'); // Corresponds to GalleryManager upload path

    listAll(listRef)
      .then(async (res) => {
        const imagePromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { id: itemRef.name, url, name: itemRef.name };
        });
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages.reverse());
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Firebase Storage list failed:", error);
        setError("Não foi possível carregar a galeria. Tente novamente mais tarde.");
        setLoading(false);
      });
  }, []);

  const scroll = (scrollOffset: number) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  let galleryContent;

  if (loading) {
    galleryContent = (
      <div className="flex flex-col items-center justify-center h-60 text-slate-500">
        <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
        <p className="text-lg">Carregando galeria...</p>
      </div>
    );
  } else if (error) {
    galleryContent = (
      <div className="flex flex-col items-center justify-center h-60 text-red-500 bg-red-50 rounded-lg p-8 border border-red-200">
         <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
        <p className="text-lg font-semibold text-center">{error}</p>
      </div>
    );
  } else if (images.length === 0) {
    galleryContent = (
       <div className="flex flex-col items-center justify-center h-60 text-slate-500">
        <i className="fas fa-camera text-4xl mb-4"></i>
        <p className="text-lg">Nenhuma imagem na galeria ainda.</p>
      </div>
    );
  } else {
    galleryContent = (
      <div className="relative">
        <button 
          onClick={() => scroll(-300)} 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-slate-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 opacity-75 hover:opacity-100 -ml-4"
          aria-label="Scroll left"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div ref={scrollContainer} className="flex overflow-x-auto space-x-6 py-4 scrollbar-hide">
          {images.map((image, index) => (
            <div key={image.id} className="flex-shrink-0 w-80 h-60 rounded-lg overflow-hidden shadow-lg group">
              <img 
                src={image.url} 
                alt={image.name || `Projeto ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll(300)} 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-slate-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 opacity-75 hover:opacity-100 -mr-4"
          aria-label="Scroll right"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-slate-800 text-center mb-2">Galeria de Fotos</h2>
        <p className="text-center text-slate-600 mb-10">Veja alguns dos nossos projetos concluídos.</p>
        {galleryContent}
      </div>
    </section>
  );
};

export default Gallery;
