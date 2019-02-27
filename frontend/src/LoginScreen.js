import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Login from './Login';
import Register from './Register';

// LoginScreen shows the login or register pages
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLabel: 'Register',
      isLogin: true,
      loginScreen: [],
      loginMessage: '',
      password: '',
      username: ''
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    let loginScreen = [];
    loginScreen.push(<Login
      appContext={this.props.appContext}
      parentContext={this}
    />);
    let loginMessage = "Not registered yet? Register Now";
    this.setState({
      loginMessage: loginMessage,
      loginScreen: loginScreen
    });
  }

  handleClick() {
    let loginMessage;
    let loginScreen = [];
    if (this.state.isLogin) {
      loginScreen.push(<Register
        appContext={this.props.appContext}
        parentContext={this}
      />);
      this.setState({
        buttonLabel: "Login",
        isLogin: false,
        loginScreen: loginScreen,
        loginMessage: "Already registered? Login"
      })
    }
    else {
      loginScreen.push(<Login
        appContext={this.props.appContext}
        parentContext={this}
      />);
      this.setState({
        buttonLabel: "Register",
        isLogin: true,
        loginScreen: loginScreen,
        loginMessage: "Not Registered yet. Go to registration"
      })
    }
  }

  render() {
    const style = {
      button: {
        margin: 15
      }
    };

    return (
      <div className="loginScreen">
        {this.state.loginScreen}
        <div>
          <br/>
          {this.state.loginMessage}
          <div>
            <Button
              onClick={this.handleClick}
              style={style.button}
              variant="contained"
            >
              {this.state.buttonLabel}
            </Button>
         </div>
        </div>
      </div>
    );
  }
}

export default LoginScreen;
