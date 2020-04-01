import React from "react";
import { Button, SplitButton, MenuItem } from "react-bootstrap";
import { Header } from "../Permanent/Header";
import API from "../../utils/API";

export class ProposRecents extends React.Component {

  constructor(props){
	super(props);
	this.state = {
    allPropos : [],
    categorie:"",
    allCatPropos : [],
    search : ""

	}
    this.getAllCatPropos = this.getAllCatPropos.bind(this);
    this.setCategorie = this.setCategorie.bind(this);
    this.like = this.like.bind(this)
    this.getAllPropos()
    this.getAllCatPropos();
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

  setCategorie = async(vcategorie) => {
    this.setState({categorie : vcategorie});
  }
  getAllCatPropos = async() => {
    const callCatPropos = await API.getAllCatPropos()
    this.setState({allCatPropos : callCatPropos.data});
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
  const { categorie, allPropos, allCatPropos} = this.state;
  const blogged = API.isAuth();
  var sortedPropos = []
  if (this.state.categorie === "" || this.state.categorie === "Toutes les catégories")
    sortedPropos = sortedPropos.concat(this.state.allPropos)
  else 
    sortedPropos = sortedPropos.concat(this.state.allPropos).filter(item => item.categorie.contenu === this.state.categorie)

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
       <SplitButton title={ categorie == "" ? "Tri par catégorie" : categorie } id="split-button-pull-right" style={{marginLeft: 10}}>
        <MenuItem onClick={() => this.setCategorie("Toutes les catégories")}>Toutes les catégories</MenuItem>
        {allCatPropos.map( (cat, i) => {
          return( <MenuItem key={i} onClick={() => this.setCategorie(cat.contenu)}>{cat.contenu}</MenuItem> )
        })}
        </SplitButton>
			<div className="container" >
		  {
            sortedPropos.map
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
									<Button onClick={() => this.like(propos._id)} block bsSize="large" type="submit">
										Like
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

    );
  }
}
