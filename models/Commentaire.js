const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentaireSchema = new Schema({
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
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  propos: {
    type: Schema.Types.ObjectId, 
    ref: 'Propos', 
    required: true
  }
}, { 
    collection: 'Commentaire',
    timestamps: {createdAt: "created_at"}
})

module.exports = mongoose.model('Commentaire', commentaireSchema)
