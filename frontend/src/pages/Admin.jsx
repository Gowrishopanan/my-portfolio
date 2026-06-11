import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldAlert, Lock, User, Save, Plus, Trash2, Edit, MessageSquare, 
  Settings2, FolderGit2, GraduationCap, Laptop, LogOut, CheckCircle2,
  Briefcase, MapPin
} from 'lucide-react';

export default function Admin({ 
  settings, setSettings, 
  projects, setProjects, 
  skills, setSkills, 
  education, setEducation, 
  experience = [],
  fetchData 
}) {
  const { isAuthenticated, login, token, logout } = useContext(AuthContext);

  // Auth local states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard state tabs: 'settings', 'projects', 'skills', 'education', 'experience', 'messages'
  const [activeTab, setActiveTab] = useState('settings');
  const [saveStatus, setSaveStatus] = useState('');

  // Form states
  const [settingsForm, setSettingsForm] = useState(settings);
  const [projForm, setProjForm] = useState({ 
    id: '', title: '', subtitle: '', category: '', description: '', 
    details: '', tags: '', liveUrl: '', githubUrl: '' 
  });
  const [skillForm, setSkillForm] = useState({ id: '', name: '', category: 'Programming Languages', level: 'Advanced' });
  const [eduForm, setEduForm] = useState({ id: '', degree: '', institution: '', period: '', description: '' });
  const [expForm, setExpForm] = useState({ id: '', role: '', company: '', period: '', location: '', type: 'Full-time', details: '' });
  
  // Dynamic list states
  const [messages, setMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Sync settings when loaded
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Load backend contact messages if logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching admin messages:', err);
    }
  };

  // Auth submit handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      await login(username, password);
    } catch (err) {
      setAuthError('Incorrect username or password. Please try again!');
    }
  };

  // Settings Save Handler
  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        triggerSaveNotification('Settings saved successfully!');
      }
    } catch (err) {
      triggerSaveNotification('Failed to save settings.');
    }
  };

  // Projects CRUD handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('');

    const formattedProj = {
      ...projForm,
      details: Array.isArray(projForm.details) ? projForm.details : projForm.details.split('\n').filter(l => l.trim()),
      tags: Array.isArray(projForm.tags) ? projForm.tags : projForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    const isEdit = !!projForm.id;
    const url = isEdit ? `/api/projects/${projForm.id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedProj)
      });

      if (res.ok) {
        await fetchData(); // refresh state
        resetProjectForm();
        triggerSaveNotification(isEdit ? 'Project updated!' : 'Project created!');
      }
    } catch (err) {
      triggerSaveNotification('Project action failed.');
    }
  };

  const handleEditProject = (proj) => {
    setProjForm({
      id: proj.id || proj._id,
      title: proj.title,
      subtitle: proj.subtitle,
      category: proj.category,
      description: proj.description,
      details: proj.details.join('\n'),
      tags: proj.tags.join(', '),
      liveUrl: proj.liveUrl,
      githubUrl: proj.githubUrl
    });
    setEditingId(proj.id || proj._id);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchData();
        triggerSaveNotification('Project removed successfully.');
      }
    } catch (err) {
      triggerSaveNotification('Failed to delete project.');
    }
  };

  const resetProjectForm = () => {
    setProjForm({ id: '', title: '', subtitle: '', category: '', description: '', details: '', tags: '', liveUrl: '', githubUrl: '' });
    setEditingId(null);
  };

  // Skills CRUD handlers
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    const isEdit = !!skillForm.id;
    const url = isEdit ? `/api/skills/${skillForm.id}` : '/api/skills';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skillForm)
      });

      if (res.ok) {
        await fetchData();
        setSkillForm({ id: '', name: '', category: 'Programming Languages', level: 'Advanced' });
        setEditingId(null);
        triggerSaveNotification(isEdit ? 'Skill updated!' : 'Skill added!');
      }
    } catch (err) {
      triggerSaveNotification('Skill action failed.');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchData();
        triggerSaveNotification('Skill removed.');
      }
    } catch (err) {
      triggerSaveNotification('Failed to delete skill.');
    }
  };

  // Education CRUD handlers
  const handleEduSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    const isEdit = !!eduForm.id;
    const url = isEdit ? `/api/education/${eduForm.id}` : '/api/education';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eduForm)
      });

      if (res.ok) {
        await fetchData();
        setEduForm({ id: '', degree: '', institution: '', period: '', description: '' });
        setEditingId(null);
        triggerSaveNotification(isEdit ? 'Education details updated!' : 'Education details added!');
      }
    } catch (err) {
      triggerSaveNotification('Education action failed.');
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete this educational entry?')) return;
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchData();
        triggerSaveNotification('Education removed.');
      }
    } catch (err) {
      triggerSaveNotification('Failed to delete education.');
    }
  };

  // Experience CRUD handlers
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('');

    const formattedExp = {
      ...expForm,
      details: Array.isArray(expForm.details) ? expForm.details : expForm.details.split('\n').filter(l => l.trim())
    };

    const isEdit = !!expForm.id;
    const url = isEdit ? `/api/experience/${expForm.id}` : '/api/experience';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedExp)
      });

      if (res.ok) {
        await fetchData(); // refresh state
        resetExperienceForm();
        triggerSaveNotification(isEdit ? 'Experience updated!' : 'Experience added!');
      }
    } catch (err) {
      triggerSaveNotification('Experience action failed.');
    }
  };

  const handleEditExperience = (exp) => {
    setExpForm({
      id: exp.id || exp._id,
      role: exp.role,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      type: exp.type || 'Full-time',
      details: Array.isArray(exp.details) ? exp.details.join('\n') : exp.details
    });
    setEditingId(exp.id || exp._id);
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchData();
        triggerSaveNotification('Experience removed.');
      }
    } catch (err) {
      triggerSaveNotification('Failed to delete experience.');
    }
  };

  const resetExperienceForm = () => {
    setExpForm({ id: '', role: '', company: '', period: '', location: '', type: 'Full-time', details: '' });
    setEditingId(null);
  };

  // Message Delete Handler
  const handleDeleteMsg = async (id) => {
    if (!window.confirm('Remove this message permanently?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMessages();
        triggerSaveNotification('Message deleted.');
      }
    } catch (err) {
      triggerSaveNotification('Failed to delete message.');
    }
  };

  const triggerSaveNotification = (msg) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 4000);
  };

  // --- LOGIN MODULE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center pt-20 px-6 bg-white">
        
        {/* Background Vertical Grid Lines */}
        <div className="bg-grid-lines">
          <div className="grid-vertical-line"></div>
          <div className="grid-vertical-line"></div>
          <div className="grid-vertical-line"></div>
        </div>

        <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-xl shadow-black/5 z-10">
          <div className="flex flex-col items-center gap-3 text-center mb-8">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
              <Lock size={20} />
            </div>
            <h1 className="font-display text-xl font-extrabold tracking-tight uppercase text-black/90">
              CMS ADMIN VERIFICATION
            </h1>
            <p className="text-xs text-black/50 leading-relaxed font-semibold">
              Enter your authentication keys to access your portfolio content database dashboard.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
            {authError && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-xs font-semibold text-center leading-relaxed">
                {authError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">USERNAME</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl pl-10 pr-4 py-3 text-sm font-semibold transition-all"
                />
                <User size={16} className="absolute left-3.5 top-3.5 text-black/40" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">PASSWORD</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl pl-10 pr-4 py-3 text-sm font-semibold transition-all"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-black/40" />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-black hover:bg-[#000080] text-white font-display text-xs tracking-widest font-extrabold rounded-xl transition-all duration-300 shadow-lg shadow-black/5"
            >
              AUTHENTICATE CONSOLE
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- CMS PORTAL MODULE ---
  return (
    <div className="min-h-screen w-full pt-28 pb-20 px-6 md:px-12 bg-white overflow-x-hidden">
      
      {/* Background Vertical Grid Lines */}
      <div className="bg-grid-lines">
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line"></div>
        <div className="grid-vertical-line hidden md:block"></div>
        <div className="grid-vertical-line"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10 flex flex-col gap-8">
        
        {/* Save Status floating toast */}
        {saveStatus && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-slide-up">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Dashboard Header Banner */}
        <div className="glass-panel w-full rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-[#000080]">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h1 className="font-display text-base font-extrabold text-black/90 uppercase tracking-tight">
                ADMIN DATABASE CMS
              </h1>
              <p className="text-[10px] text-black/50 font-bold uppercase tracking-wider">
                Logged in as Gowrishopanan (ADMINISTRATOR)
              </p>
            </div>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 border border-rose-100 hover:bg-rose-50 rounded-xl text-xs font-extrabold text-rose-600 font-display tracking-widest uppercase transition-colors"
          >
            <LogOut size={13} />
            LOGOUT SYSTEM
          </button>
        </div>

        {/* Navigation Sidebar Tabs + Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CMS Tabs Controls (Left 3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            {[
              { id: 'settings', label: 'GLOBAL VALUES', icon: <Settings2 size={15} /> },
              { id: 'projects', label: 'PROJECTS', icon: <FolderGit2 size={15} /> },
              { id: 'skills', label: 'CAPABILITIES', icon: <Laptop size={15} /> },
              { id: 'education', label: 'ACADEMICS', icon: <GraduationCap size={15} /> },
              { id: 'experience', label: 'EXPERIENCE', icon: <Briefcase size={15} /> },
              { id: 'messages', label: 'INBOX INQUIRIES', icon: <MessageSquare size={15} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); resetProjectForm(); resetExperienceForm(); }}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-display text-xs tracking-widest font-extrabold text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-md'
                    : 'bg-black/5 text-black/70 hover:bg-black/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* CMS Content Edit Section (Right 9 cols) */}
          <div className="lg:col-span-9 bg-white/60 backdrop-blur-md border border-black/5 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5">
            
            {/* 1. SETTINGS CMS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSave} className="flex flex-col gap-6">
                <h3 className="font-display text-base font-extrabold text-black/80 uppercase pb-3 border-b border-black/5 tracking-tight flex items-center gap-2">
                  <Settings2 size={18} className="text-[#000080]" /> Edit Global Profile Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">NAME</label>
                    <input 
                      type="text" 
                      value={settingsForm.name || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">PRIMARY INTERN TITLE</label>
                    <input 
                      type="text" 
                      value={settingsForm.title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">SUBTITLE DECORATOR</label>
                    <input 
                      type="text" 
                      value={settingsForm.subTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, subTitle: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">EMAIL LINK</label>
                    <input 
                      type="email" 
                      value={settingsForm.email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">PHONE CONTACT</label>
                    <input 
                      type="text" 
                      value={settingsForm.phone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">LOCATION STATE</label>
                    <input 
                      type="text" 
                      value={settingsForm.location || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">GITHUB URL</label>
                    <input 
                      type="text" 
                      value={settingsForm.github || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, github: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">LINKEDIN URL</label>
                    <input 
                      type="text" 
                      value={settingsForm.linkedin || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, linkedin: e.target.value })}
                      className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">AVATAR IMAGE URL (CUTOUT PORTRAIT)</label>
                  <input 
                    type="text" 
                    value={settingsForm.avatar || ''}
                    placeholder="https://i.ibb.co/..."
                    onChange={(e) => setSettingsForm({ ...settingsForm, avatar: e.target.value })}
                    className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[9px] tracking-widest font-extrabold text-black/50">PROFESSIONAL BIOGRAPHY STATEMENT</label>
                  <textarea 
                    rows="5"
                    value={settingsForm.bio || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    className="bg-black/5 border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-fit px-8 py-3 bg-black hover:bg-[#000080] text-white font-display text-[10px] tracking-widest font-extrabold rounded-xl transition-all self-end flex items-center gap-2"
                >
                  <Save size={14} /> SAVE GLOBAL SETTINGS
                </button>
              </form>
            )}

            {/* 2. PROJECTS CMS */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                
                {/* Add/Edit form */}
                <form onSubmit={handleProjectSubmit} className="flex flex-col gap-5 border border-black/5 bg-black/5 p-5 rounded-2xl">
                  <h4 className="font-display text-xs tracking-widest font-extrabold text-black/75 uppercase flex items-center gap-2 border-b border-black/5 pb-2">
                    <Plus size={14} className="text-[#000080]" />
                    {editingId ? 'Edit Selected Project Case' : 'Add New Project Case Study'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">TITLE</label>
                      <input 
                        type="text" value={projForm.title} required
                        onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">SUBTITLE DECORATOR</label>
                      <input 
                        type="text" value={projForm.subtitle} required
                        onChange={(e) => setProjForm({ ...projForm, subtitle: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">CATEGORY</label>
                      <input 
                        type="text" value={projForm.category} required placeholder="MERN Stack, Deep Learning..."
                        onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">TECHNOLOGY TAGS (COMMA SEPARATED)</label>
                      <input 
                        type="text" value={projForm.tags} placeholder="React, Node.js, PyTorch"
                        onChange={(e) => setProjForm({ ...projForm, tags: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">GITHUB LINK</label>
                      <input 
                        type="text" value={projForm.githubUrl}
                        onChange={(e) => setProjForm({ ...projForm, githubUrl: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">LIVE DEMO LINK</label>
                      <input 
                        type="text" value={projForm.liveUrl}
                        onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">SHORT DESCRIPTION STATEMENT</label>
                    <textarea 
                      rows="2" value={projForm.description} required
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">KEY SYSTEM ARCHITECTURE / FEATURES (ONE PER LINE)</label>
                    <textarea 
                      rows="3" value={projForm.details} required placeholder="Developed fully responsive e-commerce web platform&#10;Integrated third-party storage plugins"
                      onChange={(e) => setProjForm({ ...projForm, details: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {editingId && (
                      <button 
                        type="button" onClick={resetProjectForm}
                        className="px-4 py-2 border border-black/10 text-black/60 rounded-lg text-xs font-extrabold uppercase font-display tracking-wider"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-black hover:bg-[#000080] text-white rounded-lg text-xs font-extrabold uppercase font-display tracking-wider transition-colors"
                    >
                      {editingId ? 'Update Case Study' : 'Deploy Project Case'}
                    </button>
                  </div>
                </form>

                {/* Projects Inventory */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-display text-[10px] tracking-widest font-extrabold text-black/40 uppercase">ACTIVE CASES LIST ({projects.length})</h4>
                  <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">
                    {projects.map((proj) => (
                      <div key={proj.id || proj._id} className="flex items-center justify-between p-3.5 bg-black/5 rounded-xl border border-black/5">
                        <div className="flex flex-col">
                          <span className="font-display text-xs font-extrabold text-black/85 leading-tight">{proj.title}</span>
                          <span className="font-display text-[9px] tracking-wider font-bold text-black/40 uppercase mt-0.5">{proj.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleEditProject(proj)}
                            className="p-2 text-black/60 hover:text-black bg-white rounded-lg border border-black/5 hover:shadow transition-all"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(proj.id || proj._id)}
                            className="p-2 text-rose-500 hover:text-rose-700 bg-white rounded-lg border border-black/5 hover:shadow transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. SKILLS CMS */}
            {activeTab === 'skills' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                
                {/* Form to Add Skill */}
                <form onSubmit={handleSkillSubmit} className="flex flex-col sm:flex-row items-end gap-4 border border-black/5 bg-black/5 p-4 rounded-xl">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">CAPABILITY NAME</label>
                    <input 
                      type="text" value={skillForm.name} required placeholder="C++, MongoDB..."
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">CATEGORY</label>
                    <select 
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                    >
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Frameworks">Frameworks</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                      <option value="Concepts">Concepts</option>
                      <option value="Software Testing">Software Testing</option>
                      <option value="Editing / Design">Editing / Design</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 w-28">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">PROFICIENCY</label>
                    <select 
                      value={skillForm.level}
                      onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                    >
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="h-10 px-5 bg-black hover:bg-[#000080] text-white rounded-lg text-xs font-extrabold uppercase font-display tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <Plus size={14} /> Add
                  </button>
                </form>

                {/* Skills Grid Inventory */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-display text-[10px] tracking-widest font-extrabold text-black/40 uppercase">ACTIVE SKILLS TOOLKIT ({skills.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
                    {skills.map((skill) => (
                      <div key={skill.id || skill._id} className="flex items-center justify-between p-3 bg-black/5 rounded-xl border border-black/5">
                        <div className="flex flex-col">
                          <span className="font-display text-xs font-extrabold text-black/85 leading-tight">{skill.name}</span>
                          <span className="font-display text-[9px] tracking-wider font-semibold text-black/40 mt-0.5">{skill.category} ({skill.level})</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteSkill(skill.id || skill._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 bg-white rounded-lg border border-black/5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 4. ACADEMICS CMS */}
            {activeTab === 'education' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                
                {/* Form to Add/Edit Edu */}
                <form onSubmit={handleEduSubmit} className="flex flex-col gap-4 border border-black/5 bg-black/5 p-4 rounded-xl">
                  <h4 className="font-display text-xs tracking-widest font-extrabold text-black/75 uppercase flex items-center gap-2 border-b border-black/5 pb-2">
                    <Plus size={14} className="text-[#000080]" /> Add Academic Landmark
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">DEGREE / AWARD</label>
                      <input 
                        type="text" value={eduForm.degree} required placeholder="BSc (Hons) Specialized in software engineering..."
                        onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">TIMEFRAME</label>
                      <input 
                        type="text" value={eduForm.period} required placeholder="2023 - 2025"
                        onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">UNIVERSITY / INSTITUTION</label>
                    <input 
                      type="text" value={eduForm.institution} required placeholder="Sri Lanka Institute of Information Technology (SLIIT)"
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">BRIEF DESCRIPTION STATEMENT</label>
                    <textarea 
                      rows="2" value={eduForm.description} required
                      onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-fit self-end px-5 py-2 bg-black hover:bg-[#000080] text-white rounded-lg text-xs font-extrabold uppercase font-display tracking-wider transition-colors"
                  >
                    Deploy Academic Record
                  </button>
                </form>

                {/* Academics Inventory */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-display text-[10px] tracking-widest font-extrabold text-black/40 uppercase">ACTIVE ACADEMIC LANDMARKS ({education.length})</h4>
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {education.map((edu) => (
                      <div key={edu.id || edu._id} className="flex items-center justify-between p-3.5 bg-black/5 rounded-xl border border-black/5">
                        <div className="flex flex-col">
                          <span className="font-display text-xs font-extrabold text-black/85 leading-tight">{edu.degree}</span>
                          <span className="font-display text-[9px] tracking-wider font-bold text-black/40 mt-0.5">{edu.institution} ({edu.period})</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteEdu(edu.id || edu._id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 bg-white rounded-lg border border-black/5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 5. EXPERIENCE CMS */}
            {activeTab === 'experience' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                
                {/* Form to Add/Edit Experience */}
                <form onSubmit={handleExpSubmit} className="flex flex-col gap-4 border border-black/5 bg-black/5 p-4 rounded-xl">
                  <h4 className="font-display text-xs tracking-widest font-extrabold text-black/75 uppercase flex items-center gap-2 border-b border-black/5 pb-2">
                    <Plus size={14} className="text-[#000080]" />
                    {editingId ? 'Edit Selected Experience' : 'Add Work Experience Record'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">ROLE / POSITION</label>
                      <input 
                        type="text" value={expForm.role} required placeholder="Lead UI/UX Designer..."
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">COMPANY / ORGANISATION</label>
                      <input 
                        type="text" value={expForm.company} required placeholder="Google..."
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">TIMEFRAME</label>
                      <input 
                        type="text" value={expForm.period} required placeholder="Jan 2024 - Present"
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">LOCATION</label>
                      <input 
                        type="text" value={expForm.location} required placeholder="Colombo, Sri Lanka"
                        onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                        className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">EXPERIENCE TYPE</label>
                    <select 
                      value={expForm.type}
                      onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3 py-2 text-xs font-semibold transition-all w-full sm:w-48"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-display text-[8.5px] tracking-wider font-extrabold text-black/40">RESPONSIBILITIES / PROJECTS ACCOMPLISHED (ONE PER LINE)</label>
                    <textarea 
                      rows="3" value={expForm.details} required placeholder="Designed core interface logic using React&#10;Mentored new junior developers"
                      onChange={(e) => setExpForm({ ...expForm, details: e.target.value })}
                      className="bg-white border border-black/5 focus:border-[#000080]/30 outline-none rounded-xl px-3.5 py-2 text-xs font-semibold transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    {editingId && (
                      <button 
                        type="button" onClick={resetExperienceForm}
                        className="px-4 py-2 border border-black/10 text-black/60 rounded-lg text-xs font-extrabold uppercase font-display tracking-wider"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-black hover:bg-[#000080] text-white rounded-lg text-xs font-extrabold uppercase font-display tracking-wider transition-colors"
                    >
                      {editingId ? 'Update Record' : 'Deploy Experience Record'}
                    </button>
                  </div>
                </form>

                {/* Experience Inventory */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-display text-[10px] tracking-widest font-extrabold text-black/40 uppercase">ACTIVE EXPERIENCE RECORDS ({experience.length})</h4>
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {experience.map((exp) => (
                      <div key={exp.id || exp._id} className="flex items-center justify-between p-3.5 bg-black/5 rounded-xl border border-black/5">
                        <div className="flex flex-col">
                          <span className="font-display text-xs font-extrabold text-black/85 leading-tight">{exp.role}</span>
                          <span className="font-display text-[9px] tracking-wider font-bold text-black/40 mt-0.5">{exp.company} ({exp.period}) — {exp.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleEditExperience(exp)}
                            className="p-2 text-black/60 hover:text-black bg-white rounded-lg border border-black/5 hover:shadow transition-all"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteExperience(exp.id || exp._id)}
                            className="p-2 text-rose-500 hover:text-rose-700 bg-white rounded-lg border border-black/5 hover:shadow transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 6. INCOMING MESSAGES CMS */}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <h3 className="font-display text-base font-extrabold text-black/80 uppercase pb-3 border-b border-black/5 tracking-tight flex items-center gap-2">
                  <MessageSquare size={18} className="text-[#000080]" /> Despatched Inquiries Database ({messages.length})
                </h3>

                <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-2">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-black/40 font-semibold text-xs leading-relaxed">
                      Your inbox console is currently empty.<br />Visitor messages will be routed here!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id || msg._id} className="glass-panel p-5 rounded-2xl flex flex-col gap-3 relative border border-black/5 group hover:border-[#000080]/30 transition-all">
                        
                        {/* Delete message absolute icon */}
                        <button 
                          onClick={() => handleDeleteMsg(msg.id || msg._id)}
                          className="absolute top-4 right-4 p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="flex flex-col gap-0.5">
                          <span className="font-display text-[8.5px] tracking-widest font-extrabold text-[#000080] uppercase">
                            Date: {new Date(msg.date).toLocaleDateString()} at {new Date(msg.date).toLocaleTimeString()}
                          </span>
                          <h4 className="font-display text-sm font-extrabold text-black/90 tracking-tight">
                            From: {msg.name} ({msg.email})
                          </h4>
                        </div>

                        <p className="text-xs text-black/80 font-medium leading-relaxed bg-black/5 p-3 rounded-xl border border-black/5">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
