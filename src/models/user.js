const db = require('../db');

const User = {
  findAll() {
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  create(data) {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, location, bio) VALUES (@name, @email, @location, @bio)'
    );
    const result = stmt.run(data);
    return this.findById(result.lastInsertRowid);
  },

  findWithSkills(id) {
    const user = this.findById(id);
    if (!user) return null;
    const skills = db.prepare('SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC').all(id);
    return { ...user, skills };
  },
};

module.exports = User;
