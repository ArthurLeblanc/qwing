const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let proposSchema = new Schema({
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
      ref: 'CategoriePropos',
      required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reponses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reponse'
      }
  ],
  commentaires: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Commentaire'
      }
  ]
},
{ timestamps: { createdAt: "created_at" } 
  })

module.exports = mongoose.model('Propos', proposSchema)
