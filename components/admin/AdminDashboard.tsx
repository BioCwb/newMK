
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import GalleryManager from './GalleryManager';
import TestimonialsManager from './TestimonialsManager';
import MessagesManager from './MessagesManager';

interface AdminDashboardProps {
  route: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ route }) => {
  const [sessionStart] = useState(Date.now());
  const [timeLoggedIn, setTimeLoggedIn] = useState('0s');
  
  const handleLogout = () => {
    auth.signOut().then(() => {
      window.location.hash = '#home';
    }).catch((error) => {
      console.error('Logout Error:', error);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - sessionStart) / 1000);
      setTimeLoggedIn(`${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStart]);

  const renderAdminContent = () => {
    if (route.includes('gallery')) {
      return <GalleryManager />;
    }
    if (route.includes('testimonials')) {
      return <TestimonialsManager />;
    }
    if (route.includes('messages')) {
        return <MessagesManager />;
    }
    // Default to dashboard view
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Bem-vindo ao Painel de Administração</h2>
            <p className="text-slate-600">Use o menu à esquerda para gerenciar o conteúdo do seu site.</p>
             <div className="mt-6 border-t pt-6">
                 <h3 className="text-lg font-semibold text-slate-700">Informações da Sessão</h3>
                 <p className="text-sm text-slate-500 mt-2">Logado como: <span className="font-semibold">{auth.currentUser?.email}</span></p>
                 <p className="text-xs text-slate-400 mt-1">Tempo de sessão: {timeLoggedIn}</p>
             </div>
        </div>
    );
  };
  
  const getLinkClass = (path: string) => {
      const baseClass = "flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors";
      return route.includes(path) ? `${baseClass} bg-slate-900` : baseClass;
  }

  return (
    <div className="flex-grow bg-slate-100">
        <div className="flex flex-col md:flex-row min-h-screen">
            <aside className="w-full md:w-64 bg-slate-800 text-white p-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-center mb-8 border-b border-slate-700 pb-4">Admin</h1>
                <nav className="space-y-2">
                    <a href="#/admin/dashboard" className={getLinkClass('dashboard')}>
                        <i className="fas fa-tachometer-alt w-6 mr-3"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="#/admin/gallery" className={getLinkClass('gallery')}>
                        <i className="fas fa-images w-6 mr-3"></i>
                        <span>Gerenciar Galeria</span>
                    </a>
                    <a href="#/admin/testimonials" className={getLinkClass('testimonials')}>
                        <i className="fas fa-comment-dots w-6 mr-3"></i>
                        <span>Gerenciar Testemunhos</span>
                    </a>
                    <a href="#/admin/messages" className={getLinkClass('messages')}>
                        <i className="fas fa-envelope-open-text w-6 mr-3"></i>
                        <span>Mensagens</span>
                    </a>
                </nav>
                <div className="mt-auto pt-8">
                     <button onClick={handleLogout} className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        <span>Logout</span>
                     </button>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-10">
                {renderAdminContent()}
            </main>
        </div>
    </div>
  );
};

export default AdminDashboard;
