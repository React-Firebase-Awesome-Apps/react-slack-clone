import React, { Component } from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearchChange,
      searchLoading,
      isPrivateChannel,
      handleFavoriteChannels,
      isChannelFavorite
    } = this.props;
    // console.log(isPrivateChannel);

    return (
      // Use 'clearing' to float items around...
      <Segment clearing color="teal">
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginTop: 0 }}>
          <span>
            {channelName}
            {!isPrivateChannel && (
              <Icon
                onClick={handleFavoriteChannels}
                style={{ marginLeft: 8 }}
                name={isChannelFavorite ? "heart" : "heart outline"}
                color={isChannelFavorite ? "olive" : "black"}
              />
            )}
          </span>
          <Header.Subheader>
            {numUniqueUsers === "" ? "No users yet!" : numUniqueUsers}
          </Header.Subheader>
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
