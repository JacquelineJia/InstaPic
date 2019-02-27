import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PostsScreen from './PostsScreen'

let apiBaseUrl = "http://localhost:5000/api/";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      username: ''
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let self = this;
    let payload = {
      "username": this.state.username,
      "password": this.state.password
    };
    axios.post(apiBaseUrl + 'login', payload)
    .then(function (response) {
      console.log(response);
      if (response.status === 201) {
        console.log("Login successfull");
        let userId = response.data.id;
        let username = response.data.username;
        let postsPage = [];
        postsPage.push(<PostsScreen
          appContext={self.props.appContext}
          userId={userId}
          username={username}
        />);
        self.props.appContext.setState({
          loginPage: [],
          postsPage: postsPage
        });
      }
      else if (response.status === 204) {
        console.log("Invalid username or password");
        alert("Invalid username or password");
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
          Login
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
          onChange={event => this.setState({password: event.target.value})}
          placeholder="Password"
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

export default Login;
