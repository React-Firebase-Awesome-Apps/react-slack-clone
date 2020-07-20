import React from "react";
import "./App.css";
import { connect } from "react-redux";

import { Grid } from "semantic-ui-react";
import ColorPanel from "./Panels/ColorPanel/ColorPanel";
import SidePanel from "./Panels/SidePanel/SidePanel";
import Messages from "./Panels/Messages/Messages";
import MetaPanel from "./Panels/MetaPanel/MetaPanel";

const App = ({ currentUser }) => {
  console.log('currentUser', currentUser);
  
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column style={{ width: 4 }}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});
export default connect(mapStateToProps)(App);
