import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

import { initFirestore } from "@auth/firebase-adapter"
// import { cert} from "firebase-admin/app"
import { getAuth } from "firebase/auth";


// const firestore = initFirestore({
//     credential: cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY
//     })
// })

const firebaseConfig = {
    apiKey: "AIzaSyAbUgodpE8e9wHjNT2_bchSQUGEv7neJ90",
    authDomain: "ziswaf-id-production.firebaseapp.com",
    projectId: "ziswaf-id-production",
    storageBucket: "ziswaf-id-production.appspot.com",
    messagingSenderId: "275743294566",
    appId: "1:275743294566:web:c094156f38c7fe739a99a7"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const strorage = getStorage()
const auth = getAuth(initializeApp(firebaseConfig));

export { app, db, strorage, auth }
