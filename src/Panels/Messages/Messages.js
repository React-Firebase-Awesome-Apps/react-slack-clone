import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";

// Child of App
class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    currentChannel: this.props.currentChannel,
    privateChannel: this.props.isPrivateChannel,
    currentUser: this.props.currentUser,
    messages: [],
    numUniqueUsers: "",
    messagesLoading: true,
    searchTerm: "",
    searchLoading: false,
    searchResults: []
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.state;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }

  addListeners = channelId => {
    this.addMesaggeListener(channelId);
  };
  addMesaggeListener = channelId => {
    const ref = this.getMessagesRef();
    let loadedMessages = [];
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      // With this if check we get from every comment the user's name
      // just once...
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
  };

  // We need to remove listeners!!!
  componentWillUnmount = () => {
    this.removeListeners();
  };
  removeListeners = () => this.state.messagesRef.off();

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.currentUser}
      />
    ));

  displayChannelName = channel =>
    !!channel ? `${this.state.privateChannel ? "@" : "#"}${channel.name}` : "";

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    // flag gi = global and case insensitively
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, messages) => {
      if (
        (messages.content && messages.content.match(regex)) ||
        messages.user.name.match(regex)
      ) {
        acc.push(messages);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 500);
  };

  render() {
    const {
      messagesRef,
      currentChannel,
      currentUser,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          handleSearchChange={this.handleSearchChange}
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
        />

        <Segment raised>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          messagesRef={messagesRef}
          currentUser={currentUser}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    );
  }
}

export default Messages;
