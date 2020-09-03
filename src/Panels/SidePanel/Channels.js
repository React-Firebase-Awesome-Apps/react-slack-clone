import React, { Component, Fragment } from "react";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label
} from "semantic-ui-react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../store/actions";

import firebase from "../../firebase";

class Channels extends Component {
  state = {
    channel: null,
    activeChannel: "",
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    notifications: [],
    modal: false,
    firstLoad: true
  };
  componentDidMount = () => {
    this.addListeners();
  };
  componentWillUnmount = () => {
    this.removeListeners();
  };
  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      //   console.log("loadedChannels", loadedChannels);
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };
  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      // console.log("addNotificationListeners, channelId", channelId);
      // console.log("addNotificationListeners, channel", this.state.channel);

      if (this.state.channel) {
        // console.log('this.state.notifications,', this.state.notifications,);
        // console.log('channelId', channelId);
        
        // Show new messages from other channels...
        this.handleNotifications(
          // will show the ids of all the channels.
          channelId,
          // The id of the currentChannel
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    // console.log("Channels, handleNotifications, snap", snap);

    let lastTotal = 0;
    // check if we have any notification for a given channel
    // Note: changing the value of the argument of the function, makes the function not pure...
    let index = notifications.findIndex(
      notification => notification.id === channelId
    );
    // console.log("index", index);
    // console.log("snap.numChildren()", snap.numChildren());
    // console.log("handleNotifications, channelId", channelId);
    // console.log("handleNotifications, currentChannelId", currentChannelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        
        lastTotal = notifications[index].total;
        // console.log(" handleNotifications lastTotal", lastTotal);
        
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }

      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }
    // console.log("notifications", notifications);
   
    this.setState({ notifications });
  };

  removeListeners = () => this.state.channelsRef.off();

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };
    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        // console.log("channel added");
      })
      .catch(err => console.error(err));
  };
  handleSubmit = event => {
    event.preventDefault();
    if (this.formIsValid(this.state)) {
      this.addChannel();
    }
  };
  formIsValid = ({ channelName, channelDetails }) =>
    !!channelName && !!channelDetails;

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.clearNotifications();
    this.setState({ channel });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationsCount = channel => {
    let count = 0;
    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };

  displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map(channel => (
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
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                {/* fluid = take the full width */}
                <Input
                  fluid
                  label="Name of channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Modal.Actions>
                <Button color="green" inverted onClick={this.handleSubmit}>
                  <Icon name="checkmark" />
                  Add
                </Button>
                <Button color="red" inverted onClick={this.closeModal}>
                  <Icon name="remove" />
                  Cancel
                </Button>
              </Modal.Actions>
            </Form>
          </Modal.Content>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
