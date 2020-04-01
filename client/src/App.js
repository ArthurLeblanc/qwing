//import logo from './logo.svg';
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Dashboard } from "./components/Dashboard/Dashboard.js";
import { Login } from "./components/Login/Login.js";
import { Signup } from "./components/Signup/Signup.js";
import { Propos } from "./components/Propos/Propos.js";
import { ProposRecents } from "./components/ProposRecents/ProposRecents.js";
import { Categorie } from "./components/Categorie/Categorie.js";
import { Commentaire } from "./components/Commentaire/Commentaire.js";
import { Reponse } from "./components/Reponse/Reponse.js";
import { ListeAimee } from "./components/ListeAimee/ListeAimee.js";
import { MonCompte } from "./components/MonCompte/MonCompte.js";
import { PrivateRoute } from "./components/PrivateRoute.js";
import "./App.css";
import "./css/Style1.css"
import { AdminRoute } from "./components/AdminRoute.js";
import { ProposAdmin } from "./components/Admin/ProposAdmin";
import { ReponsesAdmin } from "./components/Admin/ReponsesAdmin";
import { CommentairesAdmin } from "./components/Admin/CommentairesAdmin";

/* Fonctionnel */
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

/* Avec une classe */
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-content">
		  <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <AdminRoute path="/admin/propos" component={ProposAdmin} />
              <AdminRoute path="/admin/reponses" component={ReponsesAdmin} />
              <AdminRoute path="/admin/commentaires" component={CommentairesAdmin} />
              <AdminRoute exact path="/admin/categorie" component = {Categorie} />
              <Route exact path="/propos" component = {Propos} />
              <Route exact path="/propos-recents" component = {ProposRecents} />
              <Route exact path="/listeAimee" component = {ListeAimee} />
              <Route exact path="/:proposId/commentaire" component = {Commentaire} />
              <Route exact path="/:proposId/reponse" component = {Reponse} />
              <Route exact path="/account" component = {MonCompte} />
            </Switch>
		  </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
