import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";

import firebase from "../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../store/actions";

// Child of SidePanel
class FavoriteChannels extends Component {
  state = {
    activeChannel: "",
    favoriteChannels: [],
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users")
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = userId => {
    // 1. When we favorite a channel.
    this.state.usersRef
      .child(userId)
      .child("favorite")
      .on("child_added", snap => {
        const favoriteChannel = { id: snap.key, ...snap.val() };
        this.setState({
          favoriteChannels: [...this.state.favoriteChannels, favoriteChannel]
        });
      });

    // 2. When we unfavorite a channel.
    this.state.usersRef
      .child(userId)
      .child("favorite")
      .on("child_removed", snap => {
        const channelToRemove = { id: snap.key, ...snap.val() };
        const filteredChannels = this.state.favoriteChannels.filter(channel => {
          return channel.id !== channelToRemove.id;
        });
        this.setState({
          favoriteChannels: filteredChannels
        });
      });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };
  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };
  displayChannels = favoriteChannels => {
    return (
      favoriteChannels.length > 0 &&
      favoriteChannels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => this.changeChannel(channel)}
          active={this.state.activeChannel === channel.id}
          name={channel.name}
          style={{ opacity: "0.7" }}
        >
          {/* {this.getNotificationsCount(channel) && (
            <Label color="red">{this.getNotificationsCount(channel)} </Label>
          )} */}
          # {channel.name}
        </Menu.Item>
      ))
    );
  };

  render() {
    const { favoriteChannels } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="heart outline" />
            Favorite Channels
          </span>{" "}
          ({favoriteChannels.length})
        </Menu.Item>
        {this.displayChannels(favoriteChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  FavoriteChannels
);
