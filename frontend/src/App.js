import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import logo from './logo.svg';
import './App.css';
import LoginScreen from './LoginScreen';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginPage: [],
      postsPage: []
    };
  }

  componentWillMount() {
    let loginPage = [];
    loginPage.push(<LoginScreen
      parentContext={this}
      appContext={this}
    />);
    this.setState({
      loginPage: loginPage
    });
  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <div className="App">
          {this.state.loginPage}
          {this.state.postsPage}
        </div>
      </div>
    );
  }
}

export default App;
