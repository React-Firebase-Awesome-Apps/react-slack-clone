import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase";

class MessagesForm extends Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    loading: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = () => {
    const { message, user, channel } = this.state;
    return {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      channelName: channel.name,
      content: message,
      user: {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      }
    };
  };
  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  render() {
    const { errors, message } = this.state;
    return (
      <Segment className="messages__form">
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder={
            errors.some(error => error.message.includes("message"))
              ? errors.map(error => error.message)
              : "Write your message"
          }
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            color="green"
            content="Add reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessagesForm;