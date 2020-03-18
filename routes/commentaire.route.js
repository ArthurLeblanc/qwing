let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

let commentaireSchema = require('../models/Commentaire')
let User = require('../models/User');

// Permet de vérifier si un utilisateur est connecté et si son token est valide
const login = require('../middleware/login')

// Modification d'un commentaire
router.put('/edit-commentaire', login, async (req, res, next) => {
    const com = req.body.commentaireId
    if (com.length != 24)
      return res.status(400).json({msg:'ID invalide'})
    try {
      const user = await (await User.findById(req.user.id).select("-password"))
      const commentaire = await commentaireSchema.findById(com).populate('creator')
      console.log(commentaire)
      if (!commentaire)
        return res.status(400).json({msg:'Ce commentaire n\'existe pas '})
      if (commentaire.creator.email != user.email)
        return res.status(403).json({msg:'Vous n\'êtes pas autorisé à modifier ce commentaire'})
      commentaire.update(req.body, (error, data) => {
        if (error)
            return next(error)
          else
            res.json(data)
      })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Erreur du serveur")
    }
  })
  
  // Suppression d'un commentaire
  router.delete('/delete-commentaire', login, async (req, res, next) => {
    const com = req.body.commentaireId
    if (com.length != 24)
      return res.status(400).json({msg:'ID invalide'})
    try {
      const user = await (await User.findById(req.user.id).select("-password"))
      const commentaire = await commentaireSchema.findById(com).populate('creator')
      if (!commentaire)
        return res.status(400).json({msg:'Ce commentaire n\'existe pas '})
      if (commentaire.creator.email != user.email)
        return res.status(403).json({msg:'Vous n\'êtes pas autorisé à supprimer ce commentaire'})
      commentaireSchema.findByIdAndRemove(commentaire._id, (error, data) => {
        if (error)
            return next(error)
        const response = {
          message: "Le commentaire a bien été supprimé",
          id: data._id
        };
        return res.status(200).send(response);
      })
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Erreur du serveur")
    }
  })

module.exports = router