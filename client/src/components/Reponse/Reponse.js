import React from "react";
import { Button, FormGroup, FormControl, ControlLabel, SplitButton } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import { CatPropos } from "../CatPropos/CatPropos";
import { Timestamp } from "mongodb";
import { Header } from "../Permanent/Header";

export class Reponse extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      categorie : "",
      proposId : this.props.match.params.proposId,
      propos : "",
      allReponses : [],
      allCatReponse : []
	  }

  this.getAllReponse = this.getAllReponse.bind(this);
  this.getAllCatReponse = this.getAllCatReponse.bind(this);
  this.getProposId = this.getProposId.bind(this);
  this.like = this.like.bind(this)
  this.likeRep = this.likeRep.bind(this)
  this.dislikeRep = this.dislikeRep.bind(this)
  this.setCategorie = this.setCategorie.bind(this);

  this.getAllCatReponse();
	this.getProposId();
	this.getAllReponse();
  }

  getAllCatReponse = async() => {
    const callCatReponse = await API.getAllCatReponse()
    this.setState({allCatReponse : callCatReponse.data});
  }

  setCategorie = async(vcategorie) => {
    this.setState({categorie : vcategorie});
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

  likeRep = async(reponseId) => {
    //verifie si le user a déja like la reponse, si oui unlike, sinon like
    const info = await API.getInfos()
    if ( typeof info.data !== 'undefined'){
      var repLikes = info.data.likesReponses
          var isLiked = false
          repLikes.map ( reponse =>
        {
          if (reponse._id == reponseId){
            isLiked = true
          }
        }
      )
      if (!isLiked) {
        await API.likeRep({"reponseId" : reponseId});
      }
      else {
        await API.unlikeRep(reponseId);
      }
    }
	  this.getAllReponse();
  }

  dislikeRep = async(reponseId) => {
    //verifie si le user a déja dislike la reponse, si oui unlike, sinon like
    const info = await API.getInfos()
    if ( typeof info.data !== 'undefined'){
      var repLikes = info.data.dislikesReponses
          var isLiked = false
          repLikes.map ( reponse =>
        {
          if (reponse._id == reponseId){
            isLiked = true
          }
        }
      )
      if (!isLiked) {
        await API.dislikeRep({"reponseId" : reponseId});
      }
      else {
        await API.unlikeRep({"reponseId" : reponseId});
      }
    }
	  this.getAllReponse();
  }

  getProposId = async() => {
    const {proposId} = this.state;
    const cPropos = await API.getProposId(proposId);
    this.setState({propos : cPropos.data})
  }
  
  getAllReponse = async() => {
      const {allReponses, proposId} = this.state;
      const callReponses = await API.getAllReponse(proposId);
      this.setState({allReponses : callReponses.data})
      
  	  
  }

  send = async () => {
    const { contenu, categorie, proposId} = this.state;
    if (!contenu || contenu.length === 0) return;
    if (!categorie || categorie.length === 0) return;
    try {
	  const { data } = await API.addReponse({ contenu, categorie, proposId});
      window.location = "/"+ proposId + "/reponse";
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
    const { contenu, categorie, propos, allReponses, allCatReponse} = this.state;
    return (
      <div className = "Reponse">
      <Header />
        <div className="addPropos">
        <h3>Ecrivez votre reponse</h3>
        <SplitButton title="Categorie" id="split-button-pull-right">
            {
            allCatReponse.map
                ( (catReponse, i) => 
                  {
                    return(
                      <div className = "Catpropos" key = {i}>
                        <Button onClick={() => this.setCategorie(catReponse.contenu)} block bsSize="large" type="submit">
                          {catReponse.contenu}
                        </Button>
                      </div>
                    )
                  }
                )
            }
          </SplitButton>
          <FormGroup controlId="categorie" bsSize="large">
            <ControlLabel>Categorie</ControlLabel>
            <FormControl
              autoFocus
              type="categorie"
              value={categorie}
              onChange={this.handleChange}
            />
          </FormGroup>
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
            Ajouter la reponse
          </Button>

          <div className="row">
            <div className="col s12 m6">
              <div className="card blue-grey darken-1">
                <div className="card-content white-text">
                  <span className="card-title">  PROPOS // like :{propos.likes} </span>
                  Categorie : {propos.categorie}
                  <p>Description : {propos.contenu}</p>
                </div>
                <div className="card-action">
                  <a href = "/propos">retour aux propos</a>
                  <a href = {"/" + propos._id + "/commentaire"}>Commentaires</a>
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
            allReponses.map
              ( (reponse, i) => 
                {
                  return(
                    <div className="row" key = {i}>
                      <div className="col s12 m6">
                        <div className="card blue-grey darken-1">
                          <div className="card-content white-text">
                            <span className="card-title">  // like : {reponse.likes} </span>
                            <p>{reponse.contenu}</p>
                          </div>
                          <div className="card-action">
                            {
                              blogged? (
                                <div>
                                  <Button onClick={() => this.likeRep(reponse._id)} block bsSize="large" type="submit">
                                    Like
                                  </Button>
                                  <Button onClick={() => this.dislikeRep(reponse._id)} block bsSize="large" type="submit">
                                    Dislike
                                  </Button>
                                  </div>
                                  ) : (
                                    <p> Vous devez vous connecter pour liker une reponse ! </p>
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
	)
  }
}
