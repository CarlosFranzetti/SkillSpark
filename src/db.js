const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '..', 'skillswap.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    location TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if tables are empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, location, bio) VALUES (?, ?, ?, ?)'
  );
  const insertSkill = db.prepare(
    'INSERT INTO skills (user_id, title, type, description, category) VALUES (?, ?, ?, ?, ?)'
  );

  const seedData = [
    {
      user: ['Alice Johnson', 'alice@example.com', 'New York, NY', 'Software engineer who loves music'],
      skills: [
        ['JavaScript Fundamentals', 'teach', 'I can teach JS basics to advanced', 'Technology'],
        ['Guitar Lessons', 'learn', 'Want to learn acoustic guitar', 'Music'],
      ],
    },
    {
      user: ['Bob Martinez', 'bob@example.com', 'Los Angeles, CA', 'Musician and tech enthusiast'],
      skills: [
        ['Guitar & Music Theory', 'teach', 'Professional guitarist, 10 years experience', 'Music'],
        ['Web Development', 'learn', 'Looking to learn modern web dev', 'Technology'],
      ],
    },
    {
      user: ['Carol Chen', 'carol@example.com', 'San Francisco, CA', 'Polyglot and artist'],
      skills: [
        ['Mandarin Chinese', 'teach', 'Native speaker, can teach conversational Mandarin', 'Language'],
        ['Watercolor Painting', 'learn', 'Interested in learning watercolor techniques', 'Art'],
      ],
    },
    {
      user: ['Dave Kim', 'dave@example.com', 'Chicago, IL', 'Artist and language learner'],
      skills: [
        ['Watercolor & Oil Painting', 'teach', 'Fine arts degree, teaching painting for 5 years', 'Art'],
        ['Korean Language', 'learn', 'Want to learn Korean for travel', 'Language'],
      ],
    },
    {
      user: ['Eve Thompson', 'eve@example.com', 'Austin, TX', 'Chef and fitness enthusiast'],
      skills: [
        ['Italian Cooking', 'teach', 'Trained in Italian cuisine, love sharing recipes', 'Cooking'],
        ['Yoga & Flexibility', 'learn', 'Looking to start a yoga practice', 'Sports'],
      ],
    },
    {
      user: ['Frank Wilson', 'frank@example.com', 'Seattle, WA', 'Fitness trainer who loves food'],
      skills: [
        ['Yoga & Fitness Training', 'teach', 'Certified yoga instructor and personal trainer', 'Sports'],
        ['Home Cooking', 'learn', 'Want to learn to cook healthy meals at home', 'Cooking'],
      ],
    },
  ];

  for (const entry of seedData) {
    const result = insertUser.run(...entry.user);
    const userId = result.lastInsertRowid;
    for (const skill of entry.skills) {
      insertSkill.run(userId, ...skill);
    }
  }
}

module.exports = db;
