import React from "react";
import { Button } from "react-bootstrap";
import { Header } from "../Permanent/Header";
import API from "../../utils/API";

export class ListeAimee extends React.Component {

  constructor(props){
	super(props);
	this.state = {
		proposAimes : []
	}
	
    this.setListe = this.setListe.bind(this);
    this.setListe();
    
  }

  setListe = async() => {
	  //verifie si le user a déja like le propos, si oui unlike, sinon like
	  const info = await API.getInfos()
      if ( typeof info.data !== 'undefined')
		var proposLikes = info.data.likesPropos
      this.setState({proposAimes : proposLikes})
  }


  disconnect = () => {
    API.logout();
    window.location = "/";
  };

  render () {
    const { proposAimes} = this.state;
    return (
		<div className="Liste">
		<Header />
		  <h2>Liste des propos aimés</h2>
		  {
            proposAimes.map
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
							  <span className= "bottom right"><i className="material-icons left">thumb_up</i> {propos.likes}</span>
							</div>
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

    );
  }
}