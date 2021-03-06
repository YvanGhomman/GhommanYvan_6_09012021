const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
require('dotenv').config();
var CryptoJS = require("crypto-js");



exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: /* CryptoJS.AES.encrypt( */req.body.email/* , 'secret key 123').salt */,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
  /* var bytes  = CryptoJS.AES.decrypt(email, 'secret key 123');
  /* var originalText = bytes.toString(CryptoJS.enc.Utf8); */
  User.findOne({ email: /* CryptoJS.AES.encrypt( */req.body.email/* /* , 'secret key 123').salt */} )
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.DB_TOK,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};