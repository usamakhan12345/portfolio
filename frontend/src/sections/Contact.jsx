import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactDetails = [
    {
      icon: <Phone />,
      label: 'Phone / WhatsApp',
      value: '03162920295'
    },
    {
      icon: <Mail />,
      label: 'Email Address',
      value: 'shehzadausamakhan@gmail.com'
    },
    {
      icon: <MapPin />,
      label: 'Location',
      value: 'Karachi, Pakistan'
    }
  ];

  const socialLinks = [
    { icon: <Github />, url: 'https://github.com', label: 'GitHub' },
    { icon: <Linkedin />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Twitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <MessageSquare />, url: 'https://wa.me/923162920295', label: 'WhatsApp' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear success notification after 5s
      setTimeout(() => setStatus(null), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="glow-backdrop purple" style={{ bottom: '10%', left: '10%' }}></div>

      <div className="container">
        <div className="section-header">
          <h2>Contact <span>Me</span></h2>
          <p>Get in touch for consultations, freelance inquiries, or just to say hello! I will get back to you within 24 hours.</p>
        </div>

        <div className="contact-grid">
          {/* Left Details column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="contact-info"
          >
            <h3 className="info-title">Let's Connect</h3>
            <p className="info-desc">
              Have an idea you want to bring to life? Want to discuss a website project or collaboration? Use the direct details or fill out the form!
            </p>

            <div className="info-list">
              {contactDetails.map((item, idx) => (
                <div key={idx} className="info-item">
                  <div className="info-icon">{item.icon}</div>
                  <div className="info-text">
                    <span className="label">{item.label}</span>
                    <span className="val">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="social-links">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Form column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="contact-form-wrapper"
          >
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : <><Send size={16} /> Send Message</>}
              </button>

              {status === 'success' && (
                <div className="form-status success">
                  Your message has been sent successfully! Thank you.
                </div>
              )}
              {status === 'error' && (
                <div className="form-status error">
                  Oops, something went wrong. Please try again.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
