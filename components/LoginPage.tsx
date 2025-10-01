import React, { useState } from 'react';
import { auth } from '../firebase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Fix: Use v8 compat API for sign in to resolve missing export error.
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in 
        // The onAuthStateChanged listener in App.tsx will handle the redirect
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
          setError('Email ou senha inválidos.');
        } else {
          setError('Ocorreu um erro ao tentar fazer login.');
        }
        console.error(error);
      });
  };

  return (
    <div className="flex-grow bg-slate-100 flex items-center justify-center py-12">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">Admin Login</h1>
        <p className="text-center text-slate-500 mb-8">Metais MK</p>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-600">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              required 
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password"  className="block mb-2 text-sm font-medium text-slate-600">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              required 
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 w-full font-medium rounded-lg text-sm px-5 py-3 text-center">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;