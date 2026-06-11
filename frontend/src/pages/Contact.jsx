import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Terminal, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  
  // Tech Interview Riddle state triggers
  const [riddleInput, setRiddleInput] = useState('');
  const [riddleUnlocked, setRiddleUnlocked] = useState(false);
  const [riddleError, setRiddleError] = useState(false);

  const checkRiddle = () => {
    const clean = riddleInput.trim().toLowerCase().replace(/\s+/g, '');
    if (clean === 'o(logn)' || clean === 'logn' || clean === 'o(log(n))' || clean === 'log(n)') {
      setRiddleUnlocked(true);
      setRiddleError(false);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#000080', '#ADD8E6', '#ffffff']
      });
    } else {
      setRiddleError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'Please fill in all the required form fields!' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', message: '' });
        
        // Premium Success Animation Trigger in Frozen Lake palette!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#000080', '#ADD8E6', '#ffffff']
        });
      } else {
        setStatus({ type: 'error', text: data.message || 'Something went wrong. Please try again!' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Connection failed. Please check your backend is active!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full pt-32 pb-20 px-6 md:px-12 bg-white overflow-x-hidden">
      
      {/* Background Vertical Grid Lines */}
      <div className="bg-grid-lines">
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line hidden md:block"></div>
        <div className="grid-vertical-line"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10 flex flex-col lg:flex-row gap-16">
        
        {/* Left Side: Contact details */}
        <div className="w-full lg:w-2/5 flex flex-col gap-10 select-none apple-reveal">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#6D8196]" />
              <span className="font-display text-xs tracking-widest font-extrabold text-[#6D8196]">04 / INQUIRIES</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight uppercase text-black/90">
              LET'S LAUNCH<br />A PROJECT
            </h1>
          </div>

          <p className="text-black/65 text-sm md:text-base leading-relaxed font-medium">
            Whether you want to discuss full-stack web applications, lip reading machine learning research, or simple coding internships, feel free to send me a message!
          </p>

          <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[9px] tracking-widest font-extrabold text-black/40">EMAIL DIRECT</span>
                <span className="font-display text-base font-extrabold text-[#000080] hover:text-[#6D8196] transition-colors">{settings.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[9px] tracking-widest font-extrabold text-black/40">PHONE CONTACT</span>
                <a href={`tel:${settings.phone}`} className="font-display text-base font-extrabold text-black/85 hover:text-[#000080] transition-colors">{settings.phone || 'Not provided'}</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[9px] tracking-widest font-extrabold text-black/40">BASED IN</span>
                <span className="font-display text-base font-extrabold text-black/85">{settings.location || 'Colombo, Sri Lanka'}</span>
              </div>
            </div>

            {/* Tech Interview Riddle Easter Egg Widget */}
            <div className="mt-8 border-t border-black/5 pt-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#000080]">
                <Award size={16} className="animate-bounce" />
                <span className="font-display text-[10px] tracking-widest font-extrabold uppercase">EASTER EGG CHALLENGE</span>
              </div>
              <div className="bg-black/5 border border-black/5 rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-display text-xs font-black text-black/90 uppercase leading-snug">
                  HACK THE SYSTEM DIRECT LINE
                </h4>
                <p className="text-black/60 text-xs font-semibold leading-relaxed font-sans">
                  Riddle: What is the average time complexity of searching a perfectly balanced Binary Search Tree?
                </p>
                
                {riddleUnlocked ? (
                  <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold leading-normal flex flex-col gap-1">
                    <span className="text-[9px] text-emerald-600 tracking-wider font-extrabold font-display">✓ LANDMARK VERIFIED</span>
                    <span>DIRECT PHONE: +94 77 964 8251</span>
                    <span className="text-[10px] text-emerald-700/60 font-mono">Access Token: EXCELLENCE_DEV_2026</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. O(log N)"
                      value={riddleInput}
                      onChange={(e) => setRiddleInput(e.target.value)}
                      className="flex-grow bg-white border border-black/10 outline-none rounded-xl px-3 py-2 text-xs font-bold font-mono focus:border-[#000080]/30"
                    />
                    <button 
                      type="button"
                      onClick={checkRiddle}
                      className="bg-black hover:bg-[#000080] text-white px-4 py-2 rounded-xl text-[9px] tracking-wider font-extrabold uppercase transition-colors btn-magnetic"
                    >
                      VERIFY
                    </button>
                  </div>
                )}
                {riddleError && (
                  <span className="text-rose-500 text-[10px] font-bold">Incorrect answer. Try again! (Hint: log N)</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Message form console */}
        <div className="w-full lg:w-3/5 glass-panel rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 apple-reveal delay-200">
          <h3 className="font-display text-lg font-extrabold text-black/80 tracking-tight flex items-center gap-2 mb-6 border-b border-black/5 pb-4">
            <Terminal size={18} className="text-[#000080]" />
            MESSAGE DESPATCH CONSOLE
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Status alerts */}
            {status.text && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed font-semibold transition-all duration-300 ${
                status.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-800 border border-rose-100'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <AlertCircle size={16} className="text-rose-500 shrink-0" />}
                <span>{status.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">YOUR NAME *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Gowri"
                  required
                  className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-display text-[9px] tracking-widest font-extrabold text-[#000080]">YOUR EMAIL *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  required
                  className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">YOUR CORRESPONDENCE *</label>
              <textarea 
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Let's build something brilliant together..."
                required
                className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-3 text-sm font-semibold transition-all resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-black hover:bg-[#000080] text-white font-display text-xs tracking-widest font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-black/40 shadow-lg shadow-black/5 btn-magnetic"
            >
              {loading ? (
                <span>TRANSMITTING MESSAGE...</span>
              ) : (
                <>
                  <span>TRANSMIT MESSAGE</span>
                  <Send size={12} />
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
