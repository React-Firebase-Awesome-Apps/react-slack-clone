import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import firebaseConfig from './config';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
