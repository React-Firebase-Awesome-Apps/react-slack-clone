- Udemy course, by Reed Burger

* [Build a Slack Chat App with React, Redux, and Firebase](https://www.udemy.com/course/build-a-slack-chat-app-with-react-redux-and-firebase/)

### Lectures Notes:

- 4

* rm -rf .git => to remove the version control we downloaded.

- 5

* Firebase uses websockets that make data transfer very fast!

- 10

* check md5 library. It's normally used to hash messages. But we use it here, in Register.js to create a unique valuew to provide to gravatar url.

- **Check** on lecture's video @2:50 how to save in console the logged object in global state!

- 33

* [Firebase - Upload Files on Web](https://firebase.google.com/docs/storage/web/upload-files)
* As about event.target.files[0] see: [Using files from web applications](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)

- 39

* Check Q&A in Udemy, under "What is connectedRef?".
* [onDisconnect and remove](https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect#remove)

- 43
* [Read Event Types in Java and Node.js](https://firebase.google.com/docs/database/admin/retrieve-data)

    Value:

    The value event is used to read a static snapshot of the contents at a given database path, as they existed at the time of the read event. It is triggered once with the initial data and again every time the data changes. The event callback is passed a snapshot containing all data at that location, including child data. In the code example above, value returned all of the blog posts in your app. Everytime a new blog post is added, the callback function will return all of the posts.

    Child Added:

    The child_added event is typically used when retrieving a list of items from the database. Unlike value which returns the entire contents of the location, child_added is triggered once for each existing child and then again every time a new child is added to the specified path. The event callback is passed a snapshot containing the new child's data. For ordering purposes, it is also passed a second argument containing the key of the previous child.

* The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.

* About snap.numChildern() and more... check: [firebase. database. DataSnapshot](https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot#numchildren) 