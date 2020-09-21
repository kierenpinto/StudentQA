import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions"
import firebaseConfig from './firebaseConfig.json'
firebase.initializeApp(firebaseConfig);

export default firebase;