import React, { Component } from 'react';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import Modal from '@material-ui/core/Modal';

let apiBaseUrl = "http://localhost:5000/api/";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentContent: '',
      comments: [],
      modalOpen: false,
      modalPostId: '',
      posts: [],
      userId: '',
      username: '',
      viewingUser: null
    };

    this.keyDownCreateComment = this.keyDownCreateComment.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleGetComments = this.handleGetComments.bind(this);
    this.handleCreateComment = this.handleCreateComment.bind(this);
  }

  componentDidMount() {
    this.setState({
      posts: this.props.posts,
      userId: this.props.userId,
      username: this.props.username,
      viewingUser: this.props.viewingUser
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: nextProps.posts,
      userId: nextProps.userId,
      username: nextProps.username,
      viewingUser: nextProps.viewingUser
    });
  }

  keyDownCreateComment(e) {
    if (e.keyCode === 13) {
      this.handleCreateComment();
    }
  }

  handleModalOpen(post) {
    this.setState({
      modalDescription: post.description,
      modalImage: post.image,
      modalOpen: true,
      modalPostId: post.id
    },
    this.handleGetComments
    )
  }

  handleModalClose() {
    this.setState({modalOpen: false})
  }

  handleGetComments() {
    let self = this;
    axios.get(apiBaseUrl + 'posts/' + this.state.modalPostId + '/comments')
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        console.log("Comments recieved");
        self.setState({comments: response.data});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleCreateComment() {
    var self = this;
    var payload = {
      "author": this.state.username,
      "content": this.state.commentContent
    };
    axios.post(apiBaseUrl + 'posts/' + this.state.modalPostId + '/comments', payload)
    .then(function (response) {
      console.log(response);
      if (response.status === 201) {
        console.log("Comment created successfull");
      }
      self.setState({commentContent: ''});
      self.handleGetComments();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const style = {
      comment: {
        margin: 20
      },
      commentsBox: {
        display: "flex",
        float: "right",
        flexDirection: "column",
        flexGrow: "100",
        justifyContent: "space-between",
        marginRight: "0"
      },
      imageBox: {
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "inline-block",
        height: "300px",
        margin: 30,
        overflow: "hidden",
        width: "300px"
      },
      modal: {
        backgroundColor: "white",
        display: "flex",
        height: "600px",
        marginRight: "auto",
        marginLeft: "auto",
        maxWidth: "90%",
        overflow: "hidden",
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        width: "900px"
      },
      modalDescription: {
        margin: 20
      },
      modalImage: {
        height: "100%",
        objectFit: "cover",
        width: "100%"
      },
      modalImageBox: {
        display: "inline-block",
        float: "left",
        maxWidth: "600px",
        objectFit: "none",
        objectPosition: "center",
        overflow: "hidden"
      },
      postCommentBox: {
        padding: 20,
        width: "auto"
      }
    };

    return (
      <div>
        {this.state.viewingUser && (
          <div>
            <h1>
              {this.state.viewingUser}
            </h1>
          </div>
        )}
        {this.state.posts.slice(0).reverse().map(post => {
          if (!post.image) {
            return false;
          }
          let imgStyle = Object.assign({}, style.imageBox);
          imgStyle.backgroundImage = "url(" + post.image + ")";
          return (
            <div
              style={imgStyle}
              onClick={() => this.handleModalOpen(post)}
            >
            </div>
          );
        })}
        <Modal
          aria-describedby="simple-modal-description"
          aria-labelledby="simple-modal-title"
          onClose={this.handleModalClose}
          open={this.state.modalOpen}
        >
          <div style={style.modal}>
            <div style={style.modalImageBox}>
              <img
                style={style.modalImage}
                src={this.state.modalImage}
                alt={this.state.modalImage}
              />
            </div>
            <div style={style.commentsBox}>
              <div>
                <p style={style.modalDescription}>
                  {this.state.modalDescription}
                </p>
                <Divider variant="middle" />
                {this.state.comments.map(comment => {
                  if (!comment.author || !comment.content) {
                    return false;
                  }
                  return (
                    <p style={style.comment}>
                      <b>
                        {comment.author + " "}
                      </b>
                      {comment.content}
                    </p>
                  );
                })}
              </div>
              <div>
                <Divider variant="middle" />
                <div style={style.postCommentBox}>
                  <InputBase
                    fullWidth
                    multiline={true}
                    onChange={event => this.setState({commentContent: event.target.value})}
                    onKeyDown={this.keyDownCreateComment}
                    placeholder="Add a Comment"
                    rowsMax={5}
                    value={this.state.commentContent}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Posts;
