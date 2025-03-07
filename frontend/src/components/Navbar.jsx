import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/services', label: 'Services' },
    { path: '/process', label: 'Our Process' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#F1C376] shadow-md py-3' : ':has(~ .has-overlay) ? bg-[#F1C376]/20 backdrop-blur-sm : bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isHomePage ? 'text-white' : 'text-[#DAA520]'} ${isScrolled ? 'text-white' : ':has(~ .has-overlay) ? text-[#DAA520] text-shadow-glow : text-secondary'}`}>
              Interior Pilot
            </span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link transition-all duration-200 font-bold ${isHomePage ? 'text-white' : 'text-[#DAA520]'} ${isScrolled ? 'text-white' : ':has(~ .has-overlay) ? text-[#DAA520] text-shadow-glow : text-secondary'} ${location.pathname === link.path ? '!text-[#8B4513] font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
            <svg className={`w-6 h-6 ${isScrolled ? 'text-white' : 'text-secondary'}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;