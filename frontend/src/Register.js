import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Login from './Login';

let apiBaseUrl = "http://localhost:5000/api/";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      password2: '',
      username: ''
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let { username, password, password2 } = this.state;
    if (!username || !password || !password2 || password !== password2) {
      alert('Please enter info correctly');
      return;
    }
    let self = this;
    let payload = {
      "password": password,
      "username": username
    };
    axios.post(apiBaseUrl + 'users', payload)
    .then(function (response) {
      console.log(response);
      if (response.status === 201) {
        console.log("Registration successfull");
        let loginScreen = [];
        loginScreen.push(<Login
          appContext={self.props.appContext}
          parentContext={self}
        />);
        self.props.parentContext.setState({
          buttonLabel: "Register",
          isLogin: true,
          loginScreen: loginScreen
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const style = {
      button: {
        margin: 15
      }
    };

    return (
      <div>
        <h1>
          Register
        </h1>
        <TextField
          margin="normal"
          onChange={event => this.setState({username: event.target.value})}
          placeholder="Username"
          required={true}
          variant="outlined"
        />
        <br/>
        <TextField
          margin="normal"
          onChange = {event => this.setState({password: event.target.value})}
          placeholder="Password"
          required={true}
          type="password"
          variant="outlined"
        />
        <br/>
        <TextField
          margin="normal"
          onChange = {event => this.setState({password2: event.target.value})}
          placeholder="Retype Password"
          required={true}
          type="password"
          variant="outlined"
        />
        <br/>
        <Button
          onClick={this.handleClick}
          style={style.button}
          variant="contained"
        >
          Submit
        </Button>
      </div>
    );
  }
}

export default Register;
