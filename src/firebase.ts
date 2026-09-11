import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import type { AppState, BidItem } from "./types";

// Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDJyF7WqTSQeSV0sFjuoJ7cznoQ9Tohk-w",
  authDomain: "tenderhkbp2026.firebaseapp.com",
  projectId: "tenderhkbp2026",
  storageBucket: "tenderhkbp2026.firebasestorage.app",
  messagingSenderId: "623263922206",
  appId: "1:623263922206:web:276a08de674ce082fe560f",
  databaseURL: "https://tenderhkbp2026-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let rtdbInstance: ReturnType<typeof getDatabase> | null = null;
let firestoreInstance: ReturnType<typeof getFirestore> | null = null;

try {
  rtdbInstance = getDatabase(firebaseApp);
} catch (err) {
  console.warn("Realtime Database initialization:", err);
}

try {
  firestoreInstance = getFirestore(firebaseApp);
} catch (err) {
  console.warn("Firestore initialization:", err);
}

export const db = rtdbInstance;
export const firestore = firestoreInstance;

/**
 * Clean and normalize state for storage
 */
function sanitizeForFirebase(state: AppState) {
  const sanitizedBids = (state.bids || []).map((b) => {
    // If pdfDataUrl is too large (> 500KB), replace with sample URL to prevent Firestore 1MB limit crash
    let pdfUrl = b.pdfDataUrl || "";
    if (pdfUrl.length > 500000) {
      pdfUrl = "";
    }
    return {
      ...b,
      pdfDataUrl: pdfUrl,
    };
  });

  return {
    winnerBidId: state.winnerBidId || "",
    content: state.content,
    bids: sanitizedBids,
  };
}

/**
 * Subscribe to realtime updates from Firebase (Realtime Database & Firestore)
 */
export function subscribeToTenderData(onData: (data: AppState) => void): () => void {
  let unsubFirestore: (() => void) | null = null;
  let hasReceivedData = false;

  // 1. Try Firebase Realtime Database
  if (db) {
    try {
      const dataRef = ref(db, "tender_hkbp_app");
      const unsubRtdb = onValue(
        dataRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val && val.content) {
              hasReceivedData = true;
              onData({
                winnerBidId: val.winnerBidId ? val.winnerBidId : null,
                content: val.content,
                bids: Array.isArray(val.bids) ? val.bids : [],
              });
            }
          }
        },
        (error) => {
          console.warn("RTDB listener info:", error.message);
        }
      );

      // 2. Also try Firestore as secondary realtime listener
      if (firestore) {
        try {
          const docRef = doc(firestore, "tender_data", "current");
          unsubFirestore = onSnapshot(
            docRef,
            (snap) => {
              if (snap.exists()) {
                const fData = snap.data();
                if (fData && fData.content && !hasReceivedData) {
                  onData({
                    winnerBidId: fData.winnerBidId ? fData.winnerBidId : null,
                    content: fData.content,
                    bids: Array.isArray(fData.bids) ? fData.bids : [],
                  });
                }
              }
            },
            (err) => {
              console.warn("Firestore listener info:", err.message);
            }
          );
        } catch (e) {
          console.warn("Firestore subscribe error:", e);
        }
      }

      return () => {
        unsubRtdb();
        if (unsubFirestore) unsubFirestore();
      };
    } catch (err) {
      console.warn("RTDB subscribe error:", err);
    }
  }

  // Fallback to Firestore only if RTDB wasn't available
  if (firestore) {
    try {
      const docRef = doc(firestore, "tender_data", "current");
      unsubFirestore = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const fData = snap.data();
            if (fData && fData.content) {
              onData({
                winnerBidId: fData.winnerBidId ? fData.winnerBidId : null,
                content: fData.content,
                bids: Array.isArray(fData.bids) ? fData.bids : [],
              });
            }
          }
        },
        (err) => {
          console.warn("Firestore listener error:", err.message);
        }
      );
      return () => {
        if (unsubFirestore) unsubFirestore();
      };
    } catch (e) {
      console.warn("Firestore listener error:", e);
    }
  }

  return () => {};
}

/**
 * Save application state to Firebase (both Realtime Database and Firestore)
 */
export async function syncTenderDataToFirebase(state: AppState): Promise<boolean> {
  let success = false;
  const payload = sanitizeForFirebase(state);

  if (db) {
    try {
      const dataRef = ref(db, "tender_hkbp_app");
      await set(dataRef, payload);
      success = true;
    } catch (err) {
      console.warn("RTDB sync error:", err);
    }
  }

  if (firestore) {
    try {
      const docRef = doc(firestore, "tender_data", "current");
      await setDoc(docRef, payload);
      success = true;
    } catch (err) {
      console.warn("Firestore sync error:", err);
    }
  }

  return success;
}
