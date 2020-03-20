import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import { CatPropos } from "../CatPropos/CatPropos";
import { Timestamp } from "mongodb";

export class Reponse extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      categorie : "",
      proposId : this.props.match.params.proposId,
      propos : "",
      allReponses : []
	  }

	this.getAllReponse = this.getAllReponse.bind(this);
    this.getProposId = this.getProposId.bind(this);

	this.getProposId();
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
    const { contenu, categorie, propos, allReponses} = this.state;
    return (
      <div className = "Page">
        <div className = "menu">
          <h1>Qwing</h1>
          <ul>
            <li><a className="active" href= "/dashboard">Home</a></li>
            <li><a href="/propos">Propos</a></li>
            <li><a href="#reponses">Reponses</a></li>
            <li><a href="#about">About</a></li>
            <Button onClick={this.disconnect} bsSize="large" type="submit">
                  Se deconnecter
            </Button>
          </ul>
        </div>
        <div className="addPropos">
          <h3>Ecrivez votre reponse</h3>
          <FormGroup controlId="contenu" bsSize="large">
            <ControlLabel>Contenu</ControlLabel>
            <FormControl
              autoFocus
              type="contenu"
              value={contenu}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="categorie" bsSize="large">
            <ControlLabel>Categorie</ControlLabel>
            <FormControl
              autoFocus
              type="categorie"
              value={categorie}
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
                  <a>retour aux propos</a>
                  <a>Reponses</a>
                </div>
              </div>
            </div>
          </div>
          
          {
            allReponses.map
              (reponse => 
                {
                  return(
                    <div className="row">
                      <div className="col s12 m6">
                        <div className="card blue-grey darken-1">
                          <div className="card-content white-text">
                            <span className="card-title">  // like : {reponse.likes} </span>
                            <p>{reponse.contenu}</p>
                          </div>
                          <div className="card-action">
                            <a>Like</a>
                            <a>Dislike</a>
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
