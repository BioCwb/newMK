import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../firebase';

interface GalleryImage {
  id: string;
  url: string;
  storagePath: string;
  name: string;
}

const GalleryManager: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const galleryRef = db.ref('gallery');
    const listener = galleryRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const loadedImages: GalleryImage[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setImages(loadedImages.reverse());
    });
    return () => galleryRef.off('value', listener);
  }, []);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      setIsUploading(true);
      const file = selectedFile;
      const imageStorageRef = storage.ref(`photo/${Date.now()}_${file.name}`);
      imageStorageRef.put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          const galleryDbRef = db.ref('gallery');
          galleryDbRef.push({ url, storagePath: imageStorageRef.fullPath, name: file.name });
        })
        .catch(error => console.error("Error uploading image:", error))
        .finally(() => {
            setIsUploading(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        });
    }
  };


  const handleDeleteImage = (image: GalleryImage) => {
    const imageStorageRef = storage.ref(image.storagePath);
    imageStorageRef.delete()
      .then(() => {
        db.ref(`gallery/${image.id}`).remove();
      })
      .catch(error => {
        console.error("Error deleting image:", error)
        if ((error as any).code === 'storage/object-not-found') {
             db.ref(`gallery/${image.id}`).remove();
        }
      });
  };

  return (
    <div>
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
           <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload Foto</h2>
           <div className="flex items-center space-x-4">
              <label htmlFor="file-upload" className="cursor-pointer bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-50 transition-colors">
                Escolher Arquivo
              </label>
              <input 
                id="file-upload" 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handleFileSelect} 
                disabled={isUploading}
              />
              <span className="text-slate-500 text-sm truncate">{selectedFile ? selectedFile.name : 'Nenhum arquivo escolhido'}</span>
              <button 
                onClick={handleUploadClick} 
                disabled={!selectedFile || isUploading}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
           </div>
           {isUploading && <div className="w-full bg-gray-200 rounded-full h-1 mt-4"><div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{width: '100%'}}></div></div>}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Uploaded Fotos</h2>
          <div className="space-y-4">
            {images.length > 0 ? images.map(image => (
              <div key={image.id} className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <img src={image.url} alt={image.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                <span className="text-slate-700 font-medium truncate flex-grow">{image.name}</span>
                <button onClick={() => handleDeleteImage(image)} className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md text-sm transition-colors">
                  Delete
                </button>
              </div>
            )) : (
              <p className="text-slate-500 text-center py-4">Nenhuma foto enviada.</p>
            )}
          </div>
        </div>
    </div>
  );
};

export default GalleryManager;