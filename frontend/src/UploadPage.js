import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

var apiBaseUrl = "http://localhost:5000/api/";

class UploadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      image: '',
      userId: '',
      username: ''
    };

    this.handleCreatePost = this.handleCreatePost.bind(this);
  }

  componentDidMount() {
    this.setState({
      userId: this.props.userId,
      uesrname: this.props.username
    });
  }

  handleCreatePost() {
    var self = this;
    var payload = {
      "description": this.state.description,
      "image": this.state.image
    }
    axios.post(apiBaseUrl + 'users/' + this.state.userId + '/posts', payload)
    .then(function (response) {
      console.log(response);
      if (response.status === 201) {
        console.log("Post created successfull");
        self.props.parentContext.setState({postsScreen: []});
        self.props.viewMyPosts();
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
          Create Post
        </h1>
        <TextField
          margin="normal"
          onChange={event => this.setState({image: event.target.value})}
          placeholder="Image Link"
          required={true}
          variant="outlined"
        />
        <br/>
        <TextField
          margin="normal"
          onChange = {event => this.setState({description: event.target.value})}
          placeholder="Description"
          required={true}
          variant="outlined"
        />
        <br/>
        <Button
          onClick={this.handleCreatePost}
          style={style.button}
          variant="contained"
        >
          Submit
        </Button>
      </div>
    );
  }
}

export default UploadPage;
