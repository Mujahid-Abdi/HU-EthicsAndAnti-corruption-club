// Complete Firebase Initialization with Sample Data
// This creates all collections with sample data for testing

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';

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

console.log('🚀 Initializing complete Firebase setup with sample data...');

async function initializeCompleteSetup() {
  try {
    // 1. System Settings
    console.log('📋 Creating system settings...');
    await setDoc(doc(db, 'settings', 'system'), {
      votingEnabled: true,
      registrationEnabled: true,
      electionOpen: true,
      maintenanceMode: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // 2. Create Sample Election
    console.log('🗳️ Creating sample election...');
    const electionRef = await addDoc(collection(db, 'elections'), {
      title: 'HU Ethics Club Executive Elections 2025',
      description: 'Annual elections for club executive positions - President, Vice President, and Secretary',
      status: 'open',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
      resultsPublic: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    console.log('✅ Election created with ID:', electionRef.id);

    // 3. Create Sample Candidates
    console.log('👥 Creating sample candidates...');
    const candidates = [
      {
        electionId: electionRef.id,
        fullName: 'Ahmed Hassan Mohammed',
        position: 'president',
        department: 'Computer Science',
        batch: '2024',
        manifesto: 'I am committed to promoting transparency, fighting corruption, and building a stronger ethical foundation in our university. Together, we can create positive change.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        electionId: electionRef.id,
        fullName: 'Fatima Ali Yusuf',
        position: 'president',
        department: 'Business Administration',
        batch: '2023',
        manifesto: 'With experience in student leadership, I will work tirelessly to ensure our club becomes a beacon of integrity and accountability in the university.',
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        electionId: electionRef.id,
        fullName: 'Mohammed Ibrahim Seid',
        position: 'vice_president',
        department: 'Engineering',
        batch: '2024',
        manifesto: 'As your Vice President, I will support initiatives that promote ethical conduct and ensure every student voice is heard in our fight against corruption.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        electionId: electionRef.id,
        fullName: 'Hanan Abdullahi Omar',
        position: 'vice_president',
        department: 'Law',
        batch: '2023',
        manifesto: 'My legal background will help strengthen our advocacy efforts and ensure proper procedures in all our anti-corruption activities.',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        electionId: electionRef.id,
        fullName: 'Dawit Tesfaye Bekele',
        position: 'secretary',
        department: 'Economics',
        batch: '2024',
        manifesto: 'I will ensure transparent record-keeping and effective communication between the club and university community.',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const candidate of candidates) {
      const candidateRef = await addDoc(collection(db, 'candidates'), candidate);
      console.log(`✅ Created candidate: ${candidate.fullName} (${candidate.position})`);
    }

    // 4. Create Sample News Articles
    console.log('📰 Creating sample news articles...');
    const newsArticles = [
      {
        title: 'HU Ethics Club Launches New Anti-Corruption Initiative',
        excerpt: 'The club announces a comprehensive program to promote ethical conduct across all university departments.',
        content: `The Haramaya University Ethics and Anti-Corruption Club is proud to announce the launch of our new comprehensive anti-corruption initiative. This program aims to create awareness, provide education, and establish clear reporting mechanisms for ethical violations.

Our initiative includes:
- Weekly ethics workshops for students and staff
- Anonymous reporting system for corruption cases
- Collaboration with university administration
- Regular awareness campaigns
- Student leadership development programs

We believe that by working together, we can create a culture of integrity and transparency that will benefit our entire university community.`,
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
        published: true,
        author: 'Ethics Club Admin',
        tags: ['announcement', 'anti-corruption', 'initiative'],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Ethics Week 2025: Building Integrity Together',
        excerpt: 'Join us for a week of workshops, seminars, and discussions on ethical leadership and integrity.',
        content: `We are excited to announce Ethics Week 2025, scheduled for February 15-22, 2025. This week-long event will feature:

**Monday - Opening Ceremony**
- Keynote speech by Dr. Sarah Wilson
- Launch of new ethics guidelines

**Tuesday - Workshop Day**
- "Ethical Decision Making in Academic Life"
- "Building Integrity in Student Organizations"

**Wednesday - Panel Discussion**
- "Combating Corruption: A Multi-Stakeholder Approach"
- Guest speakers from government and civil society

**Thursday - Student Forum**
- Open discussion on ethical challenges
- Student-led presentations

**Friday - Action Planning**
- Developing concrete steps for change
- Commitment ceremony

All events are free and open to the university community. Registration is now open!`,
        imageUrl: 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800',
        published: true,
        author: 'Events Committee',
        tags: ['events', 'ethics-week', 'workshops'],
        createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
        updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
      },
      {
        title: 'Student Report Leads to Policy Change',
        excerpt: 'Anonymous report through our system results in improved transparency in university procurement.',
        content: `We are pleased to report a significant success story from our anonymous reporting system. A student report regarding procurement irregularities has led to positive policy changes.

**The Impact:**
- New transparent bidding process implemented
- Regular audits now conducted
- Clear guidelines published for all stakeholders
- Training provided to procurement staff

This case demonstrates the power of speaking up and the importance of having secure channels for reporting concerns. We thank the brave student who came forward and the university administration for their swift and appropriate response.

Remember: Your voice matters. If you see something that doesn't seem right, report it through our secure system. Together, we can build a more transparent and accountable university.`,
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        published: true,
        author: 'Reports Committee',
        tags: ['success-story', 'transparency', 'policy-change'],
        createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
        updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
      }
    ];

    for (const article of newsArticles) {
      await addDoc(collection(db, 'news'), article);
      console.log(`✅ Created news article: ${article.title}`);
    }

    // 5. Create Sample Events
    console.log('📅 Creating sample events...');
    const events = [
      {
        title: 'Ethics Workshop: Building Integrity in Leadership',
        description: 'Interactive workshop focusing on ethical decision-making and integrity in student leadership roles.',
        date: Timestamp.fromDate(new Date('2025-02-15T14:00:00')),
        location: 'Main Auditorium, Haramaya University',
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        published: true,
        maxAttendees: 150,
        registeredAttendees: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Anti-Corruption Awareness Seminar',
        description: 'Comprehensive seminar on corruption prevention, reporting mechanisms, and building transparent institutions.',
        date: Timestamp.fromDate(new Date('2025-03-01T10:00:00')),
        location: 'Conference Hall B, Administration Building',
        imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800',
        published: true,
        maxAttendees: 200,
        registeredAttendees: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Student Ethics Forum',
        description: 'Open forum for students to discuss ethical challenges and propose solutions for university-wide implementation.',
        date: Timestamp.fromDate(new Date('2025-03-15T16:00:00')),
        location: 'Student Center, Room 301',
        imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
        published: true,
        maxAttendees: 100,
        registeredAttendees: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const event of events) {
      await addDoc(collection(db, 'events'), event);
      console.log(`✅ Created event: ${event.title}`);
    }

    // 6. Create Sample Resources
    console.log('📚 Creating sample resources...');
    const resources = [
      {
        title: 'Haramaya University Code of Ethics',
        description: 'Official code of ethics and conduct for all university community members.',
        fileUrl: null,
        externalUrl: 'https://www.haramaya.edu.et/code-of-ethics',
        category: 'Policy Documents',
        published: true,
        downloadCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Student Ethics Handbook 2025',
        description: 'Comprehensive guide to ethical conduct, academic integrity, and professional behavior for students.',
        fileUrl: null,
        externalUrl: 'https://example.com/student-ethics-handbook',
        category: 'Guidelines',
        published: true,
        downloadCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Corruption Reporting Guidelines',
        description: 'Step-by-step guide on how to report corruption and unethical behavior safely and effectively.',
        fileUrl: null,
        externalUrl: 'https://example.com/reporting-guidelines',
        category: 'Reporting',
        published: true,
        downloadCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: 'Ethics in Academic Research',
        description: 'Guidelines for maintaining ethical standards in academic research and publication.',
        fileUrl: null,
        externalUrl: 'https://example.com/research-ethics',
        category: 'Academic',
        published: true,
        downloadCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const resource of resources) {
      await addDoc(collection(db, 'resources'), resource);
      console.log(`✅ Created resource: ${resource.title}`);
    }

    // 7. Create Sample Executive Members
    console.log('👔 Creating sample executive members...');
    const executives = [
      {
        fullName: 'Dr. Sarah Wilson',
        position: 'Faculty Advisor',
        email: 'sarah.wilson@haramaya.edu.et',
        phone: '+251-911-123456',
        photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        bio: 'Dr. Wilson is a Professor of Philosophy and Ethics with over 15 years of experience in academic integrity and ethical leadership. She has published extensively on corruption prevention and institutional transparency.',
        department: 'Philosophy Department',
        batch: 'Faculty',
        order: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        fullName: 'Ahmed Hassan Mohammed',
        position: 'Club President',
        email: 'ahmed.hassan@student.haramaya.edu.et',
        phone: '+251-911-234567',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: 'Ahmed is a Computer Science student passionate about using technology to promote transparency and fight corruption. He has led several successful anti-corruption campaigns on campus.',
        department: 'Computer Science',
        batch: '2024',
        order: 2,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        fullName: 'Fatima Ali Yusuf',
        position: 'Vice President',
        email: 'fatima.ali@student.haramaya.edu.et',
        phone: '+251-911-345678',
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        bio: 'Fatima brings strong organizational skills and a deep commitment to ethical leadership. She has experience in student government and community organizing.',
        department: 'Business Administration',
        batch: '2023',
        order: 3,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const executive of executives) {
      await addDoc(collection(db, 'executives'), executive);
      console.log(`✅ Created executive: ${executive.fullName} (${executive.position})`);
    }

    // 8. Create Sample Gallery Items
    console.log('🖼️ Creating sample gallery items...');
    const galleryItems = [
      {
        title: 'Ethics Week 2024 Opening Ceremony',
        description: 'Students and faculty gathered for the grand opening of Ethics Week 2024, featuring keynote speeches and commitment ceremonies.',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        category: 'Events',
        published: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        updatedAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      },
      {
        title: 'Anti-Corruption Workshop',
        description: 'Interactive workshop session where students learned about corruption prevention strategies and reporting mechanisms.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'Workshops',
        published: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
        updatedAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000))
      },
      {
        title: 'Student Ethics Forum',
        description: 'Students engaged in meaningful discussions about ethical challenges and proposed innovative solutions.',
        imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
        category: 'Forums',
        published: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
        updatedAt: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000))
      },
      {
        title: 'Integrity Pledge Ceremony',
        description: 'New club members taking the integrity pledge, committing to uphold ethical standards in all their activities.',
        imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800',
        category: 'Ceremonies',
        published: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
        updatedAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000))
      }
    ];

    for (const item of galleryItems) {
      await addDoc(collection(db, 'gallery'), item);
      console.log(`✅ Created gallery item: ${item.title}`);
    }

    console.log('\n🎉 Complete Firebase setup finished successfully!');
    console.log('\n📊 Created:');
    console.log('   ✅ System settings (voting enabled, registration open)');
    console.log('   ✅ 1 active election with 5 candidates');
    console.log('   ✅ 3 news articles');
    console.log('   ✅ 3 upcoming events');
    console.log('   ✅ 4 resource documents');
    console.log('   ✅ 3 executive members');
    console.log('   ✅ 4 gallery items');
    console.log('\n🚀 Your app is now fully functional!');
    console.log('   📱 Visit: http://localhost:8081/');
    console.log('   🗳️ Voting system: ACTIVE');
    console.log('   👥 Admin panel: READY');
    console.log('   📰 Content: POPULATED');

  } catch (error) {
    console.error('❌ Error during setup:', error);
    console.log('\n💡 Make sure:');
    console.log('   1. Firestore is in test mode');
    console.log('   2. Your internet connection is stable');
    console.log('   3. Firebase project is properly configured');
  }
}

initializeCompleteSetup();