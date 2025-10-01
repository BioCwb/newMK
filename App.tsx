
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

  // Effect to listen for hash changes and update the route state
  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Effect to listen for authentication state changes from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Effect to handle routing guards and redirects based on auth state and route
  useEffect(() => {
    // Don't perform redirects until the initial auth check is complete
    if (loading) {
      return;
    }

    const isAdminRoute = route.startsWith('#/admin');
    const isLoginPage = route === '#/admin/login';

    // Guard 1: If a non-authenticated user tries to access a protected admin route, redirect to login.
    if (!user && isAdminRoute && !isLoginPage) {
        window.location.hash = '#/admin/login';
    }

    // Guard 2: If an authenticated user is on the login page, redirect them to the dashboard.
    if (user && isLoginPage) {
        window.location.hash = '#/admin/dashboard';
    }
  }, [user, route, loading]);
  
  const renderContent = () => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    const isAdminRoute = route.startsWith('#/admin');
    const isLoginPage = route === '#/admin/login';

    if (isAdminRoute) {
      if (isLoginPage) {
        // Only show login page if the user is not logged in.
        return user ? null : <LoginPage />;
      }
      // For any other admin route, show the dashboard if the user is logged in.
      return user ? <AdminDashboard route={route} /> : null;
    }

    // Default to showing the public site content
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