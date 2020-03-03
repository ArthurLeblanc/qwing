const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorieProposSchema = new Schema({
  contenu: { 
    type: String
  }
}, {
    collection: 'CategoriePropos'
  })

module.exports = mongoose.model('CategoriePropos', categorieProposSchema)