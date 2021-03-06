import React from "react";
import "./App.css";
import { connect } from "react-redux";

import { Grid } from "semantic-ui-react";
import ColorPanel from "./Panels/ColorPanel/ColorPanel";
import SidePanel from "./Panels/SidePanel/SidePanel";
import Messages from "./Panels/Messages/Messages";
import MetaPanel from "./Panels/MetaPanel/MetaPanel";

// We get currentUser and currentChannel from the redux store,
// through the Provider - store in index.js.
const App = ({
  currentUser,
  currentChannel,
  isPrivateChannel,
  userPosts,
  primaryColor,
  secondaryColor
}) => {
  return (
    <Grid
      columns="equal"
      className="app"
      style={{
        background: secondaryColor,
        height: "920px"
      }}
    >
      <ColorPanel
        key={currentUser && currentUser.name}
        currentUser={currentUser}
      />
      <SidePanel
        // When passing props to multiple components, we need to pass also
        // a unique identifier, ie a key.
        // Check: https://reactjs.org/docs/reconciliation.html#keys
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
        primaryColor={primaryColor}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel
          currentChannel={currentChannel}
          key={currentChannel && currentChannel.name}
          isPrivateChannel={isPrivateChannel}
          userPosts={userPosts}
        />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
});
export default connect(mapStateToProps)(App);
