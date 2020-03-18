let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// Reponse Model
let reponseSchema = require('../models/Reponse');

let User = require('../models/User');

// Permet de vérifier si un utilisateur est connecté et si son token est valide
const login = require('../middleware/login')

  // Suppression d'une réponse
  router.delete('/delete-reponse', login, async (req, res, next) => {
    const rep = req.body.reponseId
    if (rep.length != 24)
      return res.status(400).json({msg:'ID invalide'})
    try {
      const user = await (await User.findById(req.user.id).select("-password"))
      const reponse = await reponseSchema.findById(rep).populate('creator')
      if (!reponse)
        return res.status(400).json({msg:'Cette réponse n\'existe pas '})
      if (reponse.creator.email != user.email)
        return res.status(403).json({msg:'Vous n\'êtes pas autorisé à supprimer cette réponse'})
        reponseSchema.findByIdAndRemove(reponse._id, (error, data) => {
        if (error)
            return next(error)
        const response = {
          message: "La réponse a bien été supprimé",
          id: data._id
        };
        return res.status(200).send(response);
      })
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Erreur du serveur")
    }
  })

module.exports = router;