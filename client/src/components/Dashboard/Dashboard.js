import React from "react";
import { Button } from "react-bootstrap";

import API from "../../utils/API";

export class Dashboard extends React.Component {

  constructor(props){
	super(props);
	this.state = {
		top5 : []
	}
	
	this.getTop5 = this.getTop5.bind(this);
	
	this.getTop5();

  }

  getTop5 = async() => {
	const cTop5 = await API.getTop5();
	this.setState({top5 : cTop5.data})
  }

  disconnect = () => {
    API.logout();
    window.location = "/";
  };


  render() {
	const { top5} = this.state;
    return (
	  <div className = "Page">
		<div className = "menu">
		  <h1>Qwing</h1>
		  <ul>
			<li><a className="active" href= "/dashboard">Home</a></li>
			<li><a href="/Propos">Propos</a></li>
			<li><a href="/signup">Register</a></li>
			<li><a href="#compte">Mon Compte</a></li>
			<li><a href="#about">About</a></li>
			<Button onClick={this.disconnect} bsSize="large" type="submit">
					Se deconnecter
			</Button>
		  </ul>
		</div>
		<div className="Dashboard">
		  <h2>Accueil</h2>
		  <p>
		    Vous trouverez ici les propos sexistes que les utilisateurs ont entendus
			Vous pouvez proposer une réponse pour ne pas rester de marbre face � ces diffamations.
		  </p>
		  <Button onClick={ () => window.location = "/propos"} bsSize="large" type="submit">
			Voir les propos
		  </Button>
		  <Button onClick={ () => window.location = "/catPropos"} bsSize="large" type="submit">
			ajouter une categorie (admin)
		  </Button>
		  <h3>Top 5 des propos</h3>
		  {
            top5.map
              ( (propos, i) => 
                {
                  return(
                    <div className="row" key={i}>
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
                        </div>
                      </div>
                    </div>
                  )
                }
              )
          }

		</div>
	  </div>
    );
  }
}