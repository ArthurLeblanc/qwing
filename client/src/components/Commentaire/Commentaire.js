import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import { CatPropos } from "../CatPropos/CatPropos";
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

          <Button onClick={this.send} block bsSize="large" type="submit">
            Ajouter le commentaire
          </Button>
          </div>
          <div className="divider" style={{marginTop: 30, marginBottom: 15}}></div>
          <div className="row">
            <div className="col s12 m6 offset-m3">
              <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                  <span className="card-title">  PROPOS // like :{propos.likes} </span>
                  Categorie : {propos.categorie}
                  <p>Description : {propos.contenu}</p>
                </div>
                <div className="card-action">
                  <a href = "/propos">retour aux propos</a>
                  <a href = {"/" + propos._id + "/reponse"}>Reponses</a>
                </div>
                <div className="card-action">
                  {
                    blogged? (
                      <Button onClick={() => this.like(propos._id)} block bsSize="large" type="submit">
                        Like
                      </Button>
                      ) : (
                        <p> Vous devez vous connecter pour liker un propos ! </p>
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
                      <div className="col s12 m6 offset-m3">
                        <div className="card blue-grey darken-1">
                          <div className="card-content white-text">
                            <span className="card-title">  // like : {commentaire.likes} // dislike : {commentaire.dislikes} </span>
                            <p>{commentaire.contenu}</p>
                          </div>
                          <div className="card-action">
                          <div className="card-action">
                            {
                              blogged? (
                                <div>
                                  <Button onClick={() => this.likeCom(commentaire._id)} block bsSize="large" type="submit">
                                    Like
                                  </Button>
                                  <Button onClick={() => this.dislikeCom(commentaire._id)} block bsSize="large" type="submit">
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
