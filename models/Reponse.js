const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reponseSchema = new Schema({
  contenu: {
    type: String,
    required: true
  },
  like: {
    type: Number
  },
  dislike: {
    type: Number
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
