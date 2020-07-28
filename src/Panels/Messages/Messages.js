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
    usersRef: firebase.database().ref("users"),
    currentChannel: this.props.currentChannel,
    privateChannel: this.props.isPrivateChannel,
    currentUser: this.props.currentUser,
    messages: [],
    numUniqueUsers: "",
    messagesLoading: true,
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    isChannelFavorite: false
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.state;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
      this.addUserFavoriteChannelsListener(currentChannel.id, currentUser.uid);
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

  addUserFavoriteChannelsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("favorite")
      .once("value")
      .then(data => {
        // if (data.val() !== null)
        // data.exists(): Returns true if this DataSnapshot contains any data.
        // It is slightly more efficient than using snapshot.val() !== null.
        if (data.exists()) {
          const channelIds = Object.keys(data.val());
          const prevFavorite = channelIds.includes(channelId);
          this.setState({ isChannelFavorite: prevFavorite });
        }
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

  handleFavoriteChannels = () => {
    this.setState(
      prevState => ({
        isChannelFavorite: !prevState.isChannelFavorite
      }),
      () => this.favoriteTheChannel()
    );
  };

  favoriteTheChannel = () => {
    if (this.state.isChannelFavorite) {
      // console.log("Favorite the channel");
      this.state.usersRef
        .child(`${this.state.currentUser.uid}/favorite`)
        .update({
          [this.state.currentChannel.id]: {
            name: this.state.currentChannel.name,
            details: this.state.currentChannel.details,
            createdBy: {
              name: this.state.currentChannel.createdBy.name,
              avatar: this.state.currentChannel.createdBy.avatar
            }
          }
        });
    } else {
      // console.log("Unfavorite the channel");
      this.state.usersRef
        .child(`${this.state.currentUser.uid}/favorite`)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
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
      privateChannel,
      isChannelFavorite
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          handleSearchChange={this.handleSearchChange}
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          isChannelFavorite={isChannelFavorite}
          handleFavoriteChannels={this.handleFavoriteChannels}
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
