// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyASlomS6QK4ozh7pTtFmhyiByIdqImxcKk",
  authDomain: "ridebc-d6e1b.firebaseapp.com",
  projectId: "ridebc-d6e1b",
  storageBucket: "ridebc-d6e1b.appspot.com",
  messagingSenderId: "237236039331",
  appId: "1:237236039331:web:efaca7198db69d16201916",
  measurementId: "G-MM7R4BR41F"
};

// initialize firebase
//initializeApp(firebaseConfig);
//export const database = getFirestore();
//export const auth = getAuth();


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configura Firebase Auth con AsyncStorage para persistencia
const auth = getAuth(app);
const authPersistence = getReactNativePersistence(ReactNativeAsyncStorage);
auth.setPersistence(authPersistence);

// Exporta Firestore y Auth configurados
export const database = getFirestore(app);
export { auth };