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

  isAdmin: function() {
    return localStorage.getItem("isAdmin") === "true";
  },

  getUserInfo: function() {
    if (this.isAuth() !== false) {
      headers["auth-token"] = token
    }
    return axios.get(`${burl}/users`, { headers: headers });
  },

  logout: function() {
    localStorage.clear();
  },
  
  getInfos: function() {
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.get(`${burl}/users/`, { headers: headers });
  },

  updateAccount: function(send) {
    return axios.put(`${burl}/users/edit-infos`, send, { headers: headers });
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

  deletePropos: function(send) {
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/propos/delete-propos`, {headers: headers, data: send});
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

  getAllCommentaires: function(){
    return axios.get(`${burl}/commentaires/`, { headers: headers });
  },  

  deleteCommentaire: function(send) {
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/commentaires/delete-commentaire`, {headers: headers, data: send});
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
    return axios({
      url : `${burl}/commentaires/unlike-commentaire`,
      method : 'delete',
      data : send,
      headers : headers
    });
  },

  undislikeCom: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios({
      url : `${burl}/commentaires/undislike-commentaire`,
      method : 'delete',
      data : send,
      headers : headers
    });
  },

  dislikeCom: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios({
      url : `${burl}/commentaires/dislike-commentaire`,
      method : 'put',
      data : send,
      headers : headers
    });
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

  getAllReponses: function(){
    return axios.get(`${burl}/reponses/`, { headers: headers });
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
    return axios({
      url : `${burl}/reponses/dislike-reponse`,
      method : 'put',
      data : send,
      headers : headers
    });
  },

  unlikeRep: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios({
      url : `${burl}/reponses/unlike-reponse`,
      method : 'delete',
      data : send,
      headers : headers
    });
  },

  undislikeRep: function(send){
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios({
      url : `${burl}/reponses/undislike-reponse`,
      method : 'delete',
      data : send,
      headers : headers
    });
  },

  deleteReponse: function(send) {
    if (this.isAuth) {
      headers["auth-token"] = token
    }
    return axios.delete(`${burl}/reponses/delete-reponse`, {headers: headers, data: send});
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