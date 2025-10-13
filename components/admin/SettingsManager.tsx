import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';

const SettingsManager: React.FC = () => {
  const [operatingHours, setOperatingHours] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const docRef = firestore.collection('settings').doc('businessInfo');
    
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setOperatingHours(doc.data()?.operatingHours || '');
      }
       setLoading(false);
    }, (err) => {
      console.error("Error fetching settings:", err);
      setError("Não foi possível carregar as configurações.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      const docRef = firestore.collection('settings').doc('businessInfo');
      // Use set with merge to create the document if it doesn't exist
      await docRef.set({ operatingHours }, { merge: true });
      setSuccessMessage('Horário de atendimento salvo com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <p className="text-slate-500">Carregando configurações...</p>
        </div>
    );
  }

  return (
    <div>
      {successMessage && (
        <div className="fixed top-24 right-8 z-50 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-lg flex items-center" role="alert">
          <i className="fas fa-check-circle mr-3 text-lg"></i>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurações Gerais</h2>
        <form onSubmit={handleSave}>
          <div className="mb-6">
            <label htmlFor="operatingHours" className="block mb-2 text-sm font-medium text-slate-600">Horário de Atendimento</label>
            <input 
              type="text" 
              id="operatingHours" 
              value={operatingHours} 
              onChange={(e) => setOperatingHours(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
              placeholder="Ex: Segunda a Sexta, 9h às 17h" 
            />
            <p className="text-xs text-slate-400 mt-2">Este texto será exibido no rodapé do site.</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-slate-400"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsManager;
