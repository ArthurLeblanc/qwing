const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorieReponseSchema = new Schema({
  contenu: {
    type: String,
    required: true
  }
}, {
    collection: 'CategorieReponse'
  })

module.exports = mongoose.model('CategorieReponse', categorieReponseSchema)
