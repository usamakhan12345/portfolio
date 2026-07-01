import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaDatabase, FaGitAlt, FaTerminal, FaServer } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiPostman, SiJavascript, SiSass, SiNextdotjs, SiTypescript } from 'react-icons/si';

const About = () => {
  const stats = [
    { value: '3+', label: 'Years Experience' },
    { value: '15+', label: 'Projects Completed' },
    { value: '100%', label: 'Commitment Rate' }
  ];

  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'React.js', icon: <FaReact /> },
        { name: 'Next.js', icon: <SiNextdotjs /> },
        { name: 'TypeScript', icon: <SiTypescript /> },
        { name: 'JavaScript', icon: <SiJavascript /> },
        { name: 'HTML5 & CSS3', icon: <><FaHtml5 /><FaCss3Alt /></> }
      ]
    },
    {
      title: 'Backend & Database',
      skills: [
        { name: 'Node.js', icon: <FaNodeJs /> },
        { name: 'Express.js', icon: <SiExpress /> },
        { name: 'MongoDB', icon: <SiMongodb /> },
        { name: 'REST APIs', icon: <FaServer /> }
      ]
    },
    {
      title: 'Tools & Workflows',
      skills: [
        { name: 'GitHub & GitLab', icon: <FaGitAlt /> },
        { name: 'Postman', icon: <SiPostman /> },
        { name: 'VS Code & CLI', icon: <><FaTerminal /></> }
      ]
    }
  ];

  const experiences = [
    {
      role: 'Front-End Engineer (ReactJs & NextJs)',
      company: 'Technyx system',
      date: 'Dec 2023 - Present',
      description: 'Built responsive, pixel-perfect websites using Next.js and React, ensuring optimal performance. Integrated RESTful APIs using Redux and RTK Query for efficient state management, and connected web apps to CMS platforms with custom business logic.'
    },
    {
      role: 'Bachelor Of Science in Computer Science',
      company: 'Fuuast University',
      date: 'Completed in 2024',
      description: 'Specializing in computer science, software engineering principles, algorithms, and application design.'
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
              I am a JavaScript Developer with <strong>2+ years of experience</strong> building and maintaining responsive, high-performance web applications. I have hands-on expertise in <strong>React, Next.js, and Node.js</strong>.
            </motion.p>
            <motion.p variants={itemVariants} className="bio-text">
              Proficient in <strong>HTML, CSS, JavaScript, and TypeScript</strong>, I focus on integrating robust state management using Redux/RTK Query, connecting CMS systems, and implementing data analytics like Google Tag Manager.
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
