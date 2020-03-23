let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

let commentaireSchema = require('../models/Commentaire')
let User = require('../models/User');

// Permet de vérifier si un utilisateur est connecté et si son token est valide
const login = require('../middleware/login')


  // Retourne tous les commentaires
  router.get('/', (req, res) => {
    commentaireSchema.find((error, data) => {
        if (error)
            return next(error)
        else
            res.json(data)
    }).populate('creator', '_id email pseudo')
      .populate('propos')
      .sort({created_at: -1})
  })

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
      if (!commentaire.creator) {
          if (user.isAdmin == false) {
            return res.status(403).json({msg:'Vous n\'êtes pas autorisé à supprimer ce commentaire'})
          }
        } else if (commentaire.creator.email != user.email && user.isAdmin == false) {
          return res.status(403).json({msg:'Vous n\'êtes pas autorisé à supprimer ce commentaire'})
        } 
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

// Ajoute un commentaire à la liste des commentaires aimés d'un utilisateur
router.put('/like-commentaire', login, async (req, res, next) => {
  const commentaire = req.body.commentaireId
  if (commentaire.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingCommentaire = await commentaireSchema.findById(commentaire)
    if (!existingCommentaire)
      return res.status(400).json({msg:'Ce commentaire n\' existe pas '})
    if (user.likesCommentaires.includes(commentaire))
      return res.status(400).json({msg:'Ce commentaire figure déjà dans la liste des commentaires aimés de cet utilisateur'})
    if (user.dislikesCommentaires.includes(commentaire)) {
      let dislikes = existingCommentaire.dislikes
      existingCommentaire.update({ $set: { dislikes: dislikes - 1 }}, (error, data) => {
        if (error)
          return next(error)
      })
      user.update({ $pull: { dislikesCommentaires: commentaire }}, (error, data) => {
      if (error)
        return next(error)
      })
    }
  let likes = existingCommentaire.likes
  existingCommentaire.update({ $set: { likes: likes + 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $push: { likesCommentaires: commentaire }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

// Supprime un commentaire de la liste des commentaires aimés d'un utilisateur
router.delete('/unlike-commentaire', login, async (req, res, next) => {
  console.log("serverhidsojfop")
  const commentaire = req.body.commentaireId
  if (commentaire.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingCommentaire = await commentaireSchema.findById(commentaire)
    if (!existingCommentaire)
      return res.status(400).json({msg:'Ce commentaire n\' existe pas '})
    if (!user.likesCommentaires.includes(commentaire))
      return res.status(400).json({msg:'Ce commentaire ne figure pas dans la liste des commentaires aimés de cet utilisateur'})
  let likes = existingCommentaire.likes
  existingCommentaire.update({ $set: { likes: likes - 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $pull: { likesCommentaires: commentaire }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

// Supprime un commentaire de la liste des commentaires non aimés d'un utilisateur
router.delete('/undislike-commentaire', login, async (req, res, next) => {
  const commentaire = req.body.commentaireId
  if (commentaire.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingCommentaire = await commentaireSchema.findById(commentaire)
    if (!existingCommentaire)
      return res.status(400).json({msg:'Ce commentaire n\' existe pas '})
    if (!user.dislikesCommentaires.includes(commentaire))
      return res.status(400).json({msg:'Ce commentaire ne figure pas dans la liste des commentaires non aimés de cet utilisateur'})
  let dislikes = existingCommentaire.dislikes
  existingCommentaire.update({ $set: { dislikes: dislikes - 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $pull: { dislikesCommentaires: commentaire }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

// Supprime un commentaire à la liste des commentaires aimés d'un utilisateur
router.put('/dislike-commentaire', login, async (req, res, next) => {
  const commentaire = req.body.commentaireId
  if (commentaire.length != 24)
      return res.status(400).json({msg:'ID invalide'})
  try {
    const user = await User.findById(req.user.id).select("-password")
    const existingCommentaire = await commentaireSchema.findById(commentaire)
    if (!existingCommentaire)
      return res.status(400).json({msg:'Ce commentaire n\' existe pas '})
    if (user.dislikesCommentaires.includes(commentaire))
      return res.status(400).json({msg:'Ce commentaire figure déjà dans la liste des commentaires non aimés de cet utilisateur'})
    if (user.likesCommentaires.includes(commentaire)) {
      let likes = existingCommentaire.likes
      existingCommentaire.update({ $set: { likes: likes - 1 }}, (error, data) => {
        if (error)
          return next(error)
      })
      user.update({ $pull: { likesCommentaires: commentaire }}, (error, data) => {
      if (error)
        return next(error)
      })
    }
  let dislikes = existingCommentaire.dislikes
  existingCommentaire.update({ $set: { dislikes: dislikes + 1 }}, (error, data) => {
    if (error)
      return next(error)
  })
  user.update({ $push: { dislikesCommentaires: commentaire }}, (error, data) => {
    if (error)
      return next(error)
    else
      res.json(data)
  })
  } catch(err) {
    res.status(500).send("Erreur du serveur")
  }
})

module.exports = router