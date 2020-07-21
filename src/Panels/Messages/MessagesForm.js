import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";

class MessagesForm extends Component {
  render() {
    return (
      <Segment className="messages__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
        />
        <Button.Group icon widths='2' >
            <Button 
            color='green'
            content='Add reply'
            labelPosition='left'
            icon='edit'
            />
            <Button 
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
            />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessagesForm;
