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
    currentChannel: this.props.currentChannel,
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
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
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
    const lesThanOne = uniqueUsers.length <= 1;
    const numUniqueUsers = `${uniqueUsers.length} user${lesThanOne ? "" : "s"}`;
    this.setState({ numUniqueUsers });
  };

  // We stiil need to remove listeners!!!
  // componentWillUnmount = () => {
  //   this.removeListeners();
  // };
  // removeListeners = () => this.state.messagesRef.off();

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.currentUser}
      />
    ));

  displayChannelName = channel => (!!channel ? `# ${channel.name}` : "");

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
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
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
      searchLoading
    } = this.state;
    return (
      <Fragment>
        <MessagesHeader
          handleSearchChange={this.handleSearchChange}
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
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
        />
      </Fragment>
    );
  }
}

export default Messages;
