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
        if (API.isAuth() === false) {
            loginComponent = (
                <ul class="right hide-on-med-and-down">
                    <li><a href="/login" class="waves-effect waves-light btn green "><i class="material-icons left">person</i>Se connecter</a></li>
                    <li><a href="/signup" class="waves-effect waves-light btn green"><i class="material-icons left">person</i>S'inscrire</a></li>
                </ul>
            )
        } else {
            loginComponent = (
                <SplitButton title="Mon compte" id="split-button-pull-right">
                    <MenuItem href="/propos-aimes">Mes propos aimés</MenuItem>
                    <MenuItem href="/user">Mes infos personnelles</MenuItem>
                    <MenuItem onClick={this.disconnect}>Se déconnecter</MenuItem>
                </SplitButton>
            )
        }
        return (
        <div className = "menu">
        <ul id="dropdown1" class="dropdown-content">
            <li><a href="#!">one</a></li>
            <li><a href="#!">two</a></li>
            <li class="divider"></li>
            <li><a href="#!">three</a></li>
        </ul>
            <nav  class="blue darken-2">
                <div class="nav-wrapper">
                <a href="/dashboard" class="brand-logo center">Qwing</a>
                <ul class="left hide-on-med-and-down">
                    <li><a className="active" href= "/dashboard"><i class="material-icons left">home</i>Home</a></li>
                    <li><a href="/propos">Propos</a></li>
                    <li><a href="#reponses">Reponses</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
                <div class="right">
                    { loginComponent }
                </div>
                </div>
             </nav>
        </div>
        )
    }
}