import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-check.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase web configuration identifies this public web app; it is not a secret.
// Access to Firestore is enforced by firestore.rules and Firebase App Check.
const firebaseConfig = {
  apiKey: "AIzaSyB8iTg5K51M21cqGdVsuiSCpMHt4nyIXFM",
  authDomain: "sanctity-9cd57.firebaseapp.com",
  projectId: "sanctity-9cd57",
  storageBucket: "sanctity-9cd57.firebasestorage.app",
  messagingSenderId: "756282010970",
  appId: "1:756282010970:web:9387283c587c6adf6c5763",
  measurementId: "G-53FY6NLZ2B"
};

export const POST_LIMITS = Object.freeze({
  name: 80,
  message: 1000,
  wallResults: 100
});

const app = initializeApp(firebaseConfig);
const appCheckSiteKey = document
  .querySelector('meta[name="firebase-app-check-site-key"]')
  ?.content.trim();

// The reCAPTCHA Enterprise site key is public and is added to each Firebase page
// after App Check is registered in Firebase Console. Firestore continues to work
// until then; do not enable App Check enforcement before completing README.md.
if (appCheckSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true
  });
} else {
  console.warn(
    "Firebase App Check is not configured. Follow README.md before enabling enforcement."
  );
}

export const db = getFirestore(app);
