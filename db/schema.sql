CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(120)  NOT NULL,
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  subject    VARCHAR(255)  NOT NULL,
  message    TEXT          NOT NULL,
  created_at TIMESTAMP     DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS courses (
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
);
INSERT INTO courses (title, description, instructor, price, rating, students, category, tag, gradient, emoji, duration, lessons, level) VALUES
('UI/UX Design Masterclass', 'Learn Figma, design systems, and user research to build products people love. Master wireframing, prototyping, and usability testing with real-world projects.', 'Sarah Chen', 1499, 4.9, 3200, 'Design', 'Bestseller', 'linear-gradient(135deg,#667eea,#764ba2)', '🎨', '42 hours', 86, 'Beginner'),
('AI & Prompt Engineering', 'Master ChatGPT, Claude, and Midjourney to supercharge your productivity and career. Learn advanced prompting techniques and AI workflow automation.', 'Rahul Verma', 1299, 4.8, 5100, 'Technology', 'Hot 🔥', 'linear-gradient(135deg,#f7971e,#ffd200)', '🤖', '28 hours', 54, 'Intermediate'),
('Full-Stack Web Development', 'Go from zero to job-ready with HTML, CSS, JavaScript, React, and Node.js. Build 10+ real projects including an e-commerce platform.', 'Priya Sharma', 2199, 4.9, 7800, 'Development', 'New', 'linear-gradient(135deg,#11998e,#38ef7d)', '💻', '68 hours', 142, 'Beginner'),
('Data Analytics with Python', 'Learn pandas, matplotlib, and SQL to turn raw data into powerful business insights. Includes real datasets from industry partners.', 'Amit Patel', 1799, 4.7, 4400, 'Data Science', 'Popular', 'linear-gradient(135deg,#e8604c,#ff9a8b)', '📊', '36 hours', 78, 'Intermediate'),
('Mobile App Development', 'Build iOS & Android apps using React Native — with real projects and app store deployment. Learn navigation, state management, and native modules.', 'Neha Gupta', 1999, 4.8, 2900, 'Development', 'Trending', 'linear-gradient(135deg,#4facfe,#00f2fe)', '📱', '52 hours', 96, 'Intermediate'),
('Digital Marketing Strategy', 'SEO, paid ads, email funnels, and analytics — the complete modern marketing toolkit. Learn to drive growth for any business or startup.', 'Vikram Singh', 999, 4.6, 3600, 'Marketing', 'Expert', 'linear-gradient(135deg,#5b2e91,#9b59b6)', '🎯', '32 hours', 64, 'Beginner'),
('Cloud Computing with AWS', 'Master AWS services including EC2, S3, Lambda, and DynamoDB. Prepare for AWS Solutions Architect certification with hands-on labs.', 'Karthik Nair', 2499, 4.8, 2100, 'Technology', 'Advanced', 'linear-gradient(135deg,#ff6b6b,#ee5a24)', '☁️', '48 hours', 92, 'Advanced'),
('Cybersecurity Fundamentals', 'Learn ethical hacking, network security, and incident response. Gain skills to protect organizations from modern cyber threats.', 'Arjun Reddy', 1899, 4.7, 1800, 'Technology', 'In Demand', 'linear-gradient(135deg,#2c3e50,#3498db)', '🔒', '40 hours', 74, 'Beginner');
