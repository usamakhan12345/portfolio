import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Resume = () => {
  const resumeHighlights = [
    'Proficient in building React.js interfaces & Single Page Applications (SPA)',
    'Experienced in scalable REST APIs using Node.js & Express.js server layers',
    'Database modeling with MongoDB schemas and Mongoose validation scripts',
    'Styling design systems with Sass/SCSS pre-processing, CSS variables, and nested syntax',
    'Asynchronous API interactions using Axios libraries & state management systems'
  ];

  return (
    <section id="resume" className="resume-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="glow-backdrop purple" style={{ top: '20%', right: '5%' }}></div>
      
      <div className="container">
        <div className="section-header">
          <h2>My <span>Resume</span></h2>
          <p>Get a summary of my technical competencies and download the full document for your records.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'rgba(17, 24, 39, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            zIndex: 2
          }}
          className="resume-card"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '2rem',
              marginBottom: '2rem'
            }}
            className="resume-card-header"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}
              >
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f3f4f6' }}>Curriculum Vitae</h3>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Updated June 2026</span>
              </div>
            </div>

            <a
              href="/assets/resume.pdf"
              download="Usama_Resume.pdf"
              className="btn btn-primary"
              style={{ gap: '0.6rem' }}
            >
              <Download size={18} /> Download CV
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f3f4f6', marginBottom: '0.5rem' }}>
              Core Technical Competencies:
            </h4>
            {resumeHighlights.map((highlight, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .resume-card {
            padding: 2rem 1.5rem !important;
          }
          .resume-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .resume-card-header a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Resume;
