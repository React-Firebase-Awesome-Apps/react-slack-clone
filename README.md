- Udemy course, by Reed Burger

[Build a Slack Chat App with React, Redux, and Firebase](https://www.udemy.com/course/build-a-slack-chat-app-with-react-redux-and-firebase/)

Hosting URL: https://slack-clone-9a8d0.web.app

### Lectures Notes:

Note: To log from a network address, visit: 
- On Your Network:  http://192.168.43.7:3001/

- 4
    - rm -rf .git => to remove the version control we downloaded.
    - From Q&A: [Why we can't npm i or yarn](https://www.udemy.com/course/build-a-slack-chat-app-with-react-redux-and-firebase/learn/lecture/11852874#questions/12214548)

- 5
 - Firebase uses websockets that make data transfer very fast!

- 10
    - check md5 library. It's normally used to hash messages. But we use it here, in Register.js to create a unique valuew to provide to gravatar url.

    Extra info:

    [Why would you hash a file?](https://www.2brightsparks.com/resources/articles/introduction-to-hashing-and-its-uses.html)
    Hashing is also used to verify the integrity of a file after it has been transferred from one place to another, typically in a file backup program like SyncBack. To ensure the transferred file is not corrupted, a user can compare the hash value of both files.

    - **Check** on lecture's video @2:50 how to save in console the logged object in global state!

- 12
    - Use of ```WithRouter```

- 28 
    - see how we use ```push`` to first save the channel.id and then ```set``` to save the message! [Saving Data](https://firebase.google.com/docs/database/admin/save-data)
    - about firebase timestamp. Docs: "A placeholder value for auto-populating the current timestamp (time since the Unix epoch, in milliseconds) as determined by the Firebase servers."
    - Check logic: If user tries to send the message without writing anything, we save an error message in state. Then we use that to indicate to user where and what went wrong.

- 30
    - Check logic: using a function to set the className...

- 32
    - check if selected data is a picture with [mime-types](https://www.npmjs.com/package/mime-types)

- 33
    - [Firebase - Upload Files on Web](https://firebase.google.com/docs/storage/web/upload-files)
    - As about event.target.files[0] see: [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)

- 37
    - Use reduce and regex to **search** messages...

- 39
    - Check Q&A in Udemy, under "What is connectedRef?". From the docs: [Detecting Connection State:](https://firebase.google.com/docs/database/web/offline-capabilities)
    - [onDisconnect and remove](https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect#remove)

- 43
  - [Retrieving Data](https://firebase.google.com/docs/database/admin/retrieve-data)
    Value:

    The value event is used to read a static snapshot of the contents at a given database path, as they existed at the time of the read event. It is triggered once with the initial data and again every time the data changes. The event callback is passed a snapshot containing all data at that location, including child data. In the code example above, value returned all of the blog posts in your app. Everytime a new blog post is added, the callback function will return all of the posts.

    Child Added:

    The child_added event is typically used when retrieving a list of items from the database. Unlike value which returns the entire contents of the location, child_added is triggered once for each existing child and then again every time a new child is added to the specified path. The event callback is passed a snapshot containing the new child's data. For ordering purposes, it is also passed a second argument containing the key of the previous child.

  - The ```findIndex()``` method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.

  - About snap.numChildern() and more... check: [firebase. database. DataSnapshot](https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#numchildren)

- 45
 - [Updating data](https://firebase.google.com/docs/database/web/read-and-write)

- 47 Check an onClick function ```setActiveIndex``` that gets data from the dom element, whithout us setting any. 
Check in ```MetaPanel.js```
```
    setActiveIndex = (event, titleProps) => { ... }

```
- 49
    - in ```Messages.js``` and ```countUserPosts``` check for: [in operator ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)
    - in ```MetaPanel.js``` and ```diplayTopPosters``` check for: [Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

- 51
    - @5:24 Why in ```ColorPanel.js``` - ```saveColors``` we use ```push``` while in the same case in ```Messages.js``` - ```favoriteTheChannel``` we don't?

- 54
  - About [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) Object:
  The FileReader object lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read.

  - About [FileReader.readAsDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)
  The readAsDataURL method is used to read the contents of the specified Blob or File. When the read operation is finished, the readyState becomes DONE, and the loadend is triggered. At that time, the **result** attribute contains the data as a data: URL representing the file's data as a base64 encoded string.
  Also: [File and FileReader](https://javascript.info/file).

   - About ```reader.addEventListener("load", ...``` check [Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)   

  - About getImageScaledToCanvas: [react-avatar-editor](https://www.npmjs.com/package/react-avatar-editor)

  - [react-avatar-editor](https://www.npmjs.com/package/react-avatar-editor)

    ```js
    // If you want the image resized to the canvas size (also an HTMLCanvasElement)
    const canvasScaled = this.editor.getImageScaledToCanvas();
    ```

    - [HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)

    - [URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)

    - [HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) The HTMLCanvasElement.toBlob() method creates a Blob object representing the image contained in the canvas; this file may be cached on the disk or stored in memory at the discretion of the user agent.

    - [getDownloadURL()](https://firebase.google.com/docs/storage/web/download-files) from Firebase.

- 54
    - Firebase [Upload Files on Web](https://firebase.google.com/docs/storage/web/upload-files).
    
    - Firebase [updateProfile](https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile).

- 57 
    - We implemented the ```handleKeyDown``` function in ```MessageForm.js``` which sets/removes in Firebase the user's name when typing or not.

    - [CSS animation Property](https://www.w3schools.com/cssref/css3_pr_animation.asp)

    - [CSS animation-delay Property](https://www.w3schools.com/cssref/css3_pr_animation-delay.asp)

    - [CSS :nth-child() Selector](https://www.w3schools.com/cssref/sel_nth-child.asp)

    - [CSS @keyframes Rule](https://www.w3schools.com/cssref/css3_pr_animation-keyframes.asp)

- 58 
    - We implemented the ```addTypingListeners``` so that in any case we know how many and which users are typing.

    - [firebase. database. OnDisconnect](https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect)

- 59 
    - [missive/emoji-mart](https://github.com/missive/emoji-mart)

- 60 
    - Check code on how to scroll automatically to the end of the messages segment, after a new message is added, or someone is typing. 
    - [Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

- 61 
    - Show a messages skeleton when messages are loading...

- 63 
    - [Manage Uploads](https://firebase.google.com/docs/storage/web/upload-files)

- 64
 - Check rules for Firebase Storage [Get started with Firebase Security Rules](https://firebase.google.com/docs/storage/security/get-started)

- 65
 - Check rules for Firebase Realtime Database [Get started with Firebase Security Rules](https://firebase.google.com/docs/storage/security/get-started)
 -[hasChildren](https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#haschildren)
 -[newData](https://firebase.google.com/docs/reference/security/database#newdata)