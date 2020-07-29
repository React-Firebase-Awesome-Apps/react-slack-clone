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
const App = ({ currentUser, currentChannel, isPrivateChannel }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel
        // When passing props to multiple components, we need to pass also
        // a unique identifier, ie a key.
        // Check: https://reactjs.org/docs/reconciliation.html#keys
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column style={{ width: 4 }}>
        <MetaPanel  key={currentChannel && currentChannel.id}  isPrivateChannel={isPrivateChannel} />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
});
export default connect(mapStateToProps)(App);
