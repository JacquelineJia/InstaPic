import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import axios from 'axios';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import LoginScreen from './LoginScreen';
import Posts from './Posts';
import UploadPage from './UploadPage';

let apiBaseUrl = "http://localhost:5000/api/";

// PostsScreen shows posts, or the upload page
class PostsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsScreen: [],
      searchUsername: '',
      userId: '',
      username: ''
    };

    this.handleViewAllPosts = this.handleViewAllPosts.bind(this);
    this.handleViewMyPosts = this.handleViewMyPosts.bind(this);
    this.handleViewUsersPost = this.handleViewUsersPost.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.searchKeyPress = this.searchKeyPress.bind(this);
  }

  componentDidMount() {
    this.setState({
      userId: this.props.userId,
      username: this.props.username,
    }, () => {
      this.handleViewMyPosts();
    });
  }

  searchKeyPress(e) {
    if (e.keyCode === 13) {
      this.handleViewUsersPost();
    }
  }

  handleViewAllPosts() {
    let self = this;
    axios.get(apiBaseUrl + 'posts')
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        let posts = response.data;
        let postsScreen = [];
        postsScreen.push(<Posts
          appContext={self.props.appContext}
          posts={posts}
          userId={self.state.userId}
          username={self.state.username}
          viewingUser={null}
        />);
        self.setState({postsScreen: postsScreen});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleViewMyPosts() {
    let self = this;
    let { userId, username } = this.state;
    axios.get(apiBaseUrl + 'users/' + userId + '/posts')
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        let posts = response.data;
        let postsScreen = [];
        postsScreen.push(<Posts
          appContext={self.props.appContext}
          posts={posts}
          userId={userId}
          username={username}
          viewingUser={username}
        />);
        self.setState({postsScreen: postsScreen});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleViewUsersPost() {
    let self = this;
    let { userId, username, searchUsername } = this.state;
    console.log(searchUsername);
    axios.get(apiBaseUrl + 'username/' + searchUsername)
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        return axios.get(apiBaseUrl + 'users/' + response.data.id + '/posts')
        .catch(function (error) {
          console.log(error);
        });
      }
    })
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        let posts = response.data;
        let postsScreen = [];
        postsScreen.push(<Posts
          appContext={self.props.appContext}
          posts={posts}
          userId={userId}
          username={username}
          viewingUser={searchUsername}
        />);
        self.setState({postsScreen: postsScreen});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleCreatePost() {
    let postsScreen = [];
    postsScreen.push(<UploadPage
      appContext={this.props.appContext}
      parentContext={this}
      userId={this.state.userId}
      username={this.state.username}
      viewMyPosts={this.handleViewMyPosts}
    />);
    this.setState({postsScreen: postsScreen});
  }

  handleLogout() {
    let self = this;
    axios.post(apiBaseUrl + 'logout')
    .then(function (response) {
      console.log(response);
      if (response.status === 201) {
        console.log("Logout successfull");
        let loginPage = [];
        loginPage.push(<LoginScreen
          appContext={self.props.appContext}
          isLogin={true}
          parentContext={self}
        />);
        self.props.appContext.setState({
          loginPage: loginPage,
          postsPage: []
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const style = {
      input: {
        width: '100%'
      },
      search: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        marginLeft: '30%',
        width: '30%'
      },
      toolbarButtons: {
        marginLeft: 'auto'
      }
    };

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.handleViewAllPosts}>
              <Typography variant="h6" noWrap>
                InstaPic
              </Typography>
            </IconButton>
            <div style={style.search}>
              <SearchIcon/>
              <InputBase
                style={style.input}
                placeholder="Search"
                onChange={event => this.setState({searchUsername: event.target.value})}
                onKeyDown={this.searchKeyPress}
              />
            </div>
            <div style={style.toolbarButtons}>
              <IconButton onClick={this.handleViewMyPosts}>
                <AccountCircleIcon />
              </IconButton>
              <IconButton onClick={this.handleCreatePost}>
                <AddCircleIcon />
              </IconButton>
              <IconButton onClick={this.handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.state.postsScreen}
      </div>
    );
  }
}

export default PostsScreen;
