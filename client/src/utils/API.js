import axios from "axios";
const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin" : "*",
  "auth-token" : token
};

const burl = "http://localhost:4000/api";

export default {

/*----------------- CONNEXION --------------*/
  login: function(email, password) {
    return axios.post(
      `${burl}/users/login`,
      {
        email,
        password
      },
      {
        headers: headers
      }
    );
  },
  signup: function(send) {
    return axios.post(`${burl}/users/register`, send, { headers: headers });
  },

  isAuth: function() {
    return localStorage.getItem("token") !== null;
  },

  logout: function() {
    localStorage.clear();
  },
  
  getInfos: function() {
    return axios.get(`${burl}/users/`, { headers: headers });
  },

  updateAccount: function(send) {
    return axios.put(`${burl}/users/edit-infos`, send, { headers: headers });
  },

  /*----------------- PROPOS --------------*/
  addPropos: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.post(`${burl}/propos/create-propos`, send, { headers: headers });
  },

  getAllPropos: function(){
  	  return axios.get(`${burl}/propos/`, { headers: headers });
  },

  getProposId: function(proposId){
    return axios.get(`${burl}/propos/${proposId}`, { headers: headers });
  },

  getTop5: function(){
    return axios.get(`${burl}/propos/top5`, { headers: headers });
  },
  
  like: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/propos/like-propos`,  send, { headers: headers });
  },

  dislike: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/propos/dislike-propos`, {headers: headers, data: send});
  },

  /*----------------- COMMENTAIRE --------------*/

  addCommentaire: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/propos/add-commentaire`, send, { headers: headers });
  },

  getAllCommentaire: function(proposId){
    return axios.get(`${burl}/propos/${proposId}/commentaires`, { headers: headers });
  },

  likeCom: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/commentaires/like-commentaire`,  send, { headers: headers });
  },

  unlikeCom: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/commentaires/unlike-commentaire`,  send, { headers: headers});
  },

  undislikeCom: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/commentaires/undislike-commentaire`,  send, { headers: headers });
  },

  dislikeCom: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/commentaires/dislike-commentaire`, {headers: headers, data: send});
  },

  /*----------------- Reponse --------------*/

  addReponse: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/propos/add-reponse`, send, { headers: headers });
  },

  getAllReponse: function(proposId){
    return axios.get(`${burl}/propos/${proposId}/reponses`, { headers: headers });
  },

  likeRep: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/reponses/like-reponse`,  send, { headers: headers });
  },

  dislikeRep: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.put(`${burl}/reponses/dislike-reponse`, {headers: headers, data: send});
  },

  unlikeRep: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/reponses/unlike-reponse`,  send, { headers: headers });
  },

  undislikeRep: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/reponses/undislike-reponse`, {headers: headers, data: send});
  },

  /*----------------- CATEGORIE PROPOS --------------*/
  addCatPropos: function(contenu){
    return axios.post(`${burl}/categories/create-categorie-propos`, contenu, { headers: headers });
  },

  getAllCatPropos: function(){
    return axios.get(`${burl}/categories/propos`, { headers: headers });
  },

  /*----------------- CATEGORIE REPONSE --------------*/
  addCatReponse: function(contenu){
    return axios.post(`${burl}/categories/create-categorie-reponse`, contenu, { headers: headers });
  },

  getAllCatReponse: function(){
    return axios.get(`${burl}/categories/reponses`, { headers: headers });
  },

  
}