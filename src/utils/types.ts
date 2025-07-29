// File: src/app/utils/types.ts

// Exported enums - Updated to match backend Prisma schema
export enum VerificationStatus {
  VERIFIED = "VERIFIED",
  PENDING = "PENDING",
  UNVERIFIED = "UNVERIFIED",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// Updated to match backend UserRole enum
export enum UserRole {
  VISITOR = "VISITOR",
  JOBSEEKER = "JOBSEEKER",
  MANNING_AGENCY = "MANNING_AGENCY",
  SUPERADMIN = "SUPERADMIN",
  EXHIBITOR = "EXHIBITOR",
  SPONSOR = "SPONSOR",
}

// Updated to match backend UserType enum
export enum UserType {
  SEAFARER = "SEAFARER",
  CORPORATE_PROFESSIONAL = "CORPORATE_PROFESSIONAL",
  STUDENTS = "STUDENTS",
  OTHERS = "OTHERS",
  SUPERADMIN = "SUPERADMIN",
}

// Updated to match backend CurrentJobStatus enum
export enum CurrentJobStatus {
  ACTIVELY_LOOKING = "ACTIVELY_LOOKING",
  OPEN_TO_OFFERS = "OPEN_TO_OFFERS",
  NOT_LOOKING = "NOT_LOOKING",
}

export enum PermissionName {
  BUSINESS_CREATE = "BUSINESS_CREATE",
  BUSINESS_READ = "BUSINESS_READ",
  BUSINESS_UPDATE = "BUSINESS_UPDATE",
  BUSINESS_DELETE = "BUSINESS_DELETE",
}

// Exported interfaces
export interface Permission {
  id: string;
  name: PermissionName;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface TaglineCategory {
  id: string;
  name: string;
}

export interface Business {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  industry?: string;
  description?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  verificationStatus: VerificationStatus;
  taglineCategories: TaglineCategory[];
}

export interface FeaturedBusinessesProps {
  businesses: Array<{
    id: string;
    name: string;
    domain?: string | null;
    logo?: string | null;
    industry?: string | null;
    description?: string | null;
    location?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    websiteUrl?: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
    userId?: string | null;
    verificationStatus: VerificationStatus;
    taglineCategories: Array<{
      id: string;
      name: string;
    }>;
  }>;
  searchQuery: string;
  selectedCategory: string;
}

export interface Account {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  password: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}


// Updated User interface to match backend Prisma schema
export interface User {
  id: string;
  email: string;
  name: string | null;
  sex: Sex;
  role: UserRole;
  userType: UserType | null;
  currentJobStatus: CurrentJobStatus | null;
  isEmailVerified: boolean;
  accounts: Account[];
  business: Business | null;
}

// Backend session user interface (what the backend returns)
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  userType: UserType | null;
  currentJobStatus: CurrentJobStatus | null;
}

// Chat related types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  isRead?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size: number;
  messageId: string;
}

export enum AttachmentType {
  IMAGE = "IMAGE",
  FILE = "FILE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  lastMessageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  read: boolean;
  createdAt: string;
}

export enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  AWAY = "AWAY",
  BUSY = "BUSY",
}

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastActive: string;
}