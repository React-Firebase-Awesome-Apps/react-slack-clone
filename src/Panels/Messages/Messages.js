import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";

import firebase from "../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from "../../store/actions";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import Typing from "./Typing";
import Skeleton from "./Skeleton";

// Child of App
class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    usersRef: firebase.database().ref("users"),
    typingRef: firebase.database().ref("typing"),
    connectedRef: firebase.database().ref("info/connected"),
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
    photoURL: "",
    typingUsers: [],
    listeners: []
  };

  componentDidMount() {
    const { currentChannel, currentUser, listeners } = this.state;
    if (currentChannel && currentUser) {
      this.removeListeners(listeners);
      this.addListeners(currentChannel.id);
      this.addUserFavoriteChannelsListener(currentChannel.id, currentUser.uid);
    }

    // extra: not from course
    if (!!this.state.currentUser && !!currentChannel) {
      firebase
        .database()
        .ref(`users/${this.state.currentUser.uid}`)
        .on("value", snapshot => {
          // console.log(snapshot.val());
          this.setState({ photoURL: snapshot.val().avatar });
        });

      this.addToListeners(
        currentChannel.id,
        firebase.database().ref(`users/${this.state.currentUser.uid}`),
        "value"
      );
    }
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    this.state.connectedRef.off();
  }

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  addToListeners = (id, ref, event) => {
    // Check if we already have the listener.
    const index = this.state.listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });
    // If we don't have that listener, add it.
    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView(true, { behavior: "smooth" });
  };

  addListeners = channelId => {
    this.addMesaggeListener(channelId);
    this.addTypingListeners(channelId);
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
    this.addToListeners(channelId, ref, "child_added");
  };

  addTypingListeners = channelId => {
    let typingUsers = [];
    this.state.typingRef.child(channelId).on("child_added", snap => {
      // do not collect the current user
      if (snap.key !== this.state.currentUser.uid) {
        // Why the assingment?
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        this.setState({ typingUsers });
      }
      // console.log("typingUsers", typingUsers);
    });

    this.addToListeners(channelId, this.state.typingRef, "child_added");

    this.state.typingRef.child(channelId).on("child_removed", snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });

    this.addToListeners(channelId, this.state.typingRef, "child_removed");

    // Remove animation if user is disconnected
    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.state.currentUser.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.error(err);
            }
          });
      }
    });
    // extra: not from course
    this.addToListeners(channelId, this.state.connectedRef, "value");
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

    // extra: not from course
    this.addListeners(
      channelId,
      this.state.usersRef.child(userId).child("favorites"),
      "value"
    );
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

  displayTypingUsers = users =>
    users.length > 0 &&
    users.map(user => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "0.2em"
        }}
        key={user.id}
      >
        <span className="user__typing">
          {user.name} is typing <Typing />
        </span>
      </div>
    ));

  displayMessagesSkeleton = loading =>
    loading ? (
      <React.Fragment>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </React.Fragment>
    ) : null;

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
      photoURL,
      typingUsers,
      messagesLoading
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
            {this.displayMessagesSkeleton(messagesLoading)}
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messagesEnd = node)}></div>
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
