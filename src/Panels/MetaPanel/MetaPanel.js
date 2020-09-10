import React, { Component } from "react";
import {
  Segment,
  Header,
  Accordion,
  Icon,
  Image,
  List
} from "semantic-ui-react";

class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isPrivateChannel: this.props.isPrivateChannel,
    channel: this.props.currentChannel
  };

  setActiveIndex = (event, titleProps) => {
    // console.log("MetaPanel titleProps", titleProps);

    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  formatCount = num => (num > 1 || num === 0 ? num + " posts" : num + " post");

  diplayTopPosters = userPosts =>
    Object.entries(userPosts)
      // b[1] = b of the index of 1 ...
      // The array has two arrays, and the first has one element with the name of the user.
      // The second has two elements the avatar and the the count of messages.
      // So b[1].count ...
      // [key, val]: The key seams to be the first array... the name of the user.
      // Check for more info in the Read.me file lecture: 49.
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar circular src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{this.formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  render() {
    const { activeIndex, isPrivateChannel, channel } = this.state;
    const { userPosts } = this.props;

    if (isPrivateChannel) return null;

    return (
      <Segment loading={!channel}>
        <Header as="h3" attached="top">
          About # {channel && channel.name}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>{userPosts && this.diplayTopPosters(userPosts)}</List>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created by
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3">
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;
