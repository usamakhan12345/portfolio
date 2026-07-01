import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay, Keyboard } from 'swiper/modules';
import { ExternalLink, Github } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Projects = () => {
  const dummyProjects = [
    {
      title: 'Dubai Department of Economy and Tourism – Learning Hub',
      description: 'Architected Redux-based API integrations to establish reliable, optimized data flow. Developed custom logic for Course Detail pages to handle dynamic content, and integrated Google Tag Manager (GTM) for analytics.',
      tech: ['React.js', 'Next.js', 'Redux', 'GTM', 'CMS Integration'],
      image: '/assets/project_chat.png',
      demoUrl: 'https://dubailearnsme.ae',
      githubUrl: 'https://github.com/usamakhan12345'
    },
    {
      title: 'ZNM (Zayed National Museum)',
      description: 'Contributed to UI development and API integrations for the Zayed National Museum website, delivering a culturally significant experience. Built dynamic Donation, Volunteer, and Partnership forms with backend connectivity.',
      tech: ['React.js', 'SCSS', 'REST APIs', 'Node.js', 'Express.js'],
      image: '/assets/project_ecommerce.png',
      demoUrl: 'https://zayednationalmuseum.ae',
      githubUrl: 'https://github.com/usamakhan12345'
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
              rotate: 5,
              stretch: 0,
              depth: 80,
              modifier: 2,
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

                      {/* Actions links - visible/expanded only on active card */}
                      <div className="project-actions">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn demo-btn"
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn code-btn"
                        >
                          <Github size={16} /> Code
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Projects;
