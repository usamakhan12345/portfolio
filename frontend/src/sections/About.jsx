import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaDatabase, FaGitAlt, FaTerminal, FaServer } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiPostman, SiJavascript, SiSass } from 'react-icons/si';

const About = () => {
  const stats = [
    { value: '25+', label: 'Projects Completed' },
    { value: '15+', label: 'Happy Clients' },
    { value: '99%', label: 'Success Rate' }
  ];

  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'React.js', icon: <FaReact /> },
        { name: 'JavaScript (ES6+)', icon: <SiJavascript /> },
        { name: 'SCSS / Sass', icon: <SiSass /> },
        { name: 'HTML5 & CSS3', icon: <><FaHtml5 /><FaCss3Alt /></> }
      ]
    },
    {
      title: 'Backend & Database',
      skills: [
        { name: 'Node.js', icon: <FaNodeJs /> },
        { name: 'Express.js', icon: <SiExpress /> },
        { name: 'MongoDB / Mongoose', icon: <SiMongodb /> },
        { name: 'REST APIs', icon: <FaServer /> }
      ]
    },
    {
      title: 'Tools & Workflows',
      skills: [
        { name: 'Git & GitHub', icon: <FaGitAlt /> },
        { name: 'Postman', icon: <SiPostman /> },
        { name: 'VS Code & CLI', icon: <><FaTerminal /></> }
      ]
    }
  ];

  const experiences = [
    {
      role: 'Lead Full Stack Developer',
      company: 'Freelance & Tech Agency',
      date: '2024 - Present',
      description: 'Architecting end-to-end full-stack projects using React, Node.js, Express, and MongoDB. Writing modular SCSS styles, implementing JWT logins, and integrating Stripe gateways.'
    },
    {
      role: 'MERN Developer Intern',
      company: 'Nexus Software Labs',
      date: '2023 - 2024',
      description: 'Collaborated on frontend UI components, optimized database queries with Mongoose, and assisted in building robust REST API endpoints. Refactored vanilla CSS files to scalable nested SCSS.'
    },
    {
      role: 'Bachelor of Computer Science',
      company: 'Karachi University',
      date: '2021 - 2025 (Expected)',
      description: 'Specializing in software engineering, database management systems, and web application design principles.'
    }
  ];

  // Motion animation parameters
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section id="about" className="about-section">
      <div className="glow-backdrop purple"></div>
      
      <div className="container">
        <div className="section-header">
          <h2>About <span>Me</span></h2>
          <p>Get to know my journey, my skills, and the engineering principles I bring to every web development project.</p>
        </div>

        <div className="about-grid">
          {/* Left Column - Biography, Stats, Skills */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="about-bio"
          >
            <motion.p variants={itemVariants} className="bio-text">
              I am a passionate software developer based in Pakistan, dedicated to creating premium user experiences on the web. Over the past 3+ years, I have honed my expertise in the <strong>MERN stack</strong>, transforming wireframes into production-ready web apps.
            </motion.p>
            <motion.p variants={itemVariants} className="bio-text">
              I believe in writing semantic HTML, modular and scalable SCSS files, and modular backend APIs that allow future enhancements like authentication, CMS integration, or advanced AI vector indexes to be added with minimal refactoring.
            </motion.p>

            {/* Stats list */}
            <motion.div variants={itemVariants} className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-val">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Skills categorization grids */}
            <motion.div variants={itemVariants} className="skills-wrapper">
              <h3>My Core Tech Stack</h3>
              <div className="skills-categories">
                {skillCategories.map((cat, idx) => (
                  <div key={idx} className="skills-category">
                    <div className="category-title">{cat.title}</div>
                    <div className="skills-list">
                      {cat.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="skill-tag">
                          {skill.icon}
                          <span>{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Work Experience & Education Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="timeline-wrapper"
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Experience & Education</h3>
            <div className="timeline-container">
              {experiences.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-header">
                    <div>
                      <h4 className="timeline-title">{exp.role}</h4>
                      <span className="timeline-company">{exp.company}</span>
                    </div>
                    <span className="timeline-date">{exp.date}</span>
                  </div>
                  <p className="timeline-desc">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
