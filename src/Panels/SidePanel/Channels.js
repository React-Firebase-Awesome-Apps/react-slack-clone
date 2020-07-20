import React, { Component, Fragment } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

class Channels extends Component {
  state = {
    channels: [],
    channelName: "",
    channelDetails: "",
    modal: false
  };
  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
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
            <Form>
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
                <Button color="green" inverted>
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
