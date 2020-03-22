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
	  
	this.getTop5();
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
	  this.getTop5()
  }


  getTop5 = async() => {
	const cTop5 = await API.getAllPropos();
	this.setState({top5 : cTop5.data})
  }

  disconnect = () => {
    API.logout();
    window.location = "/";
  };

  render () {
	const { top5} = this.state;
	const blogged = API.isAuth();
	console.log(blogged)
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
			<div className="divider"></div>
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
							  <span className= "bottom right"><i className="material-icons left">thumb_up</i> {propos.likes}</span>
							</div>
                          </div>
                          <div className="card-action">
                            <a href = {`/${propos._id}/commentaire`}>Commentaires</a>
                            <a href = {`/${propos._id}/reponse`}>Reponses</a>
                          </div>
						  <div className="card-action">
							{
								blogged ? (
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

    );
  }
}