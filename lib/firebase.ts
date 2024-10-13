import { initializeApp, getApps } from "firebase/app"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export async function initializeSiteStats() {
  const siteStatsRef = doc(db, "siteStats", "credits");
  const siteStatsDoc = await getDoc(siteStatsRef);

  if (!siteStatsDoc.exists()) {
    await setDoc(siteStatsRef, {
      credits: 100, // Starting credits
      superLikesSent: 0
    });
  }
}

export { db }
