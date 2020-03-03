let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

let categoriePropos = require('../Models/CategoriePropos')
let categorieReponse = require('../Models/CategorieReponse')

// Retourne toutes les catégories de propos
router.get('/propos', (req, res) => {
    categoriePropos.find((error, data) => {
        if (error)
            return next(error)
        else
            res.json(data)
    })
})

// Ajoute une catégorie de propos
router.route('/create-categorie-propos').post((req, res, next) => {
    categoriePropos.create(req.body, (error, data) => {
        if (error) 
            return next(error)
        else 
            res.json(data)
      
    })
  });
  
// Retourne toutes les catégories de réponses
router.get('/reponses', (req, res) => {
    categorieReponse.find((error, data) => {
        if (error)
            return next(error)
        else
            res.json(data)
    })
})

// Ajoute une catégorie de réponses
router.route('/create-categorie-reponse').post((req, res, next) => {
    categorieReponse.create(req.body, (error, data) => {
        if (error) 
            return next(error)
        else 
            res.json(data)
    })
  })

module.exports = router