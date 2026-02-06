import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarHeader = ({ scrollToSection, refs }) => {
  const { education, skills, work, contact } = refs || {};
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (ref) => {
    setIsOpen(false);
    if (scrollToSection && ref) scrollToSection(ref);
  };

  const navItems = [
    { name: "Education", ref: education },
    { name: "Work", ref: work },
    { name: "My Skills", ref: skills },
    { name: "Contact", ref: contact },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand/Logo (Optional, could add one later) */}
        <div className="font-bold text-xl text-slate-800">
          {/* Portfolio */}
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.ref)}
              className="font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none p-0 text-base"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-slate-600 hover:text-indigo-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full left-0 top-full">
          <div className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.ref)}
                className="text-left font-medium text-slate-600 hover:text-indigo-600 transition-colors py-2 border-b border-slate-50 last:border-none"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarHeader;
