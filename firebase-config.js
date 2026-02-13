// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD94u-0_4ViLAVgi_gLBy-xztQfs7z6twE",
  authDomain: "ah-fe-6a0c0.firebaseapp.com",
  projectId: "ah-fe-6a0c0",
  storageBucket: "ah-fe-6a0c0.firebasestorage.app",
  messagingSenderId: "225964347020",
  appId: "1:225964347020:web:87ebe0ffb82fc492daf5a9"
};

console.log('Initializing Firebase...');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log('Firebase initialized successfully');

// Initialize services - DECLARE GLOBALLY, don't use const
var auth = firebase.auth();
var db = firebase.firestore();
var storage = firebase.storage();

console.log('Firebase services ready:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage
});
