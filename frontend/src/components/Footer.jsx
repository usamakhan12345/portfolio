import { useState, useEffect } from 'react';
import { ArrowUp, Terminal, Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Instagram, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Monitor scroll height to show/hide "Back to Top" button
  useEffect(() => {
    const checkScrollHeight = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollHeight);
    return () => window.removeEventListener('scroll', checkScrollHeight);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <>
      <footer className="footer-area">
        {/* Decorative thin animated top border */}
        <div className="animated-top-divider"></div>

        <div className="container">
          {/* CTA Banner above footer */}
          <div className="footer-cta-banner">
            <div className="cta-left">
              <h2>Let's build something amazing together</h2>
              <p>Seek professional MERN development, custom interfaces, or full-stack software advice.</p>
            </div>
            <div className="cta-right">
              <a href="#contact" className="btn btn-primary" onClick={(e) => scrollToSection(e, 'contact')}>
                Get In Touch <Send size={16} />
              </a>
            </div>
          </div>

          {/* Core Footer Grids */}
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <a href="#home" className="footer-logo" onClick={(e) => scrollToSection(e, 'home')}>
                <Terminal size={22} className="logo-icon" />
                Usama
                <span className="dot"></span>
              </a>
              <p className="brand-tagline">MERN Stack Software Engineer</p>
              <p className="brand-intro">
                Crafting modern web applications with clean, production-ready backend servers and high-fidelity custom styled interfaces.
              </p>
            </div>

            {/* Quick Links */}
            <div className="footer-links-col">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Home</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a></li>
                <li><a href="#resume" onClick={(e) => scrollToSection(e, 'resume')}>Resume</a></li>
                <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>Projects</a></li>
                <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-links-col">
              <h3>Services</h3>
              <ul>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>Frontend Development</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>MERN Stack Apps</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>UI/UX Custom Layouts</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>REST API Connections</a></li>
                <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>Speed Optimization</a></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="footer-contact-col">
              <h3>Contact Details</h3>
              <div className="contact-details-list">
                <div className="c-item">
                  <Mail size={16} />
                  <span>shehzadausamakhan@gmail.com</span>
                </div>
                <div className="c-item">
                  <Phone size={16} />
                  <span>+92-3162920295 / +92-3032584068</span>
                </div>
                <div className="c-item">
                  <MapPin size={16} />
                  <span>Karachi, Pakistan</span>
                </div>
              </div>
              
              {/* Availability Status badge */}
              <div className="status-badge">
                <span className="pulse-dot"></span> Available for Freelance
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to stay updated on modern full-stack web trends and code resources.</p>
              <form onSubmit={handleSubscribeSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <button type="submit" aria-label="Subscribe to newsletter">
                    <Send size={16} />
                  </button>
                </div>
              </form>
              <AnimatePresence>
                {subscribed && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="success-msg"
                  >
                    Successfully subscribed!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="middle-divider"></div>

          {/* Social Icons row */}
          <div className="footer-social-row">
            <a href="https://github.com/usamakhan12345" target="_blank" rel="noopener noreferrer" className="s-link" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href="https://www.linkedin.com/in/muhammad-usama-khan-b64337276/" target="_blank" rel="noopener noreferrer" className="s-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="mailto:shehzadausamakhan@gmail.com" className="s-link" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>

          {/* Bottom Copyright details */}
          <div className="footer-bottom">
            <p>&copy; 2026 Muhammad Osama. All Rights Reserved.</p>
            <p className="credit">
              Designed & Developed with <Heart size={14} className="heart-icon" />
            </p>
            <div className="bottom-links">
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Privacy Policy</a>
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="back-to-top"
            aria-label="Scroll back to top"
            title="Back to Top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
