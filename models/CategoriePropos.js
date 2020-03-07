const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorieProposSchema = new Schema({
  contenu: { 
    type: String,
    required: true
  }
}, {
    collection: 'CategoriePropos'
  })

module.exports = mongoose.model('CategoriePropos', categorieProposSchema)
