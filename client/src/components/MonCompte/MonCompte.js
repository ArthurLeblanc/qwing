import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import { Header } from "../Permanent/Header"

export class MonCompte extends React.Component {

    constructor(){
        super();
        this.state = {
            email: "",
            pseudo:"",
            password: "",
            cpassword: ""
        }
        this.setEmail();
        this.setPseudo();
    }

    setEmail = async() => {
        const email = await API.getInfos()
        console.log(email)
        this.setState({email : email.data.email});
    };

    setPseudo = async() => {
        const pseudo = await API.getInfos()
        console.log(pseudo)
        this.setState({pseudo : pseudo.data.pseudo});
    };

  send = async () => {
    const { email, pseudo, password, cpassword } = this.state;
    if (!email || email.length === 0) return;
    if (!password || password.length === 0 || password !== cpassword) return;
    try {
      const { data } = await API.updateAccount({ email, pseudo, password });
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
    const { email, pseudo, password, cpassword } = this.state;
    return (
      <div>
        <Header />
        <div className="Login">
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              readOnly
              autoFocus
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </FormGroup>

      <FormGroup controlId="pseudo" bsSize="large">
            <ControlLabel>Pseudo</ControlLabel>
            <FormControl
              autoFocus
              type="pseudo"
              value={pseudo}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          <FormGroup controlId="cpassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={cpassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          <Button onClick={this.send} block bsSize="large" type="submit">
           Mettre à jour les informations
          </Button>
        </div>
      </div>
	)
  }
}