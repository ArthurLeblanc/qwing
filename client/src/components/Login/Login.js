import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import { Header } from "../Permanent/Header";

export class Login extends React.Component {

  state = {
    email: "",
    password: ""
  };

  send = async () => {
    const { email, password } = this.state;
    console.log(email)
    if (!email || email.length === 0) {
      return;
    }
    if (!password || password.length === 0) {
      return;
    }
    try {
      const { data } = await API.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin);
      console.log(data)
      window.location = "/dashboard"

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
    const { email, password } = this.state;
    return (
      <div className="Login">
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
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
        <Button onClick={this.send} block bsSize="large" type="submit">
          Connexion
        </Button>
        <Button onClick={() => window.location = "/dashboard"} block bsSize="large" type="submit">
          Mode hors-ligne
        </Button>
        <Button onClick={() => window.location = "/signup"} block bsSize="large" type="submit">
          Inscription
        </Button>
      </div>
	)
  }
}