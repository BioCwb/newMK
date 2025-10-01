
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';

const App: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      const newIsAdmin = window.location.hash === '#admin';
      if (newIsAdmin !== showAdmin) {
        setShowAdmin(newIsAdmin);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [showAdmin]);

  return (
    <div className="bg-slate-50 text-slate-700 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {showAdmin ? (
          <AdminPage />
        ) : (
          <>
            <Hero />
            <About />
            <Gallery />
            <Testimonials />
            <ContactForm />
          </>
        )}
      </main>
      {!showAdmin && <Footer />}
    </div>
  );
};

export default App;
