import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";
import { Header } from "../Permanent/Header"

export class Signup extends React.Component {

  state = {
    email: "",
	pseudo:"",
    password: "",
    cpassword: ""
  };

  send = async () => {
    const { email, pseudo, password, cpassword } = this.state;
    if (!email || email.length === 0) return;
    if (!password || password.length === 0 || password !== cpassword) return;
    try {
      const { data } = await API.signup({ email, pseudo, password });
      localStorage.setItem("token", data.token);
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
            Inscription
          </Button>
        </div>
      </div>
	)
  }
}