import React, { Component } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";

import firebase from "../../firebase";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    avatar: "",
    modal: false,
    previewImage: "",
    croppedImage: "",
    blob: "",
    metadata: {
      contentType: "image/jpeg"
    },
    uploadCroppedImage: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref("users"),
    messagesRef: firebase.database().ref("messages")
    // channel: this.props.currentChannel // Note: We removed the passing prop in App and SidePanel
  };

  // Do this hack to get the avatar on first load.
  componentDidMount = () => {
    firebase
      .database()
      .ref("users")
      .on("child_added", snap => {
        // console.log(snap.val().email);
        if (this.state.user.email === snap.val().email) {
          // console.log(snap.val().avatar);
          const avatar = snap.val().avatar;
          this.setState({ avatar });
        }
      });
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>{" "}
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span onClick={() => this.openModal()}>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign out</span>
    }
  ];

  // Check Readme, 54.
  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  // Check Readme, 54.
  handleCrop = () => {
    // this.avatarEditor =  ref from AvatarEditor
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        //console.log('imageUrl', imageUrl);

        this.setState({ croppedImage: imageUrl, blob });
      });
    }
  };

  // Check Readme, 55.
  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    const imageRef = storageRef.child(`avatars/users/${userRef.uid}`);
    // We should chain the functions,
    // but we leave it like this to console.log the name and bucket below.
    imageRef.put(blob, metadata).then(snap => {
      snap.ref.getDownloadURL().then(downloadURL => {
        this.setState({ uploadCroppedImage: downloadURL }, () => {
          this.changeAvatar();
        });
      });
    });
    // console.log("imageRef.name", imageRef.name);
    // console.log("imageRef.bucket", imageRef.bucket);
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadCroppedImage
      })
      .then(() => {
        console.log("PhotoURL updated");
        this.closeModal();
      })
      .catch(err => console.error(err));

    // update avatar in database
    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadCroppedImage })
      .then(() => console.log("User Avatar updated"))
      .catch(err => console.error(err));

    // Maybe the best way to change the avatar also in messages,
    // would be to do it here...
    // But we have only the channel id of the current Channel
    // and we cannot find a way to get the id of each message...
    // if (!!this.state.channel) {
    //   console.log("this.state.channel.id", this.state.channel.id);
    //   this.state.messagesRef
    //     .child(`${this.state.channel.id}`)
    //     .once("value", snap => {
    //       console.log("query", snap.val());
    //       if (snap.exists()) {
    //         if (snap.val() === this.state.user.uid) {
    //         }
    //       }
    //     });
    // }
  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("user is signed out"));
  };

  render() {
    const { user, avatar, modal, previewImage, croppedImage } = this.state;
    const { primaryColor } = this.props;

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
            {/* User Dropdown */}
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image inverted="true" src={avatar} spaced="right" avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
          {/* Change user avatar modal */}
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {/* Image Preview */}
                    {previewImage && (
                      <AvatarEditor
                        ref={node => (this.avatarEditor = node)}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column className="ui center aligned grid">
                    {/* Cropped Image Preview */}
                    {croppedImage && (
                      <Image
                        style={{ margin: "3.5em auto" }}
                        width={100}
                        height={100}
                        src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button
                  onClick={this.uploadCroppedImage}
                  color="green"
                  inverted
                >
                  <Icon name="save" />
                  Change Avatar
                </Button>
              )}
              <Button color="green" inverted onClick={this.handleCrop}>
                <Icon name="image" />
                Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" />
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
