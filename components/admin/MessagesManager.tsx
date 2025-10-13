import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue, remove } from 'firebase/database';

interface Message {
  id: string;
  name: string;
  email: string;
  company?: string;
  text: string;
  createdAt: number;
}

const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: Message[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      loadedMessages.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(loadedMessages);
      setLoading(false);
    }, (error) => {
        console.error("Firebase read failed:", error);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteClick = (message: Message) => {
    setMessageToDelete(message);
    setIsModalOpen(true);
  };
  
  const cancelDelete = () => {
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  const confirmDelete = () => {
    if (!messageToDelete) return;

    const messageRef = ref(database, `messages/${messageToDelete.id}`);
    remove(messageRef)
      .then(() => {
        setSuccessMessage('Mensagem deletada com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => console.error("Error deleting message:", error))
      .finally(() => {
        setIsModalOpen(false);
        setMessageToDelete(null);
      });
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-slate-500 text-center py-4">Carregando mensagens...</p>;
    }
    if (messages.length === 0) {
      return <p className="text-slate-500 text-center py-4">Nenhuma mensagem recebida.</p>;
    }
    return messages.map(msg => (
      <div key={msg.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <p className="font-bold text-slate-800">{msg.name}</p>
                {msg.company && <p className="font-normal text-slate-500 text-sm">{msg.company}</p>}
              </div>
              <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 hover:underline">{msg.email}</a>
              <p className="text-slate-600 mt-3 whitespace-pre-wrap">{msg.text}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
                <button onClick={() => handleDeleteClick(msg)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">
                  Delete
                </button>
                <p className="text-xs text-slate-400 mt-2">{new Date(msg.createdAt).toLocaleString('pt-BR')}</p>
            </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-lg flex items-center" role="alert">
          <i className="fas fa-check-circle mr-3 text-lg"></i>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mensagens Recebidas</h2>
        <div className="space-y-4">
          {renderContent()}
        </div>
      </div>
      
      {isModalOpen && messageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title-message">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <h3 id="modal-title-message" className="text-xl font-bold text-slate-800 mb-4">Confirmar Exclusão</h3>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja deletar a mensagem de "<span className="font-semibold">{messageToDelete.name}</span>"?
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

export default MessagesManager;