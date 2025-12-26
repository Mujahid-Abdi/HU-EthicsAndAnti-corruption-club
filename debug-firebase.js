// Debug Firebase Connection and Data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

console.log('🔍 Debugging Firebase Data...\n');

async function debugFirebase() {
  try {
    // Check elections
    console.log('📊 Checking Elections:');
    const electionsSnapshot = await getDocs(collection(db, 'elections'));
    console.log(`   Found ${electionsSnapshot.size} elections`);
    
    electionsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.title} (${data.status})`);
    });

    // Check open elections specifically
    console.log('\n🗳️ Checking Open Elections:');
    const openElectionsQuery = query(collection(db, 'elections'), where('status', '==', 'open'));
    const openElectionsSnapshot = await getDocs(openElectionsQuery);
    console.log(`   Found ${openElectionsSnapshot.size} open elections`);

    if (openElectionsSnapshot.size > 0) {
      const openElection = openElectionsSnapshot.docs[0];
      const electionData = openElection.data();
      console.log(`   - Open Election: ${electionData.title}`);
      console.log(`   - Election ID: ${openElection.id}`);

      // Check candidates for this election
      console.log('\n👥 Checking Candidates:');
      const candidatesQuery = query(collection(db, 'candidates'), where('electionId', '==', openElection.id));
      const candidatesSnapshot = await getDocs(candidatesQuery);
      console.log(`   Found ${candidatesSnapshot.size} candidates`);

      candidatesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.fullName} (${data.position})`);
      });
    }

    // Check system settings
    console.log('\n⚙️ Checking System Settings:');
    const settingsSnapshot = await getDocs(collection(db, 'settings'));
    console.log(`   Found ${settingsSnapshot.size} settings documents`);

    settingsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${doc.id}:`, data);
    });

    console.log('\n✅ Firebase Debug Complete!');

  } catch (error) {
    console.error('❌ Firebase Debug Error:', error);
  }
}

debugFirebase();