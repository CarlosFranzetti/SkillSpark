const db = require('../db');

const Skill = {
  findAll(filters = {}) {
    let query = 'SELECT s.*, u.name as user_name, u.location FROM skills s JOIN users u ON s.user_id = u.id';
    const conditions = [];
    const params = [];

    if (filters.type) {
      conditions.push('s.type = ?');
      params.push(filters.type);
    }
    if (filters.category) {
      conditions.push('s.category = ?');
      params.push(filters.category);
    }
    if (filters.search) {
      conditions.push('(s.title LIKE ? OR s.description LIKE ? OR u.name LIKE ?)');
      const term = `%${filters.search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY s.created_at DESC';

    return db.prepare(query).all(...params);
  },

  findByUser(userId) {
    return db.prepare('SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  },

  create(data) {
    const stmt = db.prepare(
      'INSERT INTO skills (user_id, title, type, description, category) VALUES (@user_id, @title, @type, @description, @category)'
    );
    const result = stmt.run(data);
    return db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid);
  },

  findMatches() {
    const teachSkills = db.prepare(
      "SELECT s.*, u.name as user_name, u.location FROM skills s JOIN users u ON s.user_id = u.id WHERE s.type = 'teach'"
    ).all();
    const learnSkills = db.prepare(
      "SELECT s.*, u.name as user_name, u.location FROM skills s JOIN users u ON s.user_id = u.id WHERE s.type = 'learn'"
    ).all();

    const matches = [];
    const seen = new Set();

    for (const teach of teachSkills) {
      for (const learn of learnSkills) {
        if (teach.user_id === learn.user_id) continue;
        if (teach.category !== learn.category) continue;

        // User teach.user_id teaches what learn.user_id wants to learn
        // Now check if learn.user_id teaches something that teach.user_id wants to learn
        const reverseCheck = db.prepare(
          "SELECT s1.category FROM skills s1 JOIN skills s2 ON s1.category = s2.category WHERE s1.user_id = ? AND s1.type = 'teach' AND s2.user_id = ? AND s2.type = 'learn'"
        ).all(learn.user_id, teach.user_id);

        if (reverseCheck.length > 0) {
          const pairKey = [Math.min(teach.user_id, learn.user_id), Math.max(teach.user_id, learn.user_id)].join('-');
          if (!seen.has(pairKey)) {
            seen.add(pairKey);
            const userA = db.prepare('SELECT * FROM users WHERE id = ?').get(teach.user_id);
            const userB = db.prepare('SELECT * FROM users WHERE id = ?').get(learn.user_id);
            const userASkills = db.prepare('SELECT * FROM skills WHERE user_id = ?').all(teach.user_id);
            const userBSkills = db.prepare('SELECT * FROM skills WHERE user_id = ?').all(learn.user_id);
            matches.push({
              userA: { ...userA, skills: userASkills },
              userB: { ...userB, skills: userBSkills },
              sharedTeachLearn: [...new Set(reverseCheck.map(r => r.category).concat([teach.category]))],
            });
          }
        }
      }
    }
    return matches;
  },
};

module.exports = Skill;
