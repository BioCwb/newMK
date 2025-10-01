
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import LoginPage from './components/admin/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import { auth, firebase } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      const currentHash = window.location.hash;
      const isAdminRoute = currentHash.startsWith('#/admin');
      const isLoginPage = currentHash === '#/admin/login';

      // Guard 1: Not logged in on a protected admin page -> redirect to login
      if (!currentUser && isAdminRoute && !isLoginPage) {
          window.location.hash = '#/admin/login';
      }

      // Guard 2: Logged in but on the login page -> redirect to dashboard
      if (currentUser && isLoginPage) {
          window.location.hash = '#/admin/dashboard';
      }
    });
    return () => unsubscribe();
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (route === '#/admin/login') {
      // Show login page only if not authenticated; otherwise, a redirect is in progress.
      return user ? null : <LoginPage />;
    }

    if (route.startsWith('#/admin')) {
      // Show dashboard only if authenticated; otherwise, a redirect is in progress.
      return user ? <AdminDashboard route={route} /> : null;
    }

    // Default to the public site content
    return (
      <>
        <main className="flex-grow">
          <Hero />
          <About />
          <Gallery />
          <Testimonials />
          <ContactForm />
        </main>
        <Footer />
      </>
    );
  };
  
  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen flex flex-col">
       <Header />
       {renderContent()}
    </div>
  );
};

export default App;