import firebase from 'firebase/app'
import 'firebase/auth'
import dotenv from 'dotenv'
dotenv.config()

var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
}

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app())
export const Auth = firebase.auth()
export const PhoneAuthProvider = new firebase.auth.PhoneAuthProvider()
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const FacebookAuthProvider = new firebase.auth.FacebookAuthProvider()
