import React from "react";
import "./App.css";

import { Grid } from "semantic-ui-react";
import ColorPanel from "./Panels/ColorPanel/ColorPanel";
import SidePanel from "./Panels/SidePanel/SidePanel";
import Messages from "./Panels/Messages/Messages";
import MetaPanel from "./Panels/MetaPanel/MetaPanel";

const App = () => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column style={{ width: 4 }}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

export default App;
