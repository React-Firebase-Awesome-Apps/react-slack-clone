import React, { Component } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

class Message extends Component {
  state = {
    message: this.props.message,
    user: this.props.user,
    avatar: this.props.avatar
  };

  isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? "message__self" : "";
  };

  componentDidMount = () => {
    const { message, user } = this.state;
    if (message.user.id !== user.uid) {
      this.setState({ avatar: message.user.avatar });
    }
  };

  isImage = message => {
    return (
      this.state.message.hasOwnProperty("image") &&
      !this.state.message.hasOwnProperty("content")
    );
  };

  timeFromNow = timestamp => moment(timestamp).fromNow();
  render() {
    const { message, user, avatar } = this.state;
    return (
      <Comment>
        <Comment.Avatar src={avatar} />
        <Comment.Content className={this.isOwnMessage(message, user)}>
          <Comment.Author as="a">{message.user.name}</Comment.Author>
          <Comment.Metadata>
            {this.timeFromNow(message.timestamp)}{" "}
          </Comment.Metadata>
          {this.isImage(message) ? (
            <Image src={message.image} className="message__image" />
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    );
  }
}

export default Message;
