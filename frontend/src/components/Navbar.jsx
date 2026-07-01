import { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Resume', id: 'resume' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Background effect
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section highlighting
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200; // Offset for detection

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#home" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
          <Terminal size={22} className="logo-icon" />
          Muhammad Osama
          <span className="dot"></span>
        </a>

        {/* Desktop Navigation */}
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <a
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-cta">
          <a
            href="#contact"
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Overlay */}
        <div
          className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        ></div>

        {/* Mobile Drawer */}
        <div className={`mobile-drawer ${isMobileOpen ? 'active' : ''}`}>
          <ul className="mobile-menu">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`mobile-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li style={{ marginTop: '1rem' }}>
              <a
                href="#contact"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Hire Me
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
