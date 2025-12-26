// Simple Firebase Setup - Run this after setting Firestore to test mode
// This creates basic system settings that the app needs

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBrpcK2NbKvcBpJ9AN-D2-V5BiB-sLqMf8",
  authDomain: "hu-ethics-club.firebaseapp.com",
  projectId: "hu-ethics-club",
  storageBucket: "hu-ethics-club.firebasestorage.app",
  messagingSenderId: "273422042680",
  appId: "1:273422042680:web:7cc2d53ded61a4539c48cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🚀 Setting up basic Firebase configuration...');

async function setupBasicConfig() {
  try {
    // Create system settings document
    await setDoc(doc(db, 'settings', 'system'), {
      votingEnabled: false,
      registrationEnabled: true,
      electionOpen: false,
      maintenanceMode: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    console.log('✅ System settings created successfully!');
    console.log('📋 Configuration:');
    console.log('   - Registration: Enabled');
    console.log('   - Voting: Disabled');
    console.log('   - Elections: Closed');
    console.log('   - Maintenance: Off');
    console.log('');
    console.log('🎉 Basic setup complete! You can now:');
    console.log('   1. Start the app: npm run dev');
    console.log('   2. Create your first admin account');
    console.log('   3. Use the admin panel to add more data');

  } catch (error) {
    console.error('❌ Error setting up configuration:', error);
    console.log('');
    console.log('💡 Make sure your Firestore database is in "test mode":');
    console.log('   1. Go to Firebase Console');
    console.log('   2. Navigate to Firestore Database');
    console.log('   3. Go to Rules tab');
    console.log('   4. Set rules to: allow read, write: if true;');
  }
}

setupBasicConfig();