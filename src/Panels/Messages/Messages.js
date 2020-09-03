import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";

import firebase from "../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from "../../store/actions";
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
    isChannelFavorite: false,
    photoURL: ""
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.state;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
      this.addUserFavoriteChannelsListener(currentChannel.id, currentUser.uid);
    }

    if (!!this.state.currentUser) {
      firebase
        .database()
        .ref(`users/${this.state.currentUser.uid}`)
        .on("value", snapshot => {
          console.log(snapshot.val());
          this.setState({ photoURL: snapshot.val().avatar });
        });
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
      this.countUserPosts(loadedMessages);
    });
  };

  addUserFavoriteChannelsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("favorites")
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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      // console.log('messages',messages);
      // console.log('message',message);
      
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
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
        avatar={this.state.photoURL}
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
    const {
      usersRef,
      currentChannel,
      currentUser,
      isChannelFavorite
    } = this.state;

    if (isChannelFavorite) {
      // console.log("Favorite the channel");
      usersRef.child(`${currentUser.uid}/favorites`).update({
        [currentChannel.id]: {
          name: currentChannel.name,
          details: currentChannel.details,
          createdBy: {
            name: currentChannel.createdBy.name,
            avatar: currentChannel.createdBy.avatar
          }
        }
      });
    } else {
      // console.log("Unfavorite the channel");
      usersRef
        .child(`${currentUser.uid}/favorites`)
        .child(currentChannel.id)
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
      isChannelFavorite,
      photoURL
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
          avatar={photoURL}
        />
      </Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
