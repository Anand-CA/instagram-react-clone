import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAe3kaOn3GbOYgWozyzx40Dmyky5Rt2914",
    authDomain: "instagram-clone-react-227e8.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-227e8-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-227e8",
    storageBucket: "instagram-clone-react-227e8.appspot.com",
    messagingSenderId: "765276079710",
    appId: "1:765276079710:web:dd09fd85194dbbf89016cf"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }
