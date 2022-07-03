import firebase from 'firebase/app'
import 'firebase/auth';

const firebaseConfig = {
    apiKey: window._env_.REACT_APP_apiKey,
    authDomain: window._env_.REACT_APP_authDomain,
    projectId: window._env_.REACT_APP_projectId,
    storageBucket: window._env_.REACT_APP_storageBucket,
    messagingSenderId: window._env_.REACT_APP_messagingSenderId,
    appId: window._env_.REACT_APP_appId,
}

firebase.initializeApp(firebaseConfig);

export default firebase;