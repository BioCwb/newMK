import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const Footer: React.FC = () => {
  const [operatingHours, setOperatingHours] = useState('Segunda - Sexta, 9h às 17h');

  useEffect(() => {
    const docRef = firestore.collection('settings').doc('businessInfo');
    
    // Listen for real-time updates
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        // Fallback to default if the field is missing
        setOperatingHours(doc.data()?.operatingHours || 'Segunda - Sexta, 9h às 17h');
      }
    }, (error) => {
        console.error("Error fetching operating hours:", error);
        // In case of error, we just keep the default value
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);


  return (
    <footer className="bg-slate-800 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Metais MK</h3>
            <p className="text-slate-400">Excelência em projetos de metal, aliando design moderno, durabilidade e atendimento personalizado para superar suas expectativas.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Fale Conosco</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-map-marker-alt w-6 text-blue-400"></i>
                <span>Rua Austria 461 - Fazenda Rio Grande - PR</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-phone w-6 text-blue-400"></i>
                <a href="tel:+5541998221970" className="hover:text-blue-400">(41) 9 9822-1970</a>
              </li>
               <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-briefcase w-6 text-blue-400"></i>
                <span>CNPJ: 58.930.672/0001-86</span>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fas fa-clock w-6 text-blue-400"></i>
                <span>{operatingHours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Siga-nos</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-facebook-f text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-instagram text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-linkedin-in text-white"></i>
              </a>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Metais MK. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;