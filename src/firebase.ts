// src/app/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { environment } from '../../environments/environment';

//check if firebase is already initialized. Otherwise initialize.
const firebaseApp = getApps().length === 0 ? initializeApp(environment.firebase) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

