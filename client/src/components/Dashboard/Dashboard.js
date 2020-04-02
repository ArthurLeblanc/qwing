import React from "react";
import API from "../../utils/API";
import { Button, FormGroup, FormControl, ControlLabel, MenuItem, SplitButton, Modal } from "react-bootstrap";
import 'materialize-css/dist/css/materialize.min.css'
import '../../App.css'
import img from '../../img/logo.png';
import M from 'materialize-css'; 
import { Header } from "../Permanent/Header";
import { Categorie } from "../Categorie/Categorie.js";


export class Dashboard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      categorie:"",
      proposId : "",
      allPropos : [],
      allCatPropos : [],
      showModal : false,
      search: ""
  	}

	this.getAllCatPropos = this.getAllCatPropos.bind(this);
	this.getAllPropos = this.getAllPropos.bind(this);
  this.like = this.like.bind(this);
  this.handleClose = this.handleClose.bind(this);
  this.handleShow = this.handleShow.bind(this);
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
	  this.setState({allPropos : callPropos.data.slice(0,5)})
  }

  send = async () => {
    const { contenu, categorie} = this.state;
    if (!contenu || contenu.length === 0) return;
    if (!categorie || categorie.length === 0) return;
    try {
      const { data } = await API.search({"search":contenu})
      if (data && data.score > 2) {
        this.setState({search: data.contenu})
        this.handleShow()
      } else {
        const { data } = await API.addPropos({ contenu, categorie});
        window.location = "/dashboard";
      }
    } catch (error) {
      console.error(error);
    }
  };

  addPropos = async () => {
    const { contenu, categorie} = this.state;
    if (!contenu || contenu.length === 0) return;
    if (!categorie || categorie.length === 0) return;
    try {
      const { data } = await API.addPropos({ contenu, categorie});
      window.location = "/dashboard";
    } catch (error) {
      console.error(error)
    }
  }
  
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleShow = () => this.setState({showModal : true});

  handleClose = () => this.setState({showModal : false});

  render() {
    const blogged = API.isAuth();
	const isadmin = API.isAdmin();
    const { contenu, categorie, allPropos, allCatPropos, top5, showModal, search} = this.state;
    return (
      <div className = "Page">
       <Header />
	   <div className="container" >
      	<div className="row">
          <div className="Dashboard">
            <img src ={img} alt = "logo"></img>
            <h5>Vous avez été victime d'un propos sexiste et vous n'avez pas su répondre ?
			      	Partagez votre expérience
            </h5>
			      <h4>Ecrivez votre propos</h4>
            <SplitButton className = "grey darken-3" title={"Catégorie - " + categorie} id="split-button-pull-right">
              {
              allCatPropos.map
                  ( (catPropos, i) => 
                    {
                      return(
                        <div className = "Catpropos" key = {i}>
                          <Button className ="grey darken-3" onClick={() => this.setCategorie(catPropos.contenu)} block bsSize="large" type="submit">
                            {catPropos.contenu}
                          </Button>
                        </div>
                      )
                    }
                  )
              }
            </SplitButton>
            <FormGroup controlId="contenu" bsSize="large">
              <ControlLabel>Contenu</ControlLabel>
              <FormControl
                autoFocus
                type="contenu"
                value={contenu}
                onChange={this.handleChange}
              />
            </FormGroup>
            <div className="col s12 m2 offset-m5 ">
              <Button className = "grey darken-3" onClick={this.send} block bsSize="large" type="submit">
                Ajouter
              </Button>
           
            </div>
            
          </div>
		  </div>
          <h3>Top 5 des propos populaires</h3>
          <Modal show={showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Un propos similaire existe déjà</Modal.Title>
          </Modal.Header>
          <Modal.Body>{search}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.addPropos}>
              Mon propos est différent !
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
          {
            allPropos.map
              ( (propos, i) => 
                {
                  return(
                    <div className="row" key={i}>
                      <div className="col s12 m8 offset-m2 ">
                        <div className="card grey darken-3">
                          <div className="card-content white-text">
                            <div className="row">
                              <span className="left">Proposé par :  {propos.creator != undefined ? propos.creator.pseudo : "Anonyme"} - {propos.categorie.contenu}</span>
                            </div>
                              <span className="card-title"> Propos</span>
                              <p>Categorie : {propos.categorie.contenu}</p>
                              <p>Description : {propos.contenu}</p>
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
										Déjà entendu !
									</Button>
								) : (
									<p> Vous devez vous connecter pour pour signaler que vous avez déjà entendu ce propos ! </p>
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