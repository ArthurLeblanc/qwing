let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// Models
let ProposSchema = require('../models/Propos');
let Reponse = require('../models/Reponse');
let Commentaire = require('../models/Commentaire');
let User = require('../models/User');
let categoriePropos = require('../models/CategoriePropos')
let categorieReponse = require('../models/CategorieReponse')

// Retourne toutes les propos
router.get('/', (req, res) => {
  ProposSchema.find((error, data) => {
      if (error)
          return next(error)
      else
          res.json(data)
  }).populate('categorie').populate('reponses').populate('creator', '_id email pseudo').populate('commentaires').populate('reponses.reponse.categorie')
})

// Créée un propos
router.post('/create-propos', async (req, res, next) => {
  // Si un utilisateur est présent dans la requête
  if (req.body.creator) {
    // Vérifie que l'ID est valide
    if (req.body.creator.length != 24)
      return res.status(400).json({msg: 'ID de l\'utilisateur invalide'})
      const _id = req.body.creator
      const categorie = req.body.categorie
      try {
        // Vérifie que l'utilisateur existe dans la base de données
        let user = await User.findOne({ _id })
        if (!user) return res.status(400).json({msg: 'Cet utilisateur n\'existe pas'})

        let categ = await categoriePropos.findOne({ _id: categorie })
        if (!categ) return res.status(400).json({msg: 'Cette catégorie n\'existe pas'})
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Erreur du serveur")
    }
  }
  ProposSchema.create(req.body, (error, data) => {
      if (error)
        return next(error)
      else
        res.json(data)
  })
})

// Ajoute une réponse à un propos existant
router.put('/add-reponse', async (req, res, next) => {
  const propos = req.body.proposId
  const categorie = req.body.categorie
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const existingPropos = await ProposSchema.findById(propos)
    if (!existingPropos)
      return res.status(400).json({msg:'Ce propos n\'existe pas '})

    const categ = await categorieReponse.findById({_id: categorie})
    if (!categ)
      return res.status(400).json({msg:'Cette catégorie n\'existe pas '})

    const contenu = req.body.contenu
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
    } catch(err) {
      res.status(500).send("Erreur du serveur")
    }

})

// Ajoute un commentaire à un propos existant
router.put('/add-commentaire', async (req, res, next) => {
  const propos = req.body.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const existingPropos = await ProposSchema.findById(propos)
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

  } catch(err) {
    res.status(500).send(err)
  }

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