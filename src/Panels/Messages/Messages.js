import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    currentChannel: this.props.currentChannel,
    currentUser: this.props.currentUser,
  };
  render() {
    const { messagesRef, currentChannel, currentUser } = this.state;
    return (
      <Fragment>
        <MessagesHeader />

        <Segment raised>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>

        <MessagesForm
          currentChannel={currentChannel}
          messagesRef={messagesRef}
          currentUser={currentUser}
        />
      </Fragment>
    );
  }
}

export default Messages;
