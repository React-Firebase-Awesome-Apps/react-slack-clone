import React, { Component } from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading
    } = this.props;
    return (
      // Use 'clearing' to float items around...
      <Segment clearing color="teal">
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginTop: 0 }}>
          <span>
            {channelName}
            <Icon
              style={{ marginLeft: 8 }}
              name={"comment outline"}
              color="black"
            />
          </span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>
        </Header>
        {/* Channel search input */}
        <Header floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSearchChange}
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
