import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import { Categorie } from "../Categorie/Categorie.js";
import { Timestamp } from "mongodb";
import { Header } from "../Permanent/Header";

export class Commentaire extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      proposId : this.props.match.params.proposId,
      propos : "",
      allCommentaires : []
	  }

	this.getAllCommentaire = this.getAllCommentaire.bind(this);
  this.getProposId = this.getProposId.bind(this);
  this.like = this.like.bind(this)
  this.likeCom = this.likeCom.bind(this)
  this.dislikeCom = this.dislikeCom.bind(this)

	this.getProposId();
	this.getAllCommentaire();
  }

  getProposId = async() => {
    const {proposId} = this.state;
    const cPropos = await API.getProposId(proposId);
    this.setState({propos : cPropos.data})
  }
  
  getAllCommentaire = async() => {
      const {allCommentaires, proposId} = this.state;
      const callCommentaire = await API.getAllCommentaire(proposId);
      this.setState({allCommentaires : callCommentaire.data})
      
  	  
  }

  likeCom = async(commentaireId) => {
    //verifie si le user a déja like le commentaire, si oui unlike, sinon like
    const info = await API.getInfos()
    if ( typeof info.data !== 'undefined'){
      var comLikes = info.data.likesCommentaires
          var isLiked = false
      comLikes.map ( commentaire =>
        {
          if (commentaire._id == commentaireId){
            isLiked = true
          }
        }
      )
      if (!isLiked) {
        console.log("!")
        await API.likeCom({"commentaireId" : commentaireId});
      }
      else {
        console.log("o")
        await API.unlikeCom({"commentaireId" :commentaireId});
      }
    }

    this.getAllCommentaire();
    console.log("fin")
  }

  dislikeCom = async(commentaireId) => {
    //verifie si le user a déja dislike le commentaire, si oui unlike, sinon like
    const info = await API.getInfos()
    if ( typeof info.data !== 'undefined'){
      var comLikes = info.data.dislikesCommentaires
          var isDisliked = false
      comLikes.map ( commentaire =>
        {
          if (commentaire._id == commentaireId){
            isDisliked = true
          }
        }
      )
      if (!isDisliked) {
        await API.dislikeCom({"commentaireId" : commentaireId});
      }
      else {
        await API.undislikeCom({"commentaireId" :commentaireId});
      }
    }

    this.getAllCommentaire();
  }

  like = async(proposId) => {
	  //verifie si le user a déja like le propos, si oui unlike, sinon like
	  const info = await API.getInfos()
      if ( typeof info.data !== 'undefined'){
      var proposLikes = info.data.likesPropos
          var isLiked = false
      proposLikes.map ( propos =>
        {
          if (propos._id == proposId){
            isLiked = true
          }
        }
        
      )
      if (!isLiked) {
        await API.like({"proposId" : proposId});
      }
      else {
        await API.dislike({"proposId" : proposId});
      }
	  }
	  this.getProposId()
  }

  send = async () => {
    const { contenu, proposId} = this.state;
    if (!contenu || contenu.length === 0) return;
    try {
	  const { data } = await API.addCommentaire({ contenu, proposId});
      window.location = "/"+ proposId + "/commentaire";
    } catch (error) {
      console.error(error);
    }
  };
  
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };
  
  render() {
    const blogged = API.isAuth();
    const { contenu, propos, allCommentaires} = this.state;
    console.log(propos)
    return (
      <div className = "Page">
        <Header />
        <div className="container" >
          <div className="row">
            <div className="addPropos">
              <h3>Ecrivez votre commentaire</h3>
              <FormGroup controlId="contenu" bsSize="large">
                <ControlLabel>Contenu</ControlLabel>
                <FormControl
                  autoFocus
                  type="contenu"
                  value={contenu}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <div className = "row">
                <div className=" col s12 m2 offset-m5 ">
                  <Button className = "orange darken-4" onClick={this.send} block bsSize="large" type="submit">
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
        
          <div className="row">
            <div className="divider in-line" style={{ marginTop: 30, marginBottom: 50}}></div>
            <div className="col s12 m8 offset-m2">
              <div className="card grey darken-3">
                <div className="card-content white-text">
                  <span className="card-title">  Propos selectionné </span>
                  <p>Description : {propos.contenu}</p>
                  <div className="row" style={{marginBottom: -20}}>
                    <span className= "bottom left">Créé le :  {propos.created_at}</span> 
                    <span className= "bottom right"><i className="material-icons left">hearing</i> {propos.likes}</span>
							    </div>
                </div>
                <div className="card-action">
                  <a href = "/propos">retour aux propos</a>
                  <a href = {"/" + propos._id + "/reponse"}>Reponses</a>
                </div>
                <div className="card-action">
                  {
                    blogged? (
                      <Button className = "orange darken-4" onClick={() => this.like(propos._id)} block bsSize="large" type="submit">
                        Déjà entendu !
                      </Button>
                      ) : (
                        <p> Vous devez vous connecter pour signaler que vous avez déjà entendu ce propos ! </p>
                      )
                  }
                </div>                
              </div>
            </div>
          </div>
          
          {
            allCommentaires.map
              ((commentaire, i) => 
                {
                  return(
                    <div className="row" key={i}>
                      <div className="col s12 m8 offset-m2 ">
                        <div className="card grey darken-3">
                          <div className="card-content white-text">
                            <span className="card-title"> Commentaire </span>
                            <p>Description : {commentaire.contenu}</p>
                            <div className="row" style={{marginBottom: -20}}>
                              <span className= "bottom right"><i className="material-icons left">thumb_up</i> {commentaire.likes} <p></p>
                              <i className="material-icons left">thumb_down</i> {commentaire.dislikes}</span>
                            </div>
                          </div>
                          <div className="card-action">
                            {
                              blogged? (
                                <div>
                                  <Button className = "orange darken-4" onClick={() => this.likeCom(commentaire._id)} block bsSize="large" type="submit">
                                    Like
                                  </Button>
                                  <Button className = "orange darken-4" onClick={() => this.dislikeCom(commentaire._id)} block bsSize="large" type="submit">
                                    Dislike
                                  </Button>
                                </div>
                                ) : (
                                  <p> Vous devez vous connecter pour liker ou dislike un commentaire ! </p>
                              )
                            }
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              )
          }
        </div>
      </div>
      </div>
	)
  }
}
