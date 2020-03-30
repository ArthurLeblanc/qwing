import React from "react";
import { Button } from "react-bootstrap";
import { Header } from "../Permanent/Header";
import API from "../../utils/API";

export class ProposRecents extends React.Component {

  constructor(props){
	super(props);
	this.state = {
    allPropos : [],
    search : ""

	}
	
    this.like = this.like.bind(this)
    this.getAllPropos()
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
    var callPropos = await API.getAllPropos();
    var sortage = Array.from(callPropos.data).sort(function(a, b) {
      return  (new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime()
    });
    console.log(sortage)
    this.setState({allPropos : sortage})
  }

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

  disconnect = () => {
    API.logout();
    window.location = "/";
  };

  render () {
	const { allPropos } = this.state;
	const blogged = API.isAuth();
	console.log(blogged)
    return (

		<div className="Dashboard">
		<Header />


		  <h3>Les plus récents</h3>
			<div className="divider"></div>
      <label>
          <input className="form-control" id="search" type="text" placeholder="Search" aria-label="Search" onChange={this.handleChange} />
        </label>
        <button className="btn waves-effect waves-light" onClick={this.handleSubmit} type="submit" name="action" value="Envoyer">Submit
    <i className="material-icons right">send</i>
  </button>
			<div className="container" >
		  {
            allPropos.map
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
