import { useEffect, useState } from 'react';
import { Download, ArrowRight, Github, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const targetWords = ['React JS Developer', 'Front-End Developer', 'JavaScript Developer'];
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriting effect
  useEffect(() => {
    let timer;
    const currentWord = targetWords[wordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentWord.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentWord.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentWord.length) {
      timer = setTimeout(() => setIsDeleting(true), 1500); // Wait before delete
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex(prev => (prev + 1) % targetWords.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex]);

  const scrollToSection = (id) => {
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

  return (
    <section id="home" className="hero-section">
      <div className="bg-grid"></div>
      <div className="glow-circle-1"></div>
      <div className="glow-circle-2"></div>

      <div className="container hero-container">
        {/* Left Intro Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hero-content"
        >
          <div className="hero-tag">
            <span className="dot"></span> Available for Freelance & Remote Work
          </div>

          <h1 className="hero-title">
            Hi, I am <span className="name">Muhammad Osama</span>
            <br />
            <span className="typewriter" style={{ minHeight: '3.6rem', display: 'block' }}>
              I'm a <span style={{ color: '#10b981' }}>{typedText}</span>
              <span className="cursor" style={{ animation: 'blink 1s infinite' }}>|</span>
            </span>
          </h1>

          <p className="hero-subtitle">
            I design and build premium, high-performance web applications using HTML, CSS, JavaScript, React, Next.js, and Node.js. I specialize in crafting interactive digital experiences with custom styling and seamless API integrations.
          </p>

          <div className="hero-actions">
            <button onClick={() => scrollToSection('projects')} className="btn btn-primary">
              View My Work <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn btn-secondary">
              Let's Talk
            </button>
            <a 
              href="/assets/resume.pdf" 
              download="Muhammad_Osama_Resume.pdf" 
              className="btn btn-secondary"
              style={{ gap: '0.5rem' }}
            >
              <Download size={16} /> Resume
            </a>
          </div>
        </motion.div>

        {/* Right Blob Image Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="hero-visual"
        >
          <div className="visual-wrapper">
            <div className="main-avatar">
              {/* Uses generated avatar in public/assets */}
              <img src="/assets/avatar.png" alt="Muhammad Osama's Avatar" />
            </div>

            {/* Floating dynamic badges */}
            <div className="floating-badge badge-1">
              <div className="info-icon badge-icon">
                <Award size={20} />
              </div>
              <div className="badge-text">
                <span className="label">Experience</span>
                <span className="val">2+ Years</span>
              </div>
            </div>

            <div className="floating-badge badge-2">
              <div className="info-icon badge-icon" style={{ color: '#8b5cf6' }}>
                <Github size={20} />
              </div>
              <div className="badge-text">
                <span className="label">Open Source</span>
                <span className="val">500+ Commits</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
