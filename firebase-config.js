// Firebase Configuration & Initialization
// Project: cgpa-a82df

const firebaseConfig = {
    apiKey: "AIzaSyDf_GUUd5D7EfrQC2V2LkFT6tkyLn3N6Ds",
    authDomain: "cgpa-a82df.firebaseapp.com",
    projectId: "cgpa-a82df",
    storageBucket: "cgpa-a82df.firebasestorage.app",
    messagingSenderId: "593003327841",
    appId: "1:593003327841:web:e4bc3bb41a2dfe36085520",
    measurementId: "G-02N03Y25HL"
};

// Initialize Firebase safely
if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    window.auth = typeof firebase.auth === "function" ? firebase.auth() : null;
    window.db = typeof firebase.firestore === "function" ? firebase.firestore() : null;
} else {
    console.error("Firebase SDK not loaded. Please include Firebase script tags.");
}
