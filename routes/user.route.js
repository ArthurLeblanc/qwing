let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

const keys = require('../config/keys');
// Express middleware pour validator
const {check, validationResult} = require('express-validator');

// Protocole de hashage de mot de passe
const bcrypt = require('bcrypt')

// Permet de gérer l'authentification grâce à des tokens
const jwt = require('jsonwebtoken')

// Permet de vérifier si un utilisateur est connecté et si son token est valide
const login = require('../middleware/login')

// User Model
let User = require('../models/User');

//Propos Model
let Propos = require('../models/Propos');

// Route qui vérifie si un utilisateur est login via son token. Si oui, renvoie ses infos (sans le mdp) sinon ne renvoie rien
router.get('/', login, async (req, res) => {
    try {
        const user = await (await User.findById(req.user.id).select("-password")
        .populate("likesPropos").populate([{path: "likesPropos", populate: {path: "categorie", model: "CategoriePropos"}}, 
                                            {path: "likesPropos", populate: {path: "reponses", model: "Reponse"}}, 
                                            {path: "likesPropos", populate: {path: "commentaires", model: "Commentaire"}}, 
                                            {path: "likesPropos", populate: {path: "reponses", populate: [{path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}] ,model: "Reponse"}}, ])
        .populate("likesCommentaires").populate([{path: "likesCommentaires", populate: [{path: "propos", model: "Propos"}, {path: "creator", model: "User"}]}, 
                                        {path: "likesCommentaires", populate: {path: "propos", populate: {path: "categorie", model: "CategoriePropos"}}}, 
                                        {path: "likesCommentaires", populate: {path: "propos", populate: {path: "creator", model: "User"}}}, 
                                        {path: "likesCommentaires", populate: {path: "propos", populate: {path: "commentaires", model: "Commentaire"}}}, 
                                        {path: "likesCommentaires", populate: {path: "propos", populate: {path: "commentaires", populate:  {path: "creator", model: "User"} ,model: "Commentaire"}}},
                                        {path: "likesCommentaires", populate: {path: "propos", populate: {path: "reponses", populate: [{path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}] ,model: "Reponse"}}}])
        .populate("dislikesCommentaires").populate([{path: "dislikesCommentaires", populate: [{path: "propos", model: "Propos"}, {path: "creator", model: "User"}]},  
                                            {path: "dislikesCommentaires", populate: {path: "propos", populate: {path: "categorie", model: "CategoriePropos"}}}, 
                                            {path: "dislikesCommentaires", populate: {path: "propos", populate: {path: "creator", model: "User"}}}, 
                                            {path: "dislikesCommentaires", populate: {path: "propos", populate: {path: "commentaires", model: "Commentaire"}}},
                                            {path: "likesCommentaires", populate: {path: "propos", populate: {path: "commentaires", populate:  {path: "creator", model: "User"} ,model: "Commentaire"}}}, 
                                            {path: "dislikesCommentaires", populate: {path: "propos", populate: {path: "reponses", populate: [{path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}] ,model: "Reponse"}}}])
        .populate("likesReponses").populate([{path: "likesReponses", populate: [{path: "propos", model: "Propos"}, {path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}]},  
                                    {path: "likesReponses", populate: {path: "propos", populate: {path: "categorie", model: "CategoriePropos"}}}, 
                                    {path: "likesReponses", populate: {path: "propos", populate: {path: "creator", model: "User"}}}, 
                                    {path: "likesReponses", populate: {path: "propos", populate: {path: "commentaires", model: "Commentaire"}}}, 
                                    {path: "likesReponses", populate: {path: "propos", populate: {path: "reponses", populate: [{path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}] ,model: "Reponse"}}}])
        .populate("dislikesReponses").populate([{path: "dislikesReponses", populate: [{path: "propos", model: "Propos"}, {path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}]},  
                                        {path: "dislikesReponses", populate: {path: "propos", populate: {path: "categorie", model: "CategoriePropos"}}}, 
                                        {path: "dislikesReponses", populate: {path: "propos", populate: {path: "creator", model: "User"}}}, 
                                        {path: "dislikesReponses", populate: {path: "propos", populate: {path: "commentaires", model: "Commentaire"}}}, 
                                        {path: "dislikesReponses", populate: {path: "propos", populate: {path: "reponses", populate: [{path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}] ,model: "Reponse"}}}]))
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Erreur du serveur')
    }
})

// Retourne tous les propos d'un utilisateur (qu'il a créé)
router.get('/propos',   
    [
        check('email', 'Entrez un email valide').isEmail(),
    ], 

    async (req, res, next) => {

    const email = req.header('email')
    let user = await User.findOne({ email })
    if (!user)
        return res.status(400).json({msg:'Cet utilisateur n\'existe pas'})
    Propos.find((error, data) => {
      if (error)
          return next(error)
      else
          res.json(data)
    }).where('creator').equals(user._id).populate('categorie')
    .populate('reponses')
    .populate('commentaires')
    .populate('creator', '_id email pseudo')
    .populate({path: "reponses", populate: [{path: "categorie", model: "CategorieReponse"}, {path: "creator", model: "User"}]})
    .populate({path: "commentaires", populate: {path: "creator", model: "User"}})
  })

