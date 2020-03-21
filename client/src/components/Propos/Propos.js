import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'; 
import { Header } from "../Permanent/Header";

export class Propos extends React.Component {

  componentDidMount() {
    let elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {inDuration: 300, outDuration: 225});
  }

  constructor(props){
    super(props);
    this.state = {
      contenu: "",
      categorie:"",
      proposId : "",
      allPropos : []
	  }

	this.getAllPropos = this.getAllPropos.bind(this);
  this.like = this.like.bind(this);
	this.dislike = this.dislike.bind(this);

	this.getAllPropos();



  }

  like = async(proposId) => {
    const {test} = await API.like({"proposId": proposId});
  }
  dislike = async(proposId) => {
  	const {test} =await API.dislike({"proposId": proposId});
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
    const { contenu, categorie, allPropos} = this.state;
    return (
      <div className = "Page">
       <Header />
        <div className="addPropos">

            <div className="input-field col s12">
              <a className='dropdown-button btn' data-activates='dropdown1'>Drop Me!</a>
              <ul id='dropdown1' className='dropdown-content'>
                <li><a href="#!">one</a></li>
                <li><a href="#!">two</a></li>
                <li className="divider"></li>
                <li><a href="#!">three</a></li>
                <li><a href="#!"><i className="material-icons">view_module</i>four</a></li>
                <li><a href="#!"><i className="material-icons">cloud</i>five</a></li>
              </ul>
            </div>
          

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
              (propos => 
                {
                  return(
                    <div className="row">
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
                            <Button onClick={ () => this.like(propos._id)} block bsSize="large" type="submit">
                              Like
                            </Button>
                            <Button onClick={ () =>this.dislike(propos._id)} block bsSize="large" type="submit">
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
	)
  }
}
