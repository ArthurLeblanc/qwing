let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// Propos Model
let ProposSchema = require('../models/Propos');
let Reponse = require('../models/Reponse');
let Commentaire = require('../models/Commentaire');

// Retourne toutes les propos
router.get('/', (req, res) => {
  ProposSchema.find((error, data) => {
      if (error)
          return next(error)
      else
          res.json(data)
  }).populate('categorie').populate('reponses.reponse')
})

// Créée un propos
router.post('/create-propos', (req, res, next) => {
  ProposSchema.create(req.body, (error, data) => {
      if (error)
        return next(error)
      else
        res.json(data)
  })
})

// Ajoute une réponse à un propos existant
router.put('/add-reponse', (req, res, next) => {
  const propos = req.body.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  const existingPropos = ProposSchema.findById(propos)
  if (!existingPropos)
    return res.status(400).json({msg:'Ce propos n\' existe pas '})
  const { contenu, categorie } = req.body
  rep = new Reponse({
    contenu,
    categorie,
    propos
  })
  rep.save()
  existingPropos.update({ $push: { reponses: rep }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
})

// Ajoute un commentaire à un propos existant
router.put('/add-commentaire', (req, res, next) => {
  let propos = req.body.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  const existingPropos = ProposSchema.findById(propos)
  if (!existingPropos)
    return res.status(400).json({msg:'Ce propos n\' existe pas '})
  const contenu  = req.body.contenu
  com = new Commentaire({
    contenu,
    propos
  })
  com.save()
  existingPropos.update({ $push: { commentaires: com }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
})

// Retourne toutes les réponses d'un propos
router.get('/:proposId/reponses', (req, res, next) => {
  const propos = req.params.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  Reponse.find((error, data) => {
    if (error)
        return next(error)
    else
        res.json(data)
  }).where('propos').equals(propos).populate('categorie')
})

// Retourne tous les commentaires d'un propos
router.get('/:proposId/commentaires', (req, res, next) => {
  const propos = req.params.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  Commentaire.find((error, data) => {
    if (error)
        return next(error)
    else
        res.json(data)
  }).where('propos').equals(propos).populate('categorie')
})

// Retourne tous les commentaires d'un propos
router.get('/:nbPropos', (req, res, next) => {
  ProposSchema.find((error, data) => {
    if (error)
        return next(error)
    else
        res.json(data)
  }).limit(+req.params.nbPropos)
})

module.exports = router;