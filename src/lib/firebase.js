import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue, off, remove, serverTimestamp } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A valid Firebase RTDB URL looks like:
//   https://<project-id>-default-rtdb.firebaseio.com
//   https://<project-id>-default-rtdb.<region>.firebasedatabase.app
function isValidDatabaseURL(url) {
  if (!url || typeof url !== "string") return false;
  return /^https:\/\/.+\.(firebaseio\.com|firebasedatabase\.app)(\/.*)?$/.test(url);
}

let app;
let database = null;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const isDemo = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("Demo");
  if (isValidDatabaseURL(firebaseConfig.databaseURL) && !isDemo) {
    database = getDatabase(app);
  } else {
    database = null;
    console.info("Deshi Spyfall: Firebase RTDB not configured or using demo key — running in local demo mode.");
  }
} catch (e) {
  database = null;
  console.warn("Firebase initialization error:", e.message);
}

// ─── Safe wrappers (no-ops when offline) ────────────────────────────────────

export const safeSet = async (path, value) => {
  if (!database) return;
  try { await set(ref(database, path), value); } catch (e) {}
};

export const safeUpdate = async (path, value) => {
  if (!database) return;
  try { await update(ref(database, path), value); } catch (e) {}
};

export const safeGet = async (path) => {
  if (!database) return null;
  try {
    const snap = await get(ref(database, path));
    return snap.exists() ? snap.val() : null;
  } catch (e) { return null; }
};

export { database, ref, set, get, update, onValue, off, remove, serverTimestamp };
