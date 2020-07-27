import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../store/actions";

import { Menu, Icon, Label } from "semantic-ui-react";

class FavoriteChannels
 extends Component {
  state = {
    starredChannels: [],
    activeChannel: ""
  };
  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };
  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };
  displayChannels = starredChannels => {
    return (
      starredChannels.length > 0 &&
      starredChannels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => this.changeChannel(channel)}
          active={this.state.activeChannel === channel.id}
          name={channel.name}
          style={{ opacity: "0.7" }}
        >
          {this.getNotificationsCount(channel) && (
            <Label color="red">{this.getNotificationsCount(channel)} </Label>
          )}
          # {channel.name}
        </Menu.Item>
      ))
    );
  };

  render() {
    const { starredChannels } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="heart outline" />
            Favorite Channels
          </span>{" "}
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(FavoriteChannels
  );
