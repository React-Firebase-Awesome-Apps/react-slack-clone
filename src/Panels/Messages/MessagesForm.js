import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import mime from "mime-types";
import "emoji-mart/css/emoji-mart.css";
import { Picker, emojiIndex } from "emoji-mart";

import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

// Child of Messages
class MessagesForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref("typing"),
    uploadState: "",
    uploadTask: null,
    percentUploaded: 0,
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    loading: false,
    modal: false,
    emojiPicker: false
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleKeyDown = () => {
    const { message, typingRef, user, channel } = this.state;
    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove();
    }
  };

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(`${oldMessage} ${emoji.colons}`);
    this.setState({ message: newMessage, emojiPicker: false });
    setTimeout(() => this.messageInputRef.focus(), 0);
  };

  // Converts the emoji.colons to a unicode, usint the emjiIndex.
  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  createMessage = (fileUrl = null) => {
    const { user, channel } = this.state;
    const { avatar } = this.props;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      channelName: channel.name,
      // content: message,
      user: {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: !!avatar ? avatar : user.photoURL
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
    const { getMessagesRef } = this.props;
    const { message, channel, user, typingRef } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove();
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
  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private/${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };

  // Mayby we should lookup the metadata and add at the end of the filePath
  // the actual image type, jpg or png.
  // - Done!
  upLoadFile = (file, metadata) => {
    const urlEnd = mime.lookup(file.name).match(/(?!.*\/).+/)[0];
    // console.log("storage bucket name ", this.state.storageRef.bucket);

    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.${urlEnd}`;
    // Check the README file for lecture 33.
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      // Register three observers:
      // 1st callback (from setState)
      // 1. 'state_changed' observer, called any time the state changes
      // Firebase note: put() and putString() both return an UploadTask
      // which you can use as a promise,
      // or use to manage and monitor the status of the upload.
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
          // 2. Error observer, called on failure
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          // callback (from uploadTask.on) to download the url of the file
          // 3. Completion observer, called on successful completion
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
      percentUploaded,
      emojiPicker
    } = this.state;
    return (
      <Segment className="messages__form">
        {emojiPicker && (
          <Picker
            set="apple"
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
            onSelect={this.handleAddEmoji}
          />
        )}
        <Input
          fluid
          name="message"
          value={message}
          ref={node => (this.messageInputRef = node)}
          onKeyUp={this.handleKeyDown}
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          label={
            <Button
              icon={emojiPicker ? "close" : "add"}
              onClick={this.handleTogglePicker}
              content={emojiPicker ? "Close" : null}
            />
          }
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
            disabled={uploadState === "uploading"}
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
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessagesForm;
