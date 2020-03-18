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

  // Ajoute une réponse à la liste des réponses aimées d'un utilisateur
router.put('/like-reponse', login, async (req, res, next) => {
  const reponse = req.body.reponseId
  if (reponse.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingReponse = await reponseSchema.findById(reponse)
    if (!existingReponse)
      return res.status(400).json({msg:'Cette réponse n\' existe pas '})
    if (user.likesReponses.includes(reponse))
      return res.status(400).json({msg:'Cette réponse figure déjà dans la liste des réponses aimées de cet utilisateur'})
    if (user.dislikesReponses.includes(reponse)) {
      let dislikes = existingReponse.dislikes
      existingReponse.update({ $set: { dislikes: dislikes - 1 }}, (error, data) => {
        if (error)
          return next(error)
      })
      user.update({ $pull: { dislikesReponses: reponse }}, (error, data) => {
      if (error)
        return next(error)
      })
    }
  let likes = existingReponse.likes
  existingReponse.update({ $set: { likes: likes + 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $push: { likesReponses: reponse }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

// Supprime une réponse à la liste des réponses aimées d'un utilisateur
router.put('/dislike-reponse', login, async (req, res, next) => {
  const reponse = req.body.reponseId
  if (reponse.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingReponse = await reponseSchema.findById(reponse)
    if (!existingReponse)
      return res.status(400).json({msg:'Cette réponse n\' existe pas '})
    if (user.dislikesReponses.includes(reponse))
      return res.status(400).json({msg:'Cette réponse figure déjà dans la liste des réponses aimées de cet utilisateur'})
    if (user.likesReponses.includes(reponse)) {
      let likes = existingReponse.likes
      existingReponse.update({ $set: { likes: likes - 1 }}, (error, data) => {
        if (error)
          return next(error)
      })
      user.update({ $pull: { likesReponses: reponse }}, (error, data) => {
      if (error)
        return next(error)
      })
    }
  let dislikes = existingReponse.dislikes
  existingReponse.update({ $set: { dislikes: dislikes + 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $push: { dislikesReponses: reponse }}, (error, data) => {
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