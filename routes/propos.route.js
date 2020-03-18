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

// Permet de vérifier si un utilisateur est connecté et si son token est valide
const login = require('../middleware/login')

const keys = require('../config/keys');
const jwt = require('jsonwebtoken')

// Retourne toutes les propos
router.get('/', (req, res) => {
  ProposSchema.find((error, data) => {
      if (error)
          return next(error)
      else
          res.json(data)
  }).populate('categorie').populate('reponses').populate('commentaires').populate('creator', '_id email pseudo').populate({path: "reponses", populate: {path: "categorie", model: "CategorieReponse"}})
})

// Créée un propos
router.post('/create-propos', async (req, res, next) => {
  const token = req.header('auth-token')
  // Check si un token existe
  if (token) {
    try {
      const decodedToken = jwt.verify(token, keys.secretOrKey)
      req.body.creator = decodedToken.user
    } catch(err) {
      console.error(err.message)     
    }
  }
  var categ = req.body.categorie
  const contenu = req.body.contenu
  try {
    // Vérifie que l'utilisateur existe dans la base de données
    let categorie = await categoriePropos.findOne({contenu: categ })
    if (!categorie) return res.status(400).json({msg: 'Cette catégorie n\'existe pas'})
    if (req.body.creator) {
      creator = req.body.creator.id
      propos = new ProposSchema({
        contenu,
        categorie,
        creator
      })
    } else {
      propos = new ProposSchema({
        contenu,
        categorie
      })
    }
    console.log(propos)
    propos.save((err, data) => {
      if(err)
        return next(error)
      else
        res.json(data)
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Erreur du serveur")
  }
})

// Modification d'un propos
router.put('/edit-propos', login, async (req, res, next) => {
  const categorie = req.body.categorie
  const propos = req.body.proposId
  if (propos.length != 24)
    return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await (await User.findById(req.user.id).select("-password"))
    if (!categorie)
      return res.status(400).json({msg:'Catégorie introuvable'})
    let categ = await categoriePropos.findOne({contenu: categorie })
    if (!categ) return res.status(400).json({msg: 'Cette catégorie n\'existe pas'})
    req.body.categorie = categ._id


    const existingPropos = await ProposSchema.findById(propos).populate('creator')
    if (!existingPropos)
      return res.status(400).json({msg:'Ce propos n\'existe pas '})
    if (existingPropos.creator.email != user.email)
      return res.status(403).json({msg:'Vous n\'êtes pas autorisé à modifier ce propos'})
    existingPropos.update(req.body, (error, data) => {
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

// Suppression d'un propos
router.delete('/delete-propos', login, async (req, res, next) => {
  const propos = req.body.proposId
  if (propos.length != 24)
    return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await (await User.findById(req.user.id).select("-password"))
    const existingPropos = await ProposSchema.findById(propos).populate('creator')
    if (!existingPropos)
      return res.status(400).json({msg:'Ce propos n\'existe pas '})
    if (existingPropos.creator.email != user.email)
      return res.status(403).json({msg:'Vous n\'êtes pas autorisé à supprimer ce propos'})
    ProposSchema.findByIdAndRemove(existingPropos._id, (error, data) => {
      if (error)
          return next(error)
      const response = {
        message: "Le propos a bien été supprimé",
        id: data._id
      };
      return res.status(200).send(response);
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Erreur du serveur")
  }
})

// Ajoute une réponse à un propos existant
router.put('/add-reponse', async (req, res, next) => {
  const token = req.header('auth-token')
  // Check si un token existe
  if (token) {
    try {
      const decodedToken = jwt.verify(token, keys.secretOrKey)
      console.log(decodedToken)
      req.body.creator = decodedToken.user
    } catch(err) {
      console.error(err.message)     
    }
  }
  const propos = req.body.proposId
  const nomCategorie = req.body.categorie
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const existingPropos = await ProposSchema.findById(propos)
    if (!existingPropos)
      return res.status(400).json({msg:'Ce propos n\'existe pas '})
      if (!nomCategorie)
        return res.status(400).json({msg:'Catégorie introuvable'})
      const categorie = await categorieReponse.findOne({contenu: nomCategorie})
      if (!categorie)
        return res.status(400).json({msg:'Cette catégorie n\'existe pas '})
    const contenu = req.body.contenu
    if (req.body.creator) {
      creator = req.body.creator.id
      rep = new Reponse({
        contenu,
        categorie,
        propos,
        creator
      })
    } else {
      rep = new Reponse({
        contenu,
        categorie,
        propos
      })
    }
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
  const token = req.header('auth-token')
  // Check si un token existe
  if (token) {
    try {
      const decodedToken = jwt.verify(token, keys.secretOrKey)
      req.body.creator = decodedToken.user
    } catch(err) {
      console.error(err.message)     
    }
  }
  const propos = req.body.proposId
  if (propos.length != 24)
  return res.status(400).json({msg:'ID invalide'})
  try {
    const existingPropos = await ProposSchema.findById(propos)
    if (!existingPropos)
    return res.status(400).json({msg:'Ce propos n\' existe pas '})
    const contenu  = req.body.contenu
    if (req.body.creator) {
      creator = req.body.creator.id
      com = new Commentaire({
        contenu,
        propos,
        creator
      })
    } else {
      com = new Commentaire({
        contenu,
        propos
      })
    }
    com.save()
    existingPropos.update({ $push: { commentaires: com }}, (error, data) => {
      if (error)
        return next(error)
      else
        res.json(data)
    })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
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

// Ajoute un propos à la liste des propos aimés d'un utilisateur
router.put('/like-propos', login, async (req, res, next) => {
  const propos = req.body.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingPropos = await ProposSchema.findById(propos)
    if (!existingPropos)
      return res.status(400).json({msg:'Ce propos n\' existe pas '})
    if (user.likesPropos.includes(propos))
      return res.status(400).json({msg:'Ce propos figure déjà dans la liste des propos aimés de cet utilisateur'})
  let likes = existingPropos.likes
  existingPropos.update({ $set: { likes: likes + 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $push: { likesPropos: propos }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

// Supprime un propos à la liste des propos aimés d'un utilisateur
router.delete('/dislike-propos', login, async (req, res, next) => {
  const propos = req.body.proposId
  if (propos.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingPropos = await ProposSchema.findById(propos).populate('likesPropos')
    if (!existingPropos)
      return res.status(400).json({msg:'Ce propos n\' existe pas '})
    if (!user.likesPropos.includes(propos))
      return res.status(400).json({msg:'Ce propos ne figure pas dans la liste des propos aimés de cet utilisateur'})
      
  let likes = existingPropos.likes
  existingPropos.update({ $set: { likes: likes - 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $pull: { likesPropos: propos }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

module.exports = router;