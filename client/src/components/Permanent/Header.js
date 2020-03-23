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
                    <SplitButton title="Espace Administration" id="split-button-pull-right">
                        <MenuItem href="/admin/propos">Gérer les propos</MenuItem>
                        <MenuItem href="/admin/reponses">Gérer les réponses</MenuItem>
                        <MenuItem href="/admin/commentaires">Gérer les commentaires</MenuItem>
                    </SplitButton>
                )
            }
            loginComponent = (
                <SplitButton title="Mon compte" href="/account" id="split-button-pull-right">
                    <MenuItem href="/propos-aimes">Mes propos aimés</MenuItem>
                    <MenuItem href="/user">Mes infos personnelles</MenuItem>
                    <MenuItem onClick={this.disconnect}>Se déconnecter</MenuItem>
                </SplitButton>
            )
        }
        return (
        <div className = "menu">
            <nav  className="blue darken-2">
                <div className="nav-wrapper">
                <a href="/dashboard" className="brand-logo center">Qwing</a>
                <ul className="left hide-on-med-and-down">
                    <li><a className="active" href= "/dashboard"><i className="material-icons left">home</i>Home</a></li>
                    <li><a href="/propos">Propos</a></li>
                    <li> { adminComponent }</li>
                    <li><a href="#about">About</a></li>
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