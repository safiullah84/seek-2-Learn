require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');
const path     = require('path');
const favicon  = require('serve-favicon');
const app  = express();
const PORT = process.env.PORT || 3000;
const sql  = neon(process.env.DATABASE_URL);
app.use(cors());
app.use(express.json());
app.use(favicon(path.join(__dirname, 'assets', 'image', 'favicon.png')));
app.use(express.static(path.join(__dirname)));
async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      full_name     VARCHAR(120)  NOT NULL,
      email         VARCHAR(255)  UNIQUE NOT NULL,
      password_hash VARCHAR(255)  NOT NULL,
      created_at    TIMESTAMP     DEFAULT NOW()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS contacts (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(120)  NOT NULL,
      email      VARCHAR(255)  NOT NULL,
      subject    VARCHAR(255)  NOT NULL,
      message    TEXT          NOT NULL,
      created_at TIMESTAMP     DEFAULT NOW()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS courses (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255) NOT NULL,
      description TEXT         NOT NULL,
      instructor  VARCHAR(120) NOT NULL,
      price       INTEGER      NOT NULL,
      rating      DECIMAL(2,1) DEFAULT 4.5,
      students    INTEGER      DEFAULT 0,
      category    VARCHAR(100) NOT NULL,
      tag         VARCHAR(50),
      gradient    VARCHAR(100),
      emoji       VARCHAR(10),
      duration    VARCHAR(50),
      lessons     INTEGER      DEFAULT 0,
      level       VARCHAR(50)  DEFAULT 'Beginner',
      created_at  TIMESTAMP    DEFAULT NOW()
    )`;
    const existing = await sql`SELECT COUNT(*) as count FROM courses`;
    if (parseInt(existing[0].count) === 0) {
      await sql`INSERT INTO courses (title, description, instructor, price, rating, students, category, tag, gradient, emoji, duration, lessons, level) VALUES
        ('UI/UX Design Masterclass', 'Learn Figma, design systems, and user research to build products people love.', 'Sarah Chen', 1499, 4.9, 3200, 'Design', 'Bestseller', 'linear-gradient(135deg,#667eea,#764ba2)', '🎨', '42 hours', 86, 'Beginner'),
        ('AI & Prompt Engineering', 'Master ChatGPT, Claude, and Midjourney to supercharge your productivity and career.', 'Rahul Verma', 1299, 4.8, 5100, 'Technology', 'Hot 🔥', 'linear-gradient(135deg,#f7971e,#ffd200)', '🤖', '28 hours', 54, 'Intermediate'),
        ('Full-Stack Web Development', 'Go from zero to job-ready with HTML, CSS, JavaScript, React, and Node.js.', 'Priya Sharma', 2199, 4.9, 7800, 'Development', 'New', 'linear-gradient(135deg,#11998e,#38ef7d)', '💻', '68 hours', 142, 'Beginner'),
        ('Data Analytics with Python', 'Learn pandas, matplotlib, and SQL to turn raw data into powerful business insights.', 'Amit Patel', 1799, 4.7, 4400, 'Data Science', 'Popular', 'linear-gradient(135deg,#e8604c,#ff9a8b)', '📊', '36 hours', 78, 'Intermediate'),
        ('Mobile App Development', 'Build iOS & Android apps using React Native — with real projects and app store deployment.', 'Neha Gupta', 1999, 4.8, 2900, 'Development', 'Trending', 'linear-gradient(135deg,#4facfe,#00f2fe)', '📱', '52 hours', 96, 'Intermediate'),
        ('Digital Marketing Strategy', 'SEO, paid ads, email funnels, and analytics — the complete modern marketing toolkit.', 'Vikram Singh', 999, 4.6, 3600, 'Marketing', 'Expert', 'linear-gradient(135deg,#5b2e91,#9b59b6)', '🎯', '32 hours', 64, 'Beginner'),
        ('Cloud Computing with AWS', 'Master AWS services including EC2, S3, Lambda, and DynamoDB.', 'Karthik Nair', 2499, 4.8, 2100, 'Technology', 'Advanced', 'linear-gradient(135deg,#ff6b6b,#ee5a24)', '☁️', '48 hours', 92, 'Advanced'),
        ('Cybersecurity Fundamentals', 'Learn ethical hacking, network security, and incident response.', 'Arjun Reddy', 1899, 4.7, 1800, 'Technology', 'In Demand', 'linear-gradient(135deg,#2c3e50,#3498db)', '🔒', '40 hours', 74, 'Beginner')`;
    }
    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await sql`
      INSERT INTO users (full_name, email, password_hash)
      VALUES (${fullName}, ${email}, ${passwordHash})
      RETURNING id, full_name, email, created_at
    `;
    res.status(201).json({
      message: 'Account created successfully!',
      user: result[0]
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    await sql`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;
    res.status(201).json({ message: 'Thank you! Your message has been received.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Could not send message. Please try again.' });
  }
});
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await sql`SELECT * FROM courses ORDER BY id`;
    res.json(courses);
  } catch (err) {
    console.error('Courses error:', err);
    res.status(500).json({ error: 'Could not load courses.' });
  }
});
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await sql`SELECT * FROM courses WHERE id = ${req.params.id}`;
    if (course.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course[0]);
  } catch (err) {
    console.error('Course error:', err);
    res.status(500).json({ error: 'Could not load course.' });
  }
});
app.get('/pages/*', (req, res) => {
  const page = req.path;
  res.sendFile(path.join(__dirname, page));
});
app.listen(PORT, async () => {
  console.log(`🚀 Seek2Learn server running at http://localhost:${PORT}`);
  await initDB();
});
