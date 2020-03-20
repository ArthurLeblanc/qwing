import axios from "axios";
const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json"
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

  /*----------------- PROPOS --------------*/
  addPropos: function(send){
    return axios.post(`${burl}/propos/create-propos`, send, { headers: headers, token : token });
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
    return axios.put(`${burl}/propos/like-propos`, send, { headers: headers, 'auth-token' : token  });
  },

  dislike: function(send){
    return axios.put(`${burl}/propos/dislike-propos`, send, { headers: headers, 'auth-token' : token  });
  },

  /*----------------- COMMENTAIRE --------------*/

  addCommentaire: function(send){
    return axios.put(`${burl}/propos/add-commentaire `, send, { headers: headers, token : token });
  },

  getAllCommentaire: function(proposId){
    return axios.get(`${burl}/propos/${proposId}/commentaires`, { headers: headers });
  },

  /*----------------- Reponse --------------*/

  addReponse: function(send){
    return axios.put(`${burl}/propos/add-reponse `, send, { headers: headers, token : token });
  },

  getAllReponse: function(proposId){
    return axios.get(`${burl}/propos/${proposId}/reponses`, { headers: headers });
  },

  /*----------------- CATEGORIE PROPOS --------------*/
  addCatPropos: function(send){
    return axios.post(`${burl}/categories/create-categorie-propos`, send, { headers: headers });
  },

  getAllCatPropos: function(){
    return axios.get(`${burl}/categories/propos`, { headers: headers });
  },

  /*----------------- CATEGORIE REPONSE --------------*/
  addCatReponse: function(send){
    return axios.post(`${burl}/categories/create-categorie-reponse`, send, { headers: headers });
  },

  getAllCatReponse: function(){
    return axios.get(`${burl}/categories/reponse`, { headers: headers });
  },

  
}