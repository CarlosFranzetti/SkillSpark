process.env.NODE_ENV = 'test';
const User = require('../src/models/user');
const Skill = require('../src/models/skill');

describe('User model', () => {
  test('create and findById', () => {
    const user = User.create({
      name: 'Alice',
      email: 'alice@test.com',
      location: 'NYC',
      bio: 'Hello'
    });
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    const found = User.findById(user.id);
    expect(found.name).toBe('Alice');
    expect(found.email).toBe('alice@test.com');
  });

  test('findAll returns array', () => {
    const users = User.findAll();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });
});

describe('Skill model', () => {
  test('create and findByUser', () => {
    const user = User.create({
      name: 'Bob',
      email: 'bob@test.com',
      location: 'LA',
      bio: ''
    });
    const skill = Skill.create({
      user_id: user.id,
      title: 'Guitar',
      type: 'teach',
      description: 'Teach guitar',
      category: 'Music'
    });
    expect(skill).toBeDefined();
    expect(skill.id).toBeDefined();
    const skills = Skill.findByUser(user.id);
    expect(skills.length).toBe(1);
    expect(skills[0].title).toBe('Guitar');
  });

  test('findMatches returns array', () => {
    const matches = Skill.findMatches();
    expect(Array.isArray(matches)).toBe(true);
  });
});
