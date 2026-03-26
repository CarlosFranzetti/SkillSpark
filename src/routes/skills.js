const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Skill = require('../models/skill');

const CATEGORIES = ['Technology', 'Music', 'Language', 'Art', 'Sports', 'Cooking', 'Other'];

router.get('/board', (req, res) => {
  try {
    const { type, category, search } = req.query;
    const allUsers = User.findAll();

    const usersWithSkills = allUsers.map(user => {
      let skills = Skill.findByUser(user.id);

      if (type) skills = skills.filter(s => s.type === type);
      if (category) skills = skills.filter(s => s.category === category);
      if (search) {
        const term = search.toLowerCase();
        skills = skills.filter(s =>
          s.title.toLowerCase().includes(term) ||
          (s.description && s.description.toLowerCase().includes(term)) ||
          user.name.toLowerCase().includes(term)
        );
      }

      return { ...user, skills };
    }).filter(user => {
      if (type || category || search) return user.skills.length > 0;
      return true;
    });

    res.render('board', { users: usersWithSkills, filters: req.query, categories: CATEGORIES });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/board/post', (req, res) => {
  try {
    res.render('post', { categories: CATEGORIES, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/board/post', (req, res) => {
  try {
    const { name, email, location, bio, title, type, description, category } = req.body;

    let user;
    try {
      user = User.create({ name, email, location: location || '', bio: bio || '' });
    } catch (e) {
      // Email already exists, find existing user
      const allUsers = User.findAll();
      user = allUsers.find(u => u.email === email);
    }

    if (!user) {
      return res.status(400).render('post', { categories: CATEGORIES, error: 'Could not create or find user.' });
    }

    Skill.create({
      user_id: user.id,
      title,
      type,
      description: description || '',
      category: category || 'Other',
    });

    res.redirect('/board');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
