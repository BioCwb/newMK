
import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { ref, onValue, push, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface GalleryImage {
  id: string;
  url: string;
  storagePath: string;
  name: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessionStart] = useState(Date.now());
  const [timeLoggedIn, setTimeLoggedIn] = useState('0s');
  
  useEffect(() => {
    if (!isAuthenticated) return;

    const galleryRef = ref(db, 'gallery');
    const unsubscribeGallery = onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      const loadedImages: GalleryImage[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setImages(loadedImages.reverse());
    });
    
    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - sessionStart) / 1000);
      setTimeLoggedIn(`${seconds}s`);
    }, 1000);

    return () => {
      unsubscribeGallery();
      clearInterval(timer);
    };
  }, [isAuthenticated, sessionStart]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Hardcoded password for demo purposes
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    window.location.hash = '#home';
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      setIsUploading(true);
      const file = selectedFile;
      const imageStorageRef = storageRef(storage, `gallery/${Date.now()}_${file.name}`);
      uploadBytes(imageStorageRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(url => {
          const galleryDbRef = ref(db, 'gallery');
          push(galleryDbRef, { url, storagePath: imageStorageRef.fullPath, name: file.name });
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
    const imageStorageRef = storageRef(storage, image.storagePath);
    deleteObject(imageStorageRef)
      .then(() => {
        const imageDbRef = ref(db, `gallery/${image.id}`);
        remove(imageDbRef);
      })
      .catch(error => {
        console.error("Error deleting image:", error)
        // If file doesn't exist in storage, still remove from DB
        if ((error as any).code === 'storage/object-not-found') {
             const imageDbRef = ref(db, `gallery/${image.id}`);
             remove(imageDbRef);
        }
      });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-100 min-h-full flex items-center justify-center py-12">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">Admin Login</h1>
          <p className="text-center text-slate-500 mb-8">Metais MK</p>
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 w-full font-medium rounded-lg text-sm px-5 py-3 text-center">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">Admin Panel</h1>
          <div className="mt-4 flex flex-col items-center space-y-2">
             <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Logout
             </button>
             <p className="text-sm text-slate-500">Logged in as: <span className="font-semibold">fabioteckster@gmail.com</span></p>
             <p className="text-xs text-slate-400">Logged in for: {timeLoggedIn}</p>
          </div>
        </div>

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
    </div>
  );
};

export default AdminPage;
