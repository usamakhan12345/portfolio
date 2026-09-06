import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay, Keyboard } from 'swiper/modules';
import { ExternalLink, Github, Lock } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Projects = () => {
  const [modalMessage, setModalMessage] = useState(null);
  const [swiperRef, setSwiperRef] = useState(null);

  // Lock body scroll and freeze Swiper slider autoplay when modal is open
  useEffect(() => {
    if (modalMessage) {
      document.body.style.overflow = 'hidden';
      if (swiperRef && swiperRef.autoplay) {
        swiperRef.autoplay.stop();
      }
    } else {
      document.body.style.overflow = 'unset';
      if (swiperRef && swiperRef.autoplay) {
        swiperRef.autoplay.start();
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (swiperRef && swiperRef.autoplay) {
        swiperRef.autoplay.start();
      }
    };
  }, [modalMessage, swiperRef]);

  const dummyProjects = [
    {
      title: 'Dubai Department of Economy and Tourism – Learning Hub',
      description: 'A fully dynamic portal integrated with Sitecore CMS where users complete courses, take quizzes, and generate certificates. Features secure OAuth login integrations via Google, LinkedIn, and UAE PASS. Engineered the API integrations using React Redux and RTK Query.',
      tech: ['React JS', 'Redux', 'RTK Query', 'Sitecore CMS', 'UAE PASS', 'GTM'],
      image: '/assets/project_chat.png',
      demoUrl: 'https://dubailearnsme.ae/',
      isProprietary: true,
      association: 'Technyx Systems'
    },
    {
      title: 'ZNM (Zayed National Museum)',
      description: 'Contributed to UI development and API integrations for the Zayed National Museum website, delivering a culturally significant digital experience. Built and integrated multiple dynamic forms including Donation, Volunteer, and Partnership with full frontend logic and backend API connectivity.',
      tech: ['React JS', 'Next JS', 'SCSS', 'REST APIs', 'Node JS', 'Express JS'],
      image: '/assets/znm_project.png',
      demoUrl: 'https://zayednationalmuseum.ae',
      isProprietary: true,
      association: 'associated partners'
    },
    {
      title: 'PractiCal – Healthy Meal Subscription Platform',
      description: 'Developed a modern health-focused meal subscription platform that allows users to explore nutritious, calorie-controlled meal plans, select subscriptions based on their dietary goals, and manage their meal preferences. The platform provides detailed meal and nutritional information, subscription management, and a seamless user experience for ordering freshly prepared meals.',
      tech: ['React JS', 'Next JS', 'SCSS', 'REST APIs', 'Redux'],
      image: '/assets/practical_project.png',
      demoUrl: 'https://practical.me',
      isProprietary: true,
      association: 'PractiCal'
    },
    {
      title: 'AI Conversational Dashboard',
      description: 'A full-stack client support platform utilizing a modular AI RAG query pipeline. It retrieves relevant text embeddings from vector storage and compiles prompt answers with historical persistence.',
      tech: ['React.js', 'SCSS', 'Node.js', 'Express.js', 'MongoDB'],
      image: '/assets/project_chat.png',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/usamakhan12345'
    },
    {
      title: 'Futuristic E-Commerce Platform',
      description: 'A premium retail storefront boasting real-time catalog filters, a state-managed shopping cart, user authentication, checkout modules, and custom developer styling.',
      tech: ['React.js', 'SCSS', 'Redux', 'Node.js', 'MongoDB'],
      image: '/assets/project_ecommerce.png',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/usamakhan12345'
    },
    {
      title: 'Real-Time Analytics Suite',
      description: 'An executive telemetry panel tracking website traffic patterns and resource usage metrics. Features SVG chart graphs, interactive date ranges, and custom responsive layouts.',
      tech: ['React.js', 'SCSS', 'Node.js', 'Express.js', 'Recharts'],
      image: '/assets/project_analytics.png',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/usamakhan12345'
    }
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="glow-backdrop green"></div>

      <div className="container">
        <div className="section-header">
          <h2>My <span>Projects</span></h2>
          <p>Explore some of the full-stack applications and premium frontend interfaces I've built using modern frameworks.</p>
        </div>

        <div className="swiper-container-wrapper">
          <Swiper
            onSwiper={setSwiperRef}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay, Keyboard]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            keyboard={{ enabled: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 80,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            className="projects-swiper"
          >
            {dummyProjects.map((project, idx) => (
              <SwiperSlide key={idx}>
                {({ isActive }) => (
                  <div className={`project-card ${isActive ? 'active' : 'inactive'}`}>
                    {/* Image wrapper */}
                    <div className="project-image">
                      <img src={project.image} alt={project.title} loading="lazy" />
                      <div className="image-overlay">
                        <span className="tech-tag" style={{ background: '#8b5cf6', color: '#fff', border: 'none' }}>
                          MERN Stack
                        </span>
                      </div>
                    </div>

                    {/* Text details */}
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-desc">{project.description}</p>
                      
                      {/* Tech tag list */}
                      <div className="project-tech">
                        {project.tech.map((techItem, tIdx) => (
                          <span key={tIdx} className="tech-tag">
                            {techItem}
                          </span>
                        ))}
                      </div>

                      {/* Actions links - enabled only on active card */}
                      <div className="project-actions">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn demo-btn"
                          tabIndex={isActive ? 0 : -1}
                          style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                        {project.isProprietary ? (
                          <button
                            onClick={() => isActive && setModalMessage(`This proprietary codebase is associated with ${project.association}. Access to the source repository is restricted.`)}
                            className="action-btn code-btn"
                            disabled={!isActive}
                            tabIndex={isActive ? 0 : -1}
                            style={{ 
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#9ca3af',
                              cursor: isActive ? 'pointer' : 'default',
                              pointerEvents: isActive ? 'auto' : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Lock size={16} /> Code
                          </button>
                        ) : (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn code-btn"
                            tabIndex={isActive ? 0 : -1}
                            style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                          >
                            <Github size={16} /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <AnimatePresence>
        {modalMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(5, 7, 12, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
            onClick={() => setModalMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: '#111827',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lock size={20} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                  Proprietary Codebase
                </h3>
              </div>
              
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
                {modalMessage}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setModalMessage(null)}
                  style={{ 
                    padding: '0.55rem 1.75rem', 
                    fontSize: '0.9rem',
                    background: '#8b5cf6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
