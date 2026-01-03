import { Timestamp } from 'firebase/firestore';

// Base interface for all documents
export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User types
export interface User extends BaseDocument {
  email: string;
  fullName: string;
  department?: string;
  batch?: string;
  yearOfStudy?: string;
  phone?: string;
  isApproved: boolean;
  role: 'admin' | 'member';
  position?: string;
}

// Report types
export interface Report extends BaseDocument {
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  isAnonymous: boolean;
  reporterEmail?: string;
  reporterName?: string;
  attachments?: string[];
  adminNotes?: string;
}

// Event types
export interface Event extends BaseDocument {
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  imageUrl?: string;
  published: boolean;
  maxAttendees?: number;
  registeredAttendees: string[];
}

// News types
export interface News extends BaseDocument {
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  published: boolean;
  author: string;
  tags?: string[];
}

// Gallery types
export interface Gallery extends BaseDocument {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  published: boolean;
}

// Resource types
export interface Resource extends BaseDocument {
  title: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
  category: string;
  published: boolean;
  downloadCount: number;
}

// Election types
export type ElectionStatus = 'draft' | 'open' | 'closed';
export type ElectionPosition = 'president' | 'vice_president' | 'secretary';

export interface Election extends BaseDocument {
  title: string;
  description?: string;
  status: ElectionStatus;
  startDate?: Timestamp;
  endDate?: Timestamp;
  resultsPublic: boolean;
}

export interface Candidate extends BaseDocument {
  electionId: string;
  fullName: string;
  position: ElectionPosition;
  photoUrl?: string;
  department: string;
  batch: string;
  manifesto?: string;
}

export interface Vote extends BaseDocument {
  electionId: string;
  userId: string;
  voterFullName: string;
  voterStudentId: string;
  voterDepartment: string;
  voterBatch: string;
  presidentCandidateId?: string;
  vicePresidentCandidateId?: string;
  secretaryCandidateId?: string;
}

// Executive types
export interface Executive extends BaseDocument {
  fullName: string;
  position: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  department?: string;
  batch?: string;
  order: number;
}

// System settings
export interface SystemSettings {
  votingEnabled: boolean;
  registrationEnabled: boolean;
  electionOpen: boolean;
  maintenanceMode: boolean;
}