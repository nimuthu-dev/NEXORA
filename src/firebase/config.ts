/**
 * Firebase configuration object.
 * Strictly uses the Firebase Web App API key (starts with AIza).
 * Using a Gemini/AI Studio key (AQ.Ab...) here will cause Auth to fail.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC7iEm5dRzQiC2ZKDBNU0Ecxie1kRzaWA8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-7355078125-27ddd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-7355078125-27ddd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-7355078125-27ddd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "254422204561",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:254422204561:web:e09212c77d4c827361a66c"
};
