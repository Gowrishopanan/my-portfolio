import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, ShieldAlert, LogOut } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'CASES' },
    { id: 'testimonials', label: 'TESTIMONIALS' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACTS' },
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5 select-none h-16 md:h-20 flex items-center justify-between px-6 md:px-12 lg:px-16">
      
      {/* 5-Column Spread Menu Bar for Desktop - EXACT mockup match */}
      <div className="hidden md:grid grid-cols-5 w-full max-w-7xl mx-auto text-[11px] md:text-xs tracking-[0.2em] font-extrabold text-black/60">
        
        {/* Column 1: ABOUT */}
        <div className="flex justify-start items-center">
          <button 
            onClick={() => handleNavClick('about')} 
            className={`hover:text-black transition-colors duration-300 ${currentPage === 'about' ? 'text-black font-black' : ''}`}
          >
            ABOUT
          </button>
        </div>

        {/* Column 2: CASES */}
        <div className="flex justify-center items-center">
          <button 
            onClick={() => handleNavClick('projects')} 
            className={`hover:text-black transition-colors duration-300 ${currentPage === 'projects' ? 'text-black font-black' : ''}`}
          >
            CASES
          </button>
        </div>

        {/* Column 3: TESTIMONIALS */}
        <div className="flex justify-center items-center">
          <button 
            onClick={() => handleNavClick('testimonials')} 
            className={`hover:text-black transition-colors duration-300 ${currentPage === 'testimonials' ? 'text-black font-black' : ''}`}
          >
            TESTIMONIALS
          </button>
        </div>

        {/* Column 4: SKILLS */}
        <div className="flex justify-center items-center">
          <button 
            onClick={() => handleNavClick('skills')} 
            className={`hover:text-black transition-colors duration-300 ${currentPage === 'skills' ? 'text-black font-black' : ''}`}
          >
            SKILLS
          </button>
        </div>

        {/* Column 5: CONTACTS + Admin */}
        <div className="flex justify-end items-center gap-4">
          <button 
            onClick={() => handleNavClick('contact')} 
            className={`hover:text-black transition-colors duration-300 mr-2 ${currentPage === 'contact' ? 'text-black font-black' : ''}`}
          >
            CONTACTS
          </button>
          
          {/* Subtle Key Icon for Admin Panel Access */}
          <button
            onClick={() => handleNavClick('admin')}
            title="CMS Control Panel"
            className={`p-1.5 rounded-full transition-all border ${
              currentPage === 'admin'
                ? 'bg-black text-white border-black shadow-md'
                : 'border-black/5 hover:border-black/25 text-black/35 hover:text-black'
            }`}
          >
            <ShieldAlert size={12} />
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setCurrentPage('home');
              }}
              title="Logout from CMS"
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>

      </div>

      {/* Mobile Drawer Navigation Header */}
      <div className="md:hidden flex items-center justify-between w-full select-none">
        <div 
          onClick={() => handleNavClick('home')} 
          className="font-display font-black text-xs tracking-[0.25em] text-black cursor-pointer uppercase"
        >
          GOWRISHOPANAN.
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setCurrentPage('home');
              }}
              className="text-red-500"
            >
              <LogOut size={15} />
            </button>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-black/80 hover:text-black focus:outline-none"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-black/5 animate-fade-in z-40">
          <div className="flex flex-col px-6 py-6 gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left font-display text-xs tracking-widest font-extrabold py-2 ${
                  currentPage === item.id ? 'text-[#000080] pl-2 border-l-2 border-[#000080]' : 'text-black/75'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-2 text-left font-display text-xs tracking-widest font-extrabold py-2 ${
                currentPage === 'admin' ? 'text-[#000080] pl-2 border-l-2 border-[#000080]' : 'text-black/75'
              }`}
            >
              <ShieldAlert size={14} />
              ADMIN CONTROL PANEL
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
