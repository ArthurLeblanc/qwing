import React from "react";
import { Button, FormGroup, FormControl, ControlLabel, MenuItem, SplitButton } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'; 
import { Header } from "../Permanent/Header";
import { Categorie } from "../Categorie/Categorie.js";

export class Propos extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      categorie:"",
      proposId : "",
      allPropos : [],
      allCatPropos : [],
      search : ""
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

  handleSubmit = async() => {
    const callPropos = await this.getAllPropos();
    var array = []
    var index
    console.log(this.state.search)
    for (index = 0; index < this.state.allPropos.length; index++) { 
      console.log(this.state.allPropos[index].contenu)
      if (String(this.state.allPropos[index].contenu).toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1){
        array.push(this.state.allPropos[index])
      }
    }
    this.setState({allPropos : array})

  }
  
  render() {
    const blogged = API.isAuth();
    const { contenu, categorie, allPropos, allCatPropos} = this.state;
    var sortedPropos = []
    if (this.state.categorie === "" || this.state.categorie === "Toutes les catégories")
      sortedPropos = sortedPropos.concat(this.state.allPropos)
    else 
      sortedPropos = sortedPropos.concat(this.state.allPropos).filter(item => item.categorie.contenu === this.state.categorie)

    return (
      <div className = "Page">
       <Header />
        <div className="addPropos">

          <h3>Propos populaires</h3>
          <div className="divider"></div>

        <label>
          <input className="form-control" id="search" type="text" placeholder="Search" aria-label="Search" onChange={this.handleChange} />
        </label>
        <button className="btn waves-effect waves-light grey darken-3" onClick={this.handleSubmit} type="submit" name="action" value="Envoyer">Submit
          <i className="material-icons right">send</i>
        </button>
        <SplitButton className = "grey darken-3" title={ categorie == "" ? "Tri par catégorie" : categorie } id="split-button-pull-right" style={{marginLeft: 10}}>
          <MenuItem onClick={() => this.setCategorie("Toutes les catégories")}>Toutes les catégories</MenuItem>
          {allCatPropos.map( (cat, i) => {
            return( 
              <MenuItem key={i} onClick={() => this.setCategorie(cat.contenu)}>{cat.contenu}</MenuItem>
            )
          })
          }
        </SplitButton>
        <div className="container" >
          {
            sortedPropos.map
              ( (propos, i) => 
                {
                  return(
                    <div className="row" key={i}>
                      <div className="col s12 m8 offset-m2">
                        <div className="card grey darken-3">
                          <div className="card-content white-text">
                            <div className="row">
                              <span className="left">Proposé par :  {propos.creator != undefined ? propos.creator.pseudo : "Anonyme"} - {propos.categorie.contenu}</span>
                            </div>
                              <span className="card-title"> {propos.contenu} </span>
                              <div className="row" style={{marginBottom: -20}}>
                              <span className= "bottom left">Créé le :  {propos.created_at.substring(0,10)}</span>
                              <span className= "bottom right"><i className="material-icons left">hearing</i> {propos.likes}</span>
                            </div>
                          </div>
                          <div className="card-action">
                            <a href = {`/${propos._id}/commentaire`}>Commentaires</a>
                            <a href = {`/${propos._id}/reponse`}>Reponses</a>
                          </div>
                          <div className="card-action">
                          {
                            blogged ? (
                              <Button className = "orange darken-4" onClick={() => this.like(propos._id)} block bsSize="large" type="submit">
                                Déjà entendu
                              </Button>
                            ) : (
                              <p> Vous devez vous connecter pour signaler que vous avez déjà entendu ce propos ! </p>
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