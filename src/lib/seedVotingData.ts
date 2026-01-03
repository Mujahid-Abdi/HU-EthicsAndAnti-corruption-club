import { FirestoreService, Collections } from './firestore';

export const seedVotingData = async () => {
  try {
    // Create a sample election
    const electionData = {
      title: "HUEC Executive Committee Election 2025",
      description: "Annual election for the Haramaya University Ethics and Anti-Corruption Club executive committee positions.",
      status: "open",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      resultsPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const electionId = await FirestoreService.create(Collections.ELECTIONS, electionData);
    console.log('Election created with ID:', electionId.id);

    // Create sample candidates
    const candidates = [
      {
        fullName: "Abebe Kebede",
        position: "president",
        department: "Computer Science",
        batch: "2022",
        manifesto: "I am committed to promoting transparency and accountability in our university. My vision is to create a corruption-free environment where every student can thrive academically and personally.",
        photoUrl: null,
        electionId: electionId.id,
        createdAt: new Date()
      },
      {
        fullName: "Tigist Haile",
        position: "president",
        department: "Business Administration",
        batch: "2021",
        manifesto: "With my experience in student leadership, I will work tirelessly to strengthen our anti-corruption initiatives and ensure that ethical conduct is at the heart of everything we do.",
        photoUrl: null,
        electionId: electionId.id,
        createdAt: new Date()
      },
      {
        fullName: "Dawit Tesfaye",
        position: "vice_president",
        department: "Engineering",
        batch: "2022",
        manifesto: "As your Vice President, I will support innovative programs that educate students about ethics and provide platforms for reporting concerns safely and anonymously.",
        photoUrl: null,
        electionId: electionId.id,
        createdAt: new Date()
      },
      {
        fullName: "Hanan Mohammed",
        position: "vice_president",
        department: "Agriculture",
        batch: "2023",
        manifesto: "I believe in the power of collective action. Together, we can build a university community based on integrity, respect, and mutual accountability.",
        photoUrl: null,
        electionId: electionId.id,
        createdAt: new Date()
      },
      {
        fullName: "Samuel Girma",
        position: "secretary",
        department: "Law",
        batch: "2021",
        manifesto: "With my legal background, I will ensure that our club operates with the highest standards of transparency and that all our activities are properly documented and accessible.",
        photoUrl: null,
        electionId: electionId.id,
        createdAt: new Date()
      },
      {
        fullName: "Meron Tadesse",
        position: "secretary",
        department: "Social Sciences",
        batch: "2022",
        manifesto: "I will work to improve communication between the club and students, ensuring that everyone is informed about our activities and has opportunities to participate meaningfully.",
        photoUrl: null,
        electionId: electionId.id,
        createdAt: new Date()
      }
    ];

    // Add all candidates
    for (const candidate of candidates) {
      const candidateResult = await FirestoreService.create(Collections.CANDIDATES, candidate);
      console.log(`Candidate ${candidate.fullName} created with ID:`, candidateResult.id);
    }

    console.log('Voting data seeded successfully!');
    return { electionId: electionId.id, candidatesCount: candidates.length };
  } catch (error) {
    console.error('Error seeding voting data:', error);
    throw error;
  }
};

// Helper function to clear voting data (for testing)
export const clearVotingData = async () => {
  try {
    // Get all elections and candidates
    const elections = await FirestoreService.getAll(Collections.ELECTIONS);
    const candidates = await FirestoreService.getAll(Collections.CANDIDATES);
    const votes = await FirestoreService.getAll(Collections.VOTES);

    // Delete all votes
    for (const vote of votes) {
      await FirestoreService.delete(Collections.VOTES, vote.id);
    }

    // Delete all candidates
    for (const candidate of candidates) {
      await FirestoreService.delete(Collections.CANDIDATES, candidate.id);
    }

    // Delete all elections
    for (const election of elections) {
      await FirestoreService.delete(Collections.ELECTIONS, election.id);
    }

    console.log('Voting data cleared successfully!');
  } catch (error) {
    console.error('Error clearing voting data:', error);
    throw error;
  }
};