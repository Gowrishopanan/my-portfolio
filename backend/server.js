// Trigger nodemon reload for MongoDB Atlas connection
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretportfoliojwttokengowrishopanan';
const DB_JSON_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// --- Database Engine Setup ---
let isMongoConnected = false;

// Fallback JSON-based Database helper functions
const readJSONDb = () => {
  try {
    const raw = fs.readFileSync(DB_JSON_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return { settings: {}, projects: [], skills: [], education: [], references: [], messages: [] };
  }
};

const writeJSONDb = (data) => {
  try {
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to local JSON db:', err);
  }
};
// Connect to MongoDB if MONGO_URI is set
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('💚 Connected to MongoDB Atlas successfully.');
      isMongoConnected = true;
      
      // Auto-seeding cloud database if empty
      try {
        const settingsCount = await Setting.countDocuments();
        if (settingsCount === 0) {
          console.log('🌱 Cloud database is empty. Seeding CV details from db.json...');
          const db = readJSONDb();
          
          if (db.settings && Object.keys(db.settings).length > 0) {
            await new Setting(db.settings).save();
          }
          if (db.projects && db.projects.length > 0) {
            const projs = db.projects.map(({ id, ...rest }) => rest);
            await Project.insertMany(projs);
          }
          if (db.skills && db.skills.length > 0) {
            const sks = db.skills.map(({ id, ...rest }) => rest);
            await Skill.insertMany(sks);
          }
          if (db.education && db.education.length > 0) {
            const edus = db.education.map(({ id, ...rest }) => rest);
            await Education.insertMany(edus);
          }
          if (db.experience && db.experience.length > 0) {
            const exps = db.experience.map(({ id, ...rest }) => rest);
            await Experience.insertMany(exps);
          }
          if (db.references && db.references.length > 0) {
            const refs = db.references.map(({ id, ...rest }) => rest);
            await Reference.insertMany(refs);
          }
          console.log('🚀 Cloud database successfully seeded with CV data!');
        } else {
          // Targeted check to see if experience is missing even if other collections exist
          const experienceCount = await Experience.countDocuments();
          if (experienceCount === 0) {
            console.log('🌱 Cloud Experience is empty. Seeding experience from db.json...');
            const db = readJSONDb();
            if (db.experience && db.experience.length > 0) {
              const exps = db.experience.map(({ id, ...rest }) => rest);
              await Experience.insertMany(exps);
              console.log('🚀 Experience successfully seeded to MongoDB Atlas!');
            }
          }
        }
      } catch (seedErr) {
        console.error('Failed to auto-seed cloud database:', seedErr);
      }
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection failed. Falling back to Local JSON database.');
      console.error(err);
    });
} else {
  console.log('ℹ️ No MONGO_URI specified. Operating in Local JSON Database Fallback mode.');
}
// Defining MongoDB Schemas for standard MERN compatibility
const SettingSchema = new mongoose.Schema({
  name: String, title: String, subTitle: String, bio: String,
  email: String, phone: String, location: String, github: String, linkedin: String, avatar: String
});
const ProjectSchema = new mongoose.Schema({
  title: String, subtitle: String, category: String, description: String,
  details: [String], tags: [String], liveUrl: String, githubUrl: String
});
const SkillSchema = new mongoose.Schema({
  name: String, category: String, level: String
});
const EducationSchema = new mongoose.Schema({
  degree: String, institution: String, period: String, description: String
});
const ExperienceSchema = new mongoose.Schema({
  role: String, company: String, period: String, location: String, type: String, details: [String]
});
const ReferenceSchema = new mongoose.Schema({
  name: String, title: String, organization: String, email: String, phone: String
});
const MessageSchema = new mongoose.Schema({
  name: String, email: String, message: String, date: { type: Date, default: Date.now }
});

const Setting = mongoose.model('Setting', SettingSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Skill = mongoose.model('Skill', SkillSchema);
const Education = mongoose.model('Education', EducationSchema);
const Experience = mongoose.model('Experience', ExperienceSchema);
const Reference = mongoose.model('Reference', ReferenceSchema);
const Message = mongoose.model('Message', MessageSchema);

// --- JWT Verification Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const envUsername = process.env.ADMIN_USERNAME || 'admin';
  const envPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (username === envUsername && password === envPassword) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Invalid credentials. Please try again!' });
});

// Verify token validity
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- PORTFOLIO DATA GETTER ---
app.get('/api/portfolio', async (req, res) => {
  if (isMongoConnected) {
    try {
      const settings = await Setting.findOne().maxTimeMS(2000) || {};
      const projects = await Project.find().maxTimeMS(2000);
      const skills = await Skill.find().maxTimeMS(2000);
      const education = await Education.find().maxTimeMS(2000);
      const experience = await Experience.find().maxTimeMS(2000);
      const references = await Reference.find().maxTimeMS(2000);
      return res.json({ settings, projects, skills, education, experience, references });
    } catch (err) {
      console.warn('⚠️ MongoDB Atlas query timed out or failed. Falling back to local JSON database.');
      const db = readJSONDb();
      return res.json({
        settings: db.settings,
        projects: db.projects,
        skills: db.skills,
        education: db.education,
        experience: db.experience || [],
        references: db.references
      });
    }
  } else {
    // Fallback Local JSON database
    const db = readJSONDb();
    return res.json({
      settings: db.settings,
      projects: db.projects,
      skills: db.skills,
      education: db.education,
      experience: db.experience || [],
      references: db.references
    });
  }
});

// --- PROJECTS CRUD ---
app.post('/api/projects', authenticateToken, async (req, res) => {
  const data = req.body;
  if (isMongoConnected) {
    try {
      const newProj = new Project(data);
      await newProj.save();
      return res.status(201).json(newProj);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const newProj = { id: 'proj_' + Date.now(), ...data };
    db.projects.push(newProj);
    writeJSONDb(db);
    return res.status(201).json(newProj);
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (isMongoConnected) {
    try {
      const updated = await Project.findByIdAndUpdate(id, data, { new: true });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ message: 'Project not found' });
    db.projects[index] = { ...db.projects[index], ...data };
    writeJSONDb(db);
    return res.json(db.projects[index]);
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      await Project.findByIdAndDelete(id);
      return res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const filtered = db.projects.filter(p => p.id !== id);
    db.projects = filtered;
    writeJSONDb(db);
    return res.json({ message: 'Project deleted successfully' });
  }
});

// --- SKILLS CRUD ---
app.post('/api/skills', authenticateToken, async (req, res) => {
  const data = req.body;
  if (isMongoConnected) {
    try {
      const newSkill = new Skill(data);
      await newSkill.save();
      return res.status(201).json(newSkill);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const newSkill = { id: 'skill_' + Date.now(), ...data };
    db.skills.push(newSkill);
    writeJSONDb(db);
    return res.status(201).json(newSkill);
  }
});

app.put('/api/skills/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (isMongoConnected) {
    try {
      const updated = await Skill.findByIdAndUpdate(id, data, { new: true });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const index = db.skills.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ message: 'Skill not found' });
    db.skills[index] = { ...db.skills[index], ...data };
    writeJSONDb(db);
    return res.json(db.skills[index]);
  }
});

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      await Skill.findByIdAndDelete(id);
      return res.json({ message: 'Skill deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const filtered = db.skills.filter(s => s.id !== id);
    db.skills = filtered;
    writeJSONDb(db);
    return res.json({ message: 'Skill deleted successfully' });
  }
});

// --- EDUCATION CRUD ---
app.post('/api/education', authenticateToken, async (req, res) => {
  const data = req.body;
  if (isMongoConnected) {
    try {
      const newEdu = new Education(data);
      await newEdu.save();
      return res.status(201).json(newEdu);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const newEdu = { id: 'edu_' + Date.now(), ...data };
    db.education.push(newEdu);
    writeJSONDb(db);
    return res.status(201).json(newEdu);
  }
});

app.put('/api/education/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (isMongoConnected) {
    try {
      const updated = await Education.findByIdAndUpdate(id, data, { new: true });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const index = db.education.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ message: 'Education item not found' });
    db.education[index] = { ...db.education[index], ...data };
    writeJSONDb(db);
    return res.json(db.education[index]);
  }
});

app.delete('/api/education/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      await Education.findByIdAndDelete(id);
      return res.json({ message: 'Education item deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const filtered = db.education.filter(e => e.id !== id);
    db.education = filtered;
    writeJSONDb(db);
    return res.json({ message: 'Education item deleted successfully' });
  }
});

// --- EXPERIENCE CRUD ---
app.post('/api/experience', authenticateToken, async (req, res) => {
  const data = req.body;
  if (isMongoConnected) {
    try {
      const newExp = new Experience(data);
      await newExp.save();
      return res.status(201).json(newExp);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    if (!db.experience) db.experience = [];
    const newExp = { id: 'exp_' + Date.now(), ...data };
    db.experience.push(newExp);
    writeJSONDb(db);
    return res.status(201).json(newExp);
  }
});

app.put('/api/experience/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  if (isMongoConnected) {
    try {
      const updated = await Experience.findByIdAndUpdate(id, data, { new: true });
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    if (!db.experience) db.experience = [];
    const index = db.experience.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ message: 'Experience item not found' });
    db.experience[index] = { ...db.experience[index], ...data };
    writeJSONDb(db);
    return res.json(db.experience[index]);
  }
});

app.delete('/api/experience/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      await Experience.findByIdAndDelete(id);
      return res.json({ message: 'Experience item deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    if (!db.experience) db.experience = [];
    const filtered = db.experience.filter(e => e.id !== id);
    db.experience = filtered;
    writeJSONDb(db);
    return res.json({ message: 'Experience item deleted successfully' });
  }
});

// --- SETTINGS CRUD ---
app.put('/api/settings', authenticateToken, async (req, res) => {
  const data = req.body;
  if (isMongoConnected) {
    try {
      let settings = await Setting.findOne();
      if (!settings) {
        settings = new Setting(data);
      } else {
        Object.assign(settings, data);
      }
      await settings.save();
      return res.json(settings);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    db.settings = { ...db.settings, ...data };
    writeJSONDb(db);
    return res.json(db.settings);
  }
});

// --- CONTACT MESSAGES ---
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all details' });
  }
  
  const msgObj = { name, email, message, date: new Date().toISOString() };

  if (isMongoConnected) {
    try {
      const newMsg = new Message(msgObj);
      await newMsg.save();
      return res.status(201).json({ message: 'Message sent successfully!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    if (!db.messages) db.messages = [];
    const newMsg = { id: 'msg_' + Date.now(), ...msgObj };
    db.messages.push(newMsg);
    writeJSONDb(db);
    return res.status(201).json({ message: 'Message sent successfully!' });
  }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
  if (isMongoConnected) {
    try {
      const messages = await Message.find().sort({ date: -1 });
      return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    const msgs = db.messages || [];
    // Sort descending by date
    msgs.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.json(msgs);
  }
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (isMongoConnected) {
    try {
      await Message.findByIdAndDelete(id);
      return res.json({ message: 'Message deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    const db = readJSONDb();
    if (db.messages) {
      db.messages = db.messages.filter(m => m.id !== id);
      writeJSONDb(db);
    }
    return res.json({ message: 'Message deleted successfully' });
  }
});

// Serve static frontend assets from Vite build folder
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback all other GET requests to index.html (React SPA routing support)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  res.status(404).send('API endpoint not found');
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
