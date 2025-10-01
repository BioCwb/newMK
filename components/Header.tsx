
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Photo', href: '#gallery' },
    { name: 'Admin', href: '#admin' },
    { name: 'Cadastro', href: '#contact' }
  ];

  return (
    <header className="bg-slate-800/90 text-white sticky top-0 z-50 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
          Metais MK
        </a>
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-slate-200 hover:text-blue-400 transition-colors duration-300">
              {link.name}
            </a>
          ))}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
               <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-slate-200 hover:text-blue-400 transition-colors duration-300 py-2">
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
