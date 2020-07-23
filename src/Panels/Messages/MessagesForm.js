import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import mime from "mime-types";

import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

// Child of Messages
class MessagesForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    persentUploaded: 0,
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    loading: false,
    modal: false
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const { user, channel } = this.state;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      channelName: channel.name,
      // content: message,
      user: {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };
  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  // Mayby we should lookup the metadata and add and the end of the filePath
  // the actual image type, jpg or png.
  // - Done!
  upLoadFile = (file, metadata) => {
    const urlEnd = mime.lookup(file.name).match(/(?!.*\/).+/)[0];
    // console.log("storage bucket name ", this.state.storageRef.bucket);

    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.${urlEnd}`;
    // Check the README file for lecture 33.
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      // 1st callback (from setState)
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          // error handling (from uploadTask.on)
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          // callback (from uploadTask.on) to download the url of the file
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                // pathToUpload is the channel id, eg the id of React's channel.
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(
                // error handling (from getDownloadURL().then)
                err => {
                  console.error(err);
                  this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: "error",
                    uploadTask: null
                  });
                }
              );
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.error(err);
        this.setState({ errors: this.state.errors.concat(err) });
      });
  };

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      persentUploaded
    } = this.state;
    return (
      <Segment className="messages__form">
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder={
            errors.some(error => error.message.includes("message"))
              ? errors.map(error => error.message)
              : "Write your message"
          }
        />
        <Button.Group icon widths="2">
          <Button
            disabled={loading}
            onClick={this.sendMessage}
            color="green"
            content="Add reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            onClick={this.openModal}
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.upLoadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={persentUploaded}
        />
      </Segment>
    );
  }
}

export default MessagesForm;
