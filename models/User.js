const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    pseudo: {
      type : String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    likesPropos: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Propos'
        }
      ],
    likesCommentaires: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Commentaire'
        }
      ],
    likesReponses: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Reponse'
        }
      ]
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("User", userSchema);
