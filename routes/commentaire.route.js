let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

let commentaire = require('../models/Commentaire')

// Retourne tous les commentaires d'un propos
router.get('/:proposId', (req, res) => {
    commentaire.find((error, data) => {
        if (error)
            return next(error)
        else
            res.json(data)
    }).where('reponse.propos._id').equals(req.params.proposId)
})

// Crée un commentaire spécifique à une réponse d'un propos
router.post('/create-commentaire', (req, res, next) => {
    commentaire.create(req.body, (error, data) => {
        if(error)
            return next(error)
        else
            res.json(data)
    })
})

module.exports = router