import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Resume from './sections/Resume';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  return (
    <>
      {/* Navigation Header */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <Hero />
        <About />
        <Resume />
        <Projects />
        <Contact />
      </main>

      {/* Footer Area */}
      <Footer />

      {/* Floating Action Buttons */}
      <WhatsAppButton />
      <Chatbot />

      {/* Global CSS style transitions */}
      <style>{`
        main {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

export default App;
