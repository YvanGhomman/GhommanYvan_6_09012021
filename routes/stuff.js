const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');


router.post('/', auth, multer, stuffCtrl.createThing);  
router.put('/:id', auth, multer, stuffCtrl.modifyThing); 
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllThings);
router.post('/:id/like', auth, stuffCtrl.likeOrDislikeSauce);

/* router.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
  });
  
router.use((req, res, next) => {
    res.status(201);
    next();
  });
  
router.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
  });
  
router.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
  }); */

module.exports = router;