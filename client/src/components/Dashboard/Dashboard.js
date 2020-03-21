import React from "react";
import { Button } from "react-bootstrap";
import { Header } from "../Permanent/Header";
import API from "../../utils/API";

export class Dashboard extends React.Component {

  constructor(props){
	super(props);
	this.state = {
		top5 : []
	}
	
	this.getTop5 = this.getTop5.bind(this);
	this.like = this.like.bind(this)
	this.dislike = this.dislike.bind(this)
	  
	this.getTop5();
  }

  	like = async(proposId) => {
		await API.like(proposId);
	}
	dislike = async(proposId) => {
		await API.dislike(proposId);
	}

  getTop5 = async() => {
	const cTop5 = await API.getAllPropos();
	this.setState({top5 : cTop5.data})
  }

  disconnect = () => {
    API.logout();
    window.location = "/";
  };


  render() {
	const { top5} = this.state;
	console.log(top5)
    return (

		<div className="Dashboard">
		<Header />
		  <h2>Accueil</h2>
		  <p>
		    Vous avez été victime d'un propos sexiste et vous n'avez pas su répondre ?
				Partagez votre expérience
		  </p>
		  <Button onClick={ () => window.location = "/propos"} bsSize="large" type="submit">
			Voir les propos
		  </Button>
		  <Button onClick={ () => window.location = "/catPropos"} bsSize="large" type="submit">
			ajouter une categorie (admin)
		  </Button>

		  <h3>Les plus populaires</h3>
			<div class="divider"></div>
			<div className="container" >
		  {
            top5.map
              ( (propos, i) => 
                {
                  return(
                    <div className="row" key={i}>
                      <div className="col s12 m6 offset-m3">
                        <div className="card blue-grey darken-1">
                          <div className="card-content white-text">
							<div className="row">
							  <span className="left">Proposé par :  {propos.creator != undefined ? propos.creator.pseudo : "Anonyme"} - {propos.categorie.contenu}</span>
							</div>
							  <span className="card-title"> {propos.contenu} </span>
							  <div className="row" style={{marginBottom: -20}}>
							  <span className= "bottom left">Créé le :  {propos.created_at.substring(0,10)}</span>
							  <span className= "bottom right"><i class="material-icons left">thumb_up</i> {propos.likes}</span>
							</div>
                          </div>
                          <div className="card-action">
                            <a href = {`/${propos._id}/commentaire`}>Commentaires</a>
                            <a href = {`/${propos._id}/reponse`}>Reponses</a>
                          </div>
						  <div className="card-action">
                            <Button onClick={() => this.like(propos._id)} block bsSize="large" type="submit">
                              Like
                            </Button>
                            <Button onClick={() => this.dislike(propos._id)}  block bsSize="large" type="submit">
                              Dislike
                            </Button>
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