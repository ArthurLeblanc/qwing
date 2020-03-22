import React from "react";
import { Button, FormGroup, FormControl, ControlLabel, MenuItem, SplitButton } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'; 
import { Header } from "../Permanent/Header";
import { CatPropos } from "../CatPropos/CatPropos";

export class Propos extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      categorie:"",
      proposId : "",
      allPropos : [],
      allCatPropos : []
  	}

	this.getAllCatPropos = this.getAllCatPropos.bind(this);
	this.getAllPropos = this.getAllPropos.bind(this);
  this.like = this.like.bind(this);
  this.setCategorie = this.setCategorie.bind(this);

  this.getAllCatPropos();
	this.getAllPropos();
  }

  setCategorie = async(vcategorie) => {
    this.setState({categorie : vcategorie});
  }
  getAllCatPropos = async() => {
    const callCatPropos = await API.getAllCatPropos()
    this.setState({allCatPropos : callCatPropos.data});
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
	  this.getAllPropos()
  }

  getAllPropos = async() => {
  	const callPropos = await API.getAllPropos();
	  this.setState({allPropos : callPropos.data})
  }

  send = async () => {
    const { contenu, categorie} = this.state;
    if (!contenu || contenu.length === 0) return;
    if (!categorie || categorie.length === 0) return;
    try {
	  const { data } = await API.addPropos({ contenu, categorie});
      window.location = "/dashboard";
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
    const { contenu, categorie, allPropos, allCatPropos} = this.state;
    return (
      <div className = "Page">
       <Header />
        <div className="addPropos">

          <SplitButton title="Categorie" id="split-button-pull-right">
            {
            allCatPropos.map
                ( (catPropos, i) => 
                  {
                    return(
                      <div className = "Catpropos" key = {i}>
                        <Button onClick={() => this.setCategorie(catPropos.contenu)} block bsSize="large" type="submit">
                          {catPropos.contenu}
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
            Ajouter le propos
          </Button>
          
          {
            allPropos.map
              ( (propos, i, i1, i2) => 
                {
                  return(
                    <div className="row" key = {i}>
                      <div className="col s12 m6">
                        <div className="card blue-grey darken-1">
                          <div className="card-content white-text">
                            <span className="card-title"> Categorie : {propos.categorie.contenu} // like : {propos.likes} </span>
                            <p>{propos.contenu}</p>
                          </div>
                          <div className="card-action">
                            <a href = {`/${propos._id}/commentaire`}>Commentaires</a>
                            <a href = {`/${propos._id}/reponse`}>Reponses</a>
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
                  )
                }
              )
          }
        </div>
      </div>
	)
  }
}
