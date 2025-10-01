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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const galleryRef = db.ref('gallery');
    const listener = galleryRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const loadedImages: GalleryImage[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setImages(loadedImages.reverse());
    });
    return () => galleryRef.off('value', listener);
  }, []);

  // Effect to clean up the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCancelSelection = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedFile(null);
    setImagePreview(null);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clean up previous preview before creating a new one
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setUploadError(null);
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Formato de arquivo inválido. Por favor, selecione um arquivo de imagem (ex: JPEG, PNG).');
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create preview URL
    } else {
        setSelectedFile(null);
        setImagePreview(null);
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) return;

    setUploadError(null);
    setSuccessMessage('');
    setIsUploading(true);
    setUploadProgress(0);
    const file = selectedFile;
    const storagePath = `photo/${Date.now()}_${file.name}`;
    const imageStorageRef = storage.ref(storagePath);
    const uploadTask = imageStorageRef.put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
        setUploadError(`Falha no upload: ${error.message}`);
        setIsUploading(false);
        // Do not reset selection, allow user to retry
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          const galleryDbRef = db.ref('gallery');
          galleryDbRef.push({
            url: downloadURL,
            storagePath: storagePath,
            name: file.name
          }).then(() => {
              setSuccessMessage('Foto enviada com sucesso!');
              setTimeout(() => setSuccessMessage(''), 3000);
              setIsUploading(false);
              handleCancelSelection(); // Reset form on success
          }).catch((dbError) => {
              console.error("Error saving to database:", dbError);
              setUploadError(`Falha ao salvar no banco de dados: ${dbError.message}`);
              setIsUploading(false);
          });
        }).catch((urlError) => {
            console.error("Error getting download URL:", urlError);
            setUploadError(`Falha ao obter URL da imagem: ${urlError.message}`);
            setIsUploading(false);
        });
      }
    );
  };

  const handleDeleteClick = (image: GalleryImage) => {
    setImageToDelete(image);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!imageToDelete) return;
    
    setSuccessMessage('');
    const image = imageToDelete;

    const removeDbEntry = () => {
      db.ref(`gallery/${image.id}`).remove()
        .then(() => {
          setSuccessMessage('Foto deletada com sucesso!');
          setTimeout(() => setSuccessMessage(''), 3000);
        })
        .catch(dbError => {
          console.error("Error deleting DB entry:", dbError);
          setUploadError('Falha ao deletar a referência da foto.');
        });
    };

    const imageStorageRef = storage.ref(image.storagePath);
    imageStorageRef.delete()
      .then(() => {
        removeDbEntry();
      })
      .catch(error => {
        console.error("Error deleting image from storage:", error);
        if ((error as any).code === 'storage/object-not-found') {
          console.warn("Image not found in storage, deleting from DB anyway.");
          removeDbEntry(); // Remove DB entry even if storage file is missing
        } else {
          setUploadError('Falha ao deletar o arquivo da foto.');
        }
      })
      .finally(() => {
        setIsModalOpen(false);
        setImageToDelete(null);
      });
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setImageToDelete(null);
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
           <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload Foto</h2>
           
           {!imagePreview ? (
              <div>
                <label htmlFor="file-upload" className="relative block w-full border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-2"></i>
                    <span className="font-semibold text-slate-600">Escolher uma imagem</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, GIF, etc.</span>
                  </div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    ref={fileInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                    disabled={isUploading}
                  />
                </label>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <p className="font-semibold text-slate-700 mb-2">Pré-visualização:</p>
                  <div className="relative inline-block border border-slate-200 rounded-lg p-2 shadow-sm bg-slate-50">
                    <img src={imagePreview} alt="Pré-visualização" className="w-auto h-auto object-contain rounded-md max-h-60" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm truncate mb-4" title={selectedFile?.name}>{selectedFile?.name}</p>
                <div className="flex justify-center items-center space-x-4">
                  <button 
                    onClick={handleCancelSelection}
                    disabled={isUploading}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleUploadClick} 
                    disabled={!selectedFile || isUploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    {isUploading ? `Enviando ${Math.round(uploadProgress)}%...` : 'Confirmar e Enviar'}
                  </button>
                </div>
              </div>
            )}

           {uploadError && (
             <p className="text-red-500 text-sm mt-4 text-center">{uploadError}</p>
           )}
           {isUploading && (
             <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-150" style={{width: `${uploadProgress}%`}}></div>
             </div>
           )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Uploaded Fotos</h2>
          <div className="space-y-4">
            {images.length > 0 ? images.map(image => (
              <div key={image.id} className="flex items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <img src={image.url} alt={image.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                <span className="text-slate-700 font-medium truncate flex-grow">{image.name}</span>
                <button onClick={() => handleDeleteClick(image)} className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md text-sm transition-colors">
                  Delete
                </button>
              </div>
            )) : (
              <p className="text-slate-500 text-center py-4">Nenhuma foto enviada.</p>
            )}
          </div>
        </div>

        {isModalOpen && imageToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
              <h3 id="modal-title" className="text-xl font-bold text-slate-800 mb-4">Confirmar Exclusão</h3>
              <p className="text-slate-600 mb-6">
                Tem certeza que deseja deletar a imagem "<span className="font-semibold">{imageToDelete.name}</span>"? Essa ação não pode ser desfeita.
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

export default GalleryManager;