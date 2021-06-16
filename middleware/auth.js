const jwt = require('jsonwebtoken');
/* const passwordSchema = require('../models/Password');
"use strict";

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
      return res.status(400).json({ error: 'Mot de passe pas assez fort ! ' + passwordSchema.validate(req.body.password, { list: true }) });
  } else {
      next();
  }
}; */


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({error: error | 'Requête non authentifiée !'});
  }
};