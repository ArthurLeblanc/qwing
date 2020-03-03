let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// Reponse Model
let Reponse = require('../models/Reponse');

// Retourne toutes les réponses pour un propos
router.get('/:proposId', (req, res, next) => {
    const idPropos = req.params.proposId.substring(9, req.params.proposId.length)
    if (idPropos.length != 24)
        return res.status(400).json({msg:'ID invalide'})
    Reponse.find((error, data) => {
      if (error)
          return next(error)
      else
          res.json(data)
  }).where('propos').equals(idPropos).populate('categorie').populate('propos')
})

// Crée une réponse pour un propos (contenu:String, catégorie:idRef, propos:idRef requis)
router.post('/create-reponse', (req, res, next) => {
    Reponse.create(req.body, (error, data) => {
      if (error)
        return next(error)
      else
        res.json(data)
  })
})

// Ajoute un commentaire à un propos existant
router.put('/:proposId/add-commentaire' , (req, res, next) => {
  const propos = Propos.findById(proposId)
  if (!propos)
    return res.status(400).json({msg:'Ce propos n\' existe pas '})
  
  //propos.update({ $push: { commentaires: }})
})

module.exports = router;