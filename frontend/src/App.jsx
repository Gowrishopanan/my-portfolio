import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { Terminal } from 'lucide-react';
import TerminalConsole from './components/TerminalConsole';
import RecruiterModal from './components/RecruiterModal';
import InteractiveBackdrop from './components/InteractiveBackdrop';
import InfiniteMarquee from './components/InfiniteMarquee';
import Footer from './components/Footer';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);

  // Global portfolio content states with instant mock fallbacks
  const [settings, setSettings] = useState({
    name: 'Gowrishopanan Siveswaran',
    title: 'SOFTWARE ENGINEERING STUDENT',
    location: 'COLOMBO, SRI LANKA',
    bio: 'Pioneering intelligent user interfaces, human-computer speech systems, and full-stack software development.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'siveswaran.shopanan@gmail.com'
  });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [references, setReferences] = useState([]);

  // Interactive innovation states
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [recruiterOpen, setRecruiterOpen] = useState(false);

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (data.projects && data.projects.length) setProjects(data.projects);
        if (data.skills && data.skills.length) setSkills(data.skills);
        if (data.education && data.education.length) setEducation(data.education);
        if (data.experience && data.experience.length) setExperience(data.experience);
        if (data.references && data.references.length) setReferences(data.references);
      }
    } catch (err) {
      console.error('Error fetching global portfolio data:', err);
    }
  };

  useEffect(() => {
    // Start background api fetch
    fetchPortfolioData();

    // Smoothly dissolve boot loader in 300ms
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver to auto-update active navbar tab on scroll
  useEffect(() => {
    if (currentPage === 'admin' || loading) return;

    const sections = ['home', 'about', 'skills', 'projects', 'testimonials', 'contact'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        // Trigger if section takes up major space in the middle of the viewport
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // standard layout viewport margin
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [currentPage, loading]);

  // Global Apple Scroll-Reveal Viewport Observer
  useEffect(() => {
    if (currentPage === 'admin' || loading) return;

    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.apple-reveal');
      
      const observerCallback = (entries, self) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            self.unobserve(entry.target); // Apple style: stays visible after initial reveal!
          }
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // trigger slightly before entering viewport
        threshold: 0.05
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      revealElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 200);

    return () => clearTimeout(timer);
  }, [currentPage, loading, projects, skills, education, experience]);

  // Smooth Scroll Helper
  const scrollToSection = (id) => {
    if (id === 'admin') {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If currently on Admin, return to homepage stack
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // height of the navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center select-none">
        
        {/* Background Vertical Grid Lines */}
        <div className="bg-grid-lines">
          <div className="grid-vertical-line"></div>
          <div className="grid-vertical-line"></div>
          <div className="grid-vertical-line"></div>
        </div>

        <div className="flex flex-col items-center gap-4 z-10 animate-pulse">
          <div className="w-14 h-14 bg-black rounded-3xl flex items-center justify-center text-[#000080] shadow-xl shadow-black/10">
            <Terminal size={24} />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="font-display font-black text-xs tracking-[5px] text-black/90 uppercase">
              GOWRISHOPANAN
            </h2>
            <p className="font-display text-[9px] tracking-widest font-extrabold text-black/40 uppercase">
              BOOTING CONSOLE STATE...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col scroll-smooth">
      {/* Feature 1: Interactive Glass Dust Particle Matrix Background */}
      <InteractiveBackdrop />

      <Navbar 
        currentPage={currentPage === 'admin' ? 'admin' : activeSection} 
        setCurrentPage={scrollToSection} 
        onTerminalClick={() => setTerminalOpen(true)}
        onRecruiterClick={() => setRecruiterOpen(true)}
      />
      
      <main className="flex-grow z-10">
        {currentPage === 'admin' ? (
          <Admin 
            settings={settings} 
            setSettings={setSettings}
            projects={projects}
            setProjects={setProjects}
            skills={skills}
            setSkills={setSkills}
            education={education}
            setEducation={setEducation}
            experience={experience}
            fetchData={fetchPortfolioData} 
          />
        ) : (
          <div className="flex flex-col">
            <section id="home">
              <Home 
                settings={settings} 
                setCurrentPage={scrollToSection} 
                onRecruiterClick={() => setRecruiterOpen(true)}
              />
            </section>
            
            <section id="about">
              <About 
                settings={settings} 
                education={education} 
                experience={experience} 
                references={references} 
              />
            </section>

            {/* Feature 2: Infinite Scrolling Technical Ribbon */}
            <InfiniteMarquee />

            <section id="skills">
              <Skills skills={skills} />
            </section>

            <section id="projects">
              <Projects projects={projects} />
            </section>

            <section id="contact">
              <Contact settings={settings} />
            </section>

            {/* Minimalist Designer Credits Footer */}
            <Footer />
          </div>
        )}
      </main>

      {/* Feature 5: Retro UNIX Command Shell */}
      {terminalOpen && (
        <TerminalConsole 
          onClose={() => setTerminalOpen(false)} 
          projects={projects}
          skills={skills}
          settings={settings}
        />
      )}

      {/* Feature 2: Recruiter Briefing Modal */}
      {recruiterOpen && (
        <RecruiterModal 
          onClose={() => setRecruiterOpen(false)} 
          settings={settings}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
