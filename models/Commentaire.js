const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentaireSchema = new Schema({
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
  propos: {
    type: Schema.Types.ObjectId, 
    ref: 'Propos', 
    required: true
  }
}, { 
    collection: 'Commentaire'
  })

module.exports = mongoose.model('Commentaire', commentaireSchema)
