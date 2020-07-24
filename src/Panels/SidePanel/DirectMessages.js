import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

class DirectMessages extends Component {
  state = {
      users: []
  };
  render() {
      const {users} = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <spam>
            <Icon name="mail" />
            DIRECT MESSAGES
          </spam>{" "}
          ({users.length})
           {/* Users to send direct messsages */}
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default DirectMessages;
