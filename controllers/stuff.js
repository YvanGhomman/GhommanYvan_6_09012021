const Thing = require('../models/Thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  };

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }: { ...req.body };

  //delete old image if changing image
    if(req.file !== undefined){
      Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          console.log("L'image d'origine a bien été supprimée");                                
        })})
      .catch(error => res.status(500).json({ error }));
    };

  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
  .then(thing => {
    const filename = thing.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
    });
})
.catch(error => res.status(500).json({ error }));
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  };

exports.getAllThings = (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };


exports.likeOrDislikeSauce = async(req, res, next)=>{
      const userId = req.body.userId;
      const likes = req.body.like;
      const id = req.params.id;
      const sauce = await Thing.findOne({ _id: req.params.id });
      
      switch (likes) {
        case 1: // case if like=1
          
            if (!sauce.usersLiked.includes(userId)) {//check if user is already in usersLiked array
              await Thing.findByIdAndUpdate(id, { $inc: {likes: 1}, $push: {usersLiked: userId}}) // incremente like and push user in  []usersLiked
              .then(() => res.status(201).json({ message: 'vous avez aimé cette sauce !'}))
              .catch(error => res.status(400).json({ error }));    
          }  
        break;
  
        case 0: // case if like =0
             
            if (sauce.usersLiked.includes(userId)){ // if user is already in userLiked , decremente like and pull user from array
              await Thing.findByIdAndUpdate(id, { $inc: {likes: -1}, $pull: {usersLiked: userId}})
              .then(() => res.status(201).json({ message: 'Like retiré !'}))
              .catch(error => res.status(400).json({ error }));  
              break;

            } else if (sauce.usersDisliked.includes(userId)){  //  if user is already in userDisliked , decremente dislike and pull user from array
          
              await Thing.findByIdAndUpdate(id, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
              .then(() => res.status(201).json({ message: 'Dislike retiré !'}))
              .catch(error => res.status(400).json({ error }));  
            }
       
        break;
  
        case -1: //case if like =-1

            if (!sauce.usersDisliked.includes(userId)){ // check if user is already in []usersDisliked
             await Thing.findByIdAndUpdate(id, { $inc: {dislikes: 1}, $push: {usersDisliked: userId}}) //incremente dislike and push user in []usersDisliked
             .then(() => res.status(201).json({ message: "Vous n'avez pas aimé cette sauce !"}))
             .catch(error => res.status(400).json({ error }));  
            }

        break;
  
        default: break;
      }
};


