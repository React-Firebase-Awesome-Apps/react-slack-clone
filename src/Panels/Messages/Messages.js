import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    currentChannel: this.props.currentChannel,
    currentUser: this.props.currentUser,
    messages: [],
    messagesLoading: true
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.state;
    // console.log(!!currentChannel, !!currentUser);
    
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }

  addListeners = channelId => {
    this.addMesaggeListener(channelId);
  };
  addMesaggeListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages => {
      console.log("displayMessages", messages);
      
    return messages.length > 0 &&
      messages.map(message => {
        return (
          <Message
            key={message.timeStamp}
            message={message}
            user={this.state.currentUser}
          />
        );
      });
  };
  render() {
    const { messages } = this.state;
    const { messagesRef, currentChannel, currentUser } = this.state;
    return (
      <Fragment>
        <MessagesHeader />

        <Segment raised>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
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
