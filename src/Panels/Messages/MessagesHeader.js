import React, { Component } from "react";
import {
  Header,
  Segment,
  Input,
  Button,
  Divider,
  Icon,
  Grid
} from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {
    return (
      // Use 'clearing' to float items around...
      <Segment clearing color="teal">
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginTop: 0 }}>
          <span>
            Channel
            <Icon name={"star outline"} color="black" />
          </span>
          <Header.Subheader>2 Users</Header.Subheader>
        </Header>
        {/* Channel search input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages..."
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
