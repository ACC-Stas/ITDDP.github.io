var firebaseConfig = {
    apiKey: "AIzaSyDxQ0Eywr8Ww0qcbv_BpgyL75Ett2VPWgU",
    authDomain: "gogo-5baa0.firebaseapp.com",
    databaseURL: "https://gogo-5baa0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gogo-5baa0",
    storageBucket: "gogo-5baa0.appspot.com",
    messagingSenderId: "944331341735",
    appId: "1:944331341735:web:6d752258047afc4d998082",
    measurementId: "G-2LC730E7N1"
  };
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const firestore = firebase.firestore();
const db = firebase.database();
const storage = firebase.storage();
const storageRef = storage.ref();
//firebase.auth();
//firebase.firestore();
//firebase.database();
//firebase.storage().ref();