import React, { Component, Fragment } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

import firebase from "../../firebase";

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    modal: false
  };
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
        console.log("channel added");
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
  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {/* Channels */}
        </Menu.Menu>
        {/* Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
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
                  label="Name of channel"
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

export default Channels;
