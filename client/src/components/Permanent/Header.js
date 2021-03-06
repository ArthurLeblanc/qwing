import React from "react";
import { Button, FormGroup, FormControl, ControlLabel, MenuItem, SplitButton } from "react-bootstrap"
import API from "../../utils/API";
import Dropdown from 'react-bootstrap'

export class Header extends React.Component {

    disconnect = () => {
        API.logout();
        window.location = "/";
      };
      
    render() {
        let loginComponent;
        let adminComponent;
        const isAdmin = this.state;
        if (API.isAuth() === false) {
            loginComponent = (
                <ul className="right hide-on-med-and-down">
                    <li><a href="/login" className="waves-effect waves-light btn green "><i className="material-icons left">person</i>Se connecter</a></li>
                    <li><a href="/signup" className="waves-effect waves-light btn green"><i className="material-icons left">person</i>S'inscrire</a></li>
                </ul>
            )
        } else {
            if (API.isAdmin()) {
                adminComponent = (
                    <SplitButton title="Espace Administration" id="split-button-pull-right" className = "grey darken-3">
                        <MenuItem href="/admin/propos">Gérer les propos</MenuItem>
                        <MenuItem href="/admin/reponses">Gérer les réponses</MenuItem>
                        <MenuItem href="/admin/commentaires">Gérer les commentaires</MenuItem>
                        <MenuItem href="/admin/categorie">Ajouter des catégorie</MenuItem>
                    </SplitButton>
                )
            }
            loginComponent = (
                <SplitButton title="Mon compte" id="split-button-pull-right" className = "grey darken-3">
                    <MenuItem href="/listeAimee">Propos déjà entendus</MenuItem>
                    <MenuItem href="/account">Mes infos personnelles</MenuItem>
                    <MenuItem onClick={this.disconnect}>Se déconnecter</MenuItem>
                </SplitButton>
            )
        }
        return (
        <div className = "menu">
            <nav  className="blue darken-2">
                <div className="nav-wrapper orange darken-3">
                <a href="/dashboard" className="brand-logo center">Qwing</a>
                <ul className="left hide-on-med-and-down">
                    <li><a className="active" href= "/dashboard"><i className="material-icons left">home</i>Home</a></li>
                    <li><a href="/propos">Propos Populaires</a></li>
                    <li><a href="/propos-recents">Propos Récents</a></li>
                    <li> { adminComponent }</li>
                </ul>
                <div className="right">
                    { loginComponent }
                </div>
                </div>
             </nav>
        </div>
        )
    }
}