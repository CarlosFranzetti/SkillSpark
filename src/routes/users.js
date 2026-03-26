const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Skill = require('../models/skill');

router.get('/users/:id', (req, res) => {
  try {
    const user = User.findWithSkills(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/matches', (req, res) => {
  try {
    const matches = Skill.findMatches();
    res.render('matches', { matches });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
