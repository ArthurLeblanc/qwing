const mongoose = require('mongoose');
const Schema = mongoose.Schema

let reponseSchema = new Schema({
  contenu: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  categorie: {
    type: Schema.Types.ObjectId,
    ref: 'CategorieReponse',
    required: true
  },
  propos: {
    type: Schema.Types.ObjectId,
    ref: 'Propos',
    required: true
  }
}, {
    collection: 'Reponse'
  })

module.exports = mongoose.model('Reponse', reponseSchema)