// Route pour l'inscription
router.post('/register',
    // Conditions pour que la requête soit validée
    [
        check('email', 'Entrez un email valide').isEmail(),
        check('pseudo', 'Entrez un pseudo').not().isEmpty(),
        check('password', 'Entrez un mot de passe d\'au moins 6 caractères').isLength({min: 6})
    ],    
    async (req, res) => {
        const errors = validationResult(req)
        // Si la requête n'est pas valide, on affiche les erreurs
        if(!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }
        // Sinon on récupère les paramètres dans le body
        const { email, pseudo, password } = req.body
        try {
            // On check si l'utilisateur n'est pas déjà enregistré dans la base de données
            let user = await User.findOne({ email })
            if (user)
                return res.status(400).json({msg:'Cet utilisateur existe déjà'})
            // Création de l'utilisateur
            user = new User({
                email,
                pseudo,
                password
            })
            // Cryptage du mot de passe pour la sauvegarde dans la base de données
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            // Sauvegarde de l'utilisateur dans la base de données
            await user.save()
            // Création du payload avec l'id de l'utilisateur précédemment créé pour le token
            const payload = {
                user: {
                    id: user.id
                }
            }
            // Création du token et envoi en réponse à la sauvegarde de l'utilisateur dans la base de données
            jwt.sign(payload, keys.secretOrKey, {
                expiresIn:3600
            }, (err, token) => {
                if (err) throw error
                res.send({ token })
            })
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Erreur du serveur")
            
        }
    })

// Route pour l'authentification 
router.post('/login',
// Conditions pour que la requête soit validée
[
    check('email', 'Entrez un email valide').isEmail(),
    check('password', 'Entrez un mot de passe d\'au moins 6 caractères').isLength({min: 6})
],    
async (req, res) => {
    const errors = validationResult(req)
    // Si la requête n'est pas valide, on affiche les erreurs
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    // Sinon on récupère les paramètres dans le body
    const { email, password } = req.body
    try {
        // On check si l'utilisateur n'est pas déjà enregistré dans la base de données
        let user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({msg:'Email ou mot de passe incorrect'})
        // Compare le mot de passe stocké dans la base de données et celui donné pour l'authentification
        const match = await bcrypt.compare(password, user.password)
        if (!match)
            return res.status(400).json({msg:'Email ou mot de passe incorrect'})
        // Création du payload avec l'id de l'utilisateur logged in pour le token
        const payload = {
            user: {
                id: user.id
            }
        }
        // Création du token et envoi en réponse à la sauvegarde de l'utilisateur dans la base de données
        jwt.sign(payload, keys.secretOrKey, {
            expiresIn:3600
        }, (err, token) => {
            if (err) throw error
            res.send({ token })
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Erreur du serveur")
        
    }
})

router.put('/edit-infos',
    // Conditions pour que la requête soit validée
    [
        check('email', 'Entrez un email valide').isEmail(),
    ],    
    async (req, res) => {
        const errors = validationResult(req)
        // Si la requête n'est pas valide, on affiche les erreurs
        if(!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }
        // Sinon on récupère les paramètres dans le body
        const { email, pseudo, password } = req.body
        try {
            // On check si l'utilisateur n'est pas déjà enregistré dans la base de données
            var user = await User.findOne({ email })
            if (!user)
                return res.status(400).json({msg:'Cet utilisateur n\'existe pas'})
            // Mise à jour de l'utilisateur
            user.email = email
            user.pseudo = pseudo
    
            // Cryptage du mot de passe pour la sauvegarde dans la base de données
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
            // Sauvegarde de l'utilisateur dans la base de données
            await user.save()
            res.send({user})
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Erreur du serveur")
            
        }
    })

    router.delete('/delete-account',
    // Conditions pour que la requête soit validée
    [
        check('pseudo', 'Entrez un pseudo').not().isEmpty(),
        check('password', 'Entrez un mot de passe d\'au moins 6 caractères').isLength({min: 6})
    ],    
    async (req, res) => {
        const errors = validationResult(req)
        // Si la requête n'est pas valide, on affiche les erreurs
        if(!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }
        // Sinon on récupère les paramètres dans le body
        const { email } = req.body
        try {
            // On check si l'utilisateur n'est pas déjà enregistré dans la base de données
            User.remove({
                email: req.body.email,
              }, function (err, user) {
                if (err)
                  return console.error(err);
    
                console.log('User successfully removed from polls collection!');
                res.status(200).send();
    
              });
        } catch (error) {
            console.error(error.message)
            res.status(500).send("Erreur du serveur")
            
        }
    })


module.exports = router;