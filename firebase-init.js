// Firebase Initialization Script for HU Ethics Club
// Run this script to create all necessary collections and initial data

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBrpcK2NbKvcBpJ9AN-D2-V5BiB-sLqMf8",
  authDomain: "hu-ethics-club.firebaseapp.com",
  projectId: "hu-ethics-club",
  storageBucket: "hu-ethics-club.firebasestorage.app",
  messagingSenderId: "273422042680",
  appId: "1:273422042680:web:7cc2d53ded61a4539c48cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('🚀 Initializing Firebase collections for HU Ethics Club...');

async function initializeCollections() {
  try {
    // 1. System Settings
    console.log('📋 Creating system settings...');
    await setDoc(doc(db, 'settings', 'system'), {
      votingEnabled: false,
      registrationEnabled: true,
      electionOpen: false,
      maintenanceMode: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // 2. Sample Elections
    console.log('🗳️ Creating sample elections...');
    const electionRef = await addDoc(collection(db, 'elections'), {
      title: 'Club Executive Elections 2025',
      description: 'Annual elections for club executive positions',
      status: 'draft',
      startDate: null,
      endDate: null,
      resultsPublic: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // 3. Sample Candidates
    console.log('👥 Creating sample candidates...');
    const candidates = [
      {
        electionId: electionRef.id,
        fullName: 'John Doe',
        position: 'president',
        department: 'Computer Science',
        batch: '2024',
        manifesto: 'Committed to promoting transparency and ethical conduct in our university.',
        photoUrl: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        electionId: electionRef.id,
        fullName: 'Jane Smith',
        position: 'vice_president',
        department: 'Business Administration',
        batch: '2024',
        manifesto: 'Dedicated to fighting corruption and building a better academic environment.',
        photoUrl: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        electionId: electionRef.id,
        fullName: 'Mike Johnson',
        position: 'secretary',
        department: 'Engineering',
        batch: '2023',
        manifesto: 'Working towards accountability and integrity in all club activities.',
        photoUrl: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const candidate of candidates) {
      await addDoc(collection(db, 'candidates'), candidate);
    }

    // 4. Sample News Articles
    console.log('📰 Creating sample news articles...');
    const newsArticles = [
      {
        title: 'Welcome to HU Ethics and Anti-Corruption Club',
        excerpt: 'Join us in our mission to promote ethical conduct and fight corruption.',
        content: 'We are excited to launch our new platform for promoting ethics and fighting corruption at Haramaya University. Our club is dedicated to creating a transparent and accountable academic environment.',
        imageUrl: null,
        published: true,
        author: 'Club Admin',
        tags: ['announcement', 'welcome'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Ethics Week 2025 Announcement',
        excerpt: 'Join us for a week of workshops and discussions on ethical conduct.',
        content: 'We are pleased to announce Ethics Week 2025, featuring workshops, panel discussions, and interactive sessions on promoting integrity in academic and professional life.',
        imageUrl: null,
        published: true,
        author: 'Events Team',
        tags: ['events', 'ethics-week'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const article of newsArticles) {
      await addDoc(collection(db, 'news'), article);
    }

    // 5. Sample Events
    console.log('📅 Creating sample events...');
    const events = [
      {
        title: 'Ethics Workshop: Building Integrity',
        description: 'Interactive workshop on ethical decision-making and integrity building.',
        date: Timestamp.fromDate(new Date('2025-02-15')),
        location: 'Main Auditorium',
        imageUrl: null,
        published: true,
        maxAttendees: 100,
        registeredAttendees: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Anti-Corruption Awareness Seminar',
        description: 'Seminar on corruption prevention and reporting mechanisms.',
        date: Timestamp.fromDate(new Date('2025-03-01')),
        location: 'Conference Hall B',
        imageUrl: null,
        published: true,
        maxAttendees: 150,
        registeredAttendees: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const event of events) {
      await addDoc(collection(db, 'events'), event);
    }

    // 6. Sample Resources
    console.log('📚 Creating sample resources...');
    const resources = [
      {
        title: 'University Code of Conduct',
        description: 'Official guidelines for ethical behavior at Haramaya University.',
        fileUrl: null,
        externalUrl: 'https://example.com/code-of-conduct',
        category: 'Policy',
        published: true,
        downloadCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Ethics Handbook for Students',
        description: 'Comprehensive guide to ethical conduct in academic settings.',
        fileUrl: null,
        externalUrl: 'https://example.com/ethics-handbook',
        category: 'Guide',
        published: true,
        downloadCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const resource of resources) {
      await addDoc(collection(db, 'resources'), resource);
    }

    // 7. Sample Executive Members
    console.log('👔 Creating sample executive members...');
    const executives = [
      {
        fullName: 'Dr. Sarah Wilson',
        position: 'Faculty Advisor',
        email: 'sarah.wilson@hu.edu.et',
        phone: '+251-911-123456',
        photoUrl: null,
        bio: 'Professor of Ethics and Philosophy, dedicated to promoting academic integrity.',
        department: 'Philosophy',
        batch: 'Faculty',
        order: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        fullName: 'Ahmed Hassan',
        position: 'Club President',
        email: 'ahmed.hassan@student.hu.edu.et',
        phone: '+251-911-234567',
        photoUrl: null,
        bio: 'Computer Science student passionate about fighting corruption and promoting transparency.',
        department: 'Computer Science',
        batch: '2024',
        order: 2,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const executive of executives) {
      await addDoc(collection(db, 'executives'), executive);
    }

    // 8. Sample Gallery Items
    console.log('🖼️ Creating sample gallery items...');
    const galleryItems = [
      {
        title: 'Ethics Week 2024 Opening Ceremony',
        description: 'Students and faculty gathered for the opening of Ethics Week 2024.',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        category: 'Events',
        published: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Anti-Corruption Workshop',
        description: 'Interactive workshop on corruption prevention strategies.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'Workshops',
        published: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const item of galleryItems) {
      await addDoc(collection(db, 'gallery'), item);
    }

    console.log('✅ All collections initialized successfully!');
    console.log('📊 Created collections:');
    console.log('   - settings (system configuration)');
    console.log('   - elections (1 sample election)');
    console.log('   - candidates (3 sample candidates)');
    console.log('   - news (2 sample articles)');
    console.log('   - events (2 sample events)');
    console.log('   - resources (2 sample resources)');
    console.log('   - executives (2 sample members)');
    console.log('   - gallery (2 sample images)');
    console.log('');
    console.log('🚀 Your Firebase database is ready!');
    console.log('💡 You can now start your application with: npm run dev');

  } catch (error) {
    console.error('❌ Error initializing collections:', error);
  }
}

// Run the initialization
initializeCollections();