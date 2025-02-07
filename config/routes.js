const axios = require('axios');
const bcrypt = require("bcryptjs");

const { authenticate, createToken } = require('../auth/authenticate');
const Users = require("./users-model");

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.addUser(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
}

function login(req, res) {
  const { username, password } = req.body;

  Users.getUserBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = createToken(user);

        res.status(200).json({
          message: `Hey ${username}!`,
          token
        });
      } else {
        res.status(401).json({ message: 'Invalid username or password.' });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
