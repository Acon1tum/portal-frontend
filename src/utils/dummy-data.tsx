// File: src/app/utils/dummy-data.ts

import { AudioWaveform, Command } from "lucide-react";
import {
  User,
  Role,
  Business,
  TaglineCategory,
  Sex,
  Status,
  VerificationStatus,
  PermissionName,
  Permission,
  UserStatus,
  UserRole,
  UserType,
  CurrentJobStatus
} from "@/utils/types";

export const dummyData = {
  teams: [
    {
      name: "Marino Portal",  
      logo: "/qby.png",
      plan: "Quanby Solutions Inc.",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  users: [
    {
      id: "1",
      email: "superadmin@maritime.com",
      name: "Captain John Smith",
      sex: Sex.MALE,
      status: "online",
      role: UserRole.SUPERADMIN,
      userType: UserType.SUPERADMIN,
      currentJobStatus: null,
      isEmailVerified: true,
      accounts: [
        {
          id: "1",
          accountId: "superadmin",
          providerId: "local",
          userId: "1",
          password: "test123", // In production, this should be hashed.
          status: Status.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      devices: [],
      business: null,
      lastMessage: "Let me help with the admin settings",
      lastActive: new Date().toISOString(),
    },
    {
      id: "2",
      email: "contact@marinetech.com",
      name: "Robert Wilson",
      sex: Sex.MALE,
      role: UserRole.EXHIBITOR,
      userType: UserType.CORPORATE_PROFESSIONAL,
      currentJobStatus: null,
      isEmailVerified: true,
      accounts: [
        {
          id: "2",
          accountId: "exhibitor",
          providerId: "local",
          userId: "2",
          password: "test123", // In production, this should be hashed.
          status: Status.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      devices: [],
      business: null,
      lastMessage: "Could you share the updated designs?",
      lastActive: new Date().toISOString(),
    },
    {
      id: "3",
      email: "captain.anderson@email.com",
      name: "Captain Michael Anderson",
      sex: Sex.MALE,
      role: UserRole.JOBSEEKER,
      userType: UserType.SEAFARER,
      currentJobStatus: CurrentJobStatus.ACTIVELY_LOOKING,
      isEmailVerified: true,
      accounts: [
        {
          id: "3",
          accountId: "jobseeker1",
          providerId: "local",
          userId: "3",
          password: "test123",
          status: Status.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      devices: [],
      business: null,
      lastMessage: "Looking for new opportunities",
      lastActive: new Date().toISOString(),
    },
    {
      id: "4",
      email: "info@globalcrews.com",
      name: "Maria Rodriguez",
      sex: Sex.FEMALE,
      role: UserRole.MANNING_AGENCY,
      userType: UserType.CORPORATE_PROFESSIONAL,
      currentJobStatus: null,
      isEmailVerified: true,
      accounts: [
        {
          id: "4",
          accountId: "agency1",
          providerId: "local",
          userId: "4",
          password: "test123",
          status: Status.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      devices: [],
      business: null,
      lastMessage: "We have new job openings",
      lastActive: new Date().toISOString(),
    },
    {
      id: "5",
      email: "partnerships@oceanfreight.com",
      name: "Lisa Thompson",
      sex: Sex.FEMALE,
      role: UserRole.SPONSOR,
      userType: UserType.CORPORATE_PROFESSIONAL,
      currentJobStatus: null,
      isEmailVerified: true,
      accounts: [
        {
          id: "5",
          accountId: "sponsor",
          providerId: "local",
          userId: "5",
          password: "test123",
          status: Status.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      devices: [],
      business: null,
      lastMessage: "Partnership opportunities available",
      lastActive: new Date().toISOString(),
    },
  ],
  roles: [
    {
      id: "1",
      name: "Admin",
      permissions: [
        { id: "1", name: PermissionName.BUSINESS_CREATE },
        { id: "2", name: PermissionName.BUSINESS_READ },
        { id: "3", name: PermissionName.BUSINESS_UPDATE },
        { id: "4", name: PermissionName.BUSINESS_DELETE }
      ] as Permission[],
    },
    {
      id: "2",
      name: "Product Manager",
      permissions: [
        { id: "2", name: PermissionName.BUSINESS_READ }
      ] as Permission[],
    },
    {
      id: "3",
      name: "Developer",
      permissions: [
        { id: "2", name: PermissionName.BUSINESS_READ }
      ] as Permission[],
    },
    {
      id: "4",
      name: "Designer",
      permissions: [
        { id: "2", name: PermissionName.BUSINESS_READ }
      ] as Permission[],
    },
    {
      id: "5",
      name: "Financial Analyst",
      permissions: [
        { id: "2", name: PermissionName.BUSINESS_READ }
      ] as Permission[],
    },
  ],
  businesses: [
    {
      id: "1",
      name: "TechSolutions Inc.",
      domain: "techsolutions.com",
      logo: "/tech.jpeg",
      industry: "Technology",
      description:
        "Enterprise software solutions and IT consulting services for businesses of all sizes. Specializing in cloud migration, security, and custom app development.",
      location: "San Francisco, CA",
      phoneNumber: "+1234567890",
      email: "contact@techsolutions.com",
      websiteUrl: "https://techsolutions.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "1",
      verificationStatus: VerificationStatus.VERIFIED,
      taglineCategories: [{ id: "1", name: "Technology" }],
    },
    {
      id: "2",
      name: "Global Logistics Partners",
      domain: "glpartners.com",
      logo: "/supply.jpg",
      industry: "Supply Chain",
      description:
        "End-to-end supply chain management and logistics services with global reach. Optimizing distribution networks and reducing operational costs.",
      location: "Chicago, IL",
      phoneNumber: "+1987654321",
      email: "info@glpartners.com",
      websiteUrl: "https://glpartners.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "2",
      verificationStatus: VerificationStatus.VERIFIED,
      taglineCategories: [{ id: "3", name: "Logistics" }],
    },
    {
      id: "3",
      name: "InnovateMfg",
      domain: "innovatemfg.com",
      logo: "/manu.jpg",
      industry: "Manufacturing",
      description:
        "Custom manufacturing solutions with rapid prototyping capabilities. From concept to production with state-of-the-art facilities.",
      location: "Detroit, MI",
      phoneNumber: "+1122334455",
      email: "contact@innovatemfg.com",
      websiteUrl: "https://innovatemfg.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "3",
      verificationStatus: VerificationStatus.PENDING,
      taglineCategories: [{ id: "2", name: "Manufacturing" }],
    },
    {
      id: "4",
      name: "HealthTech Solutions",
      domain: "healthtechsolutions.com",
      logo: "/health.jpg",
      industry: "Healthcare",
      description:
        "Innovative healthcare technology solutions for hospitals and clinics. Improving patient outcomes through digital transformation.",
      location: "Boston, MA",
      phoneNumber: "+1567891234",
      email: "info@healthtechsolutions.com",
      websiteUrl: "https://healthtechsolutions.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "4",
      verificationStatus: VerificationStatus.VERIFIED,
      taglineCategories: [
        { id: "4", name: "Healthcare" },
        { id: "1", name: "Technology" },
      ],
    },
    {
      id: "5",
      name: "FinSecure Solutions",
      domain: "finsecure.com",
      logo: "/finance.jpg",
      industry: "Finance",
      description:
        "Financial security and compliance solutions for banks and financial institutions. Protecting digital assets with advanced encryption and security protocols.",
      location: "New York, NY",
      phoneNumber: "+1678912345",
      email: "info@finsecure.com",
      websiteUrl: "https://finsecure.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: "5",
      verificationStatus: VerificationStatus.UNVERIFIED,
      taglineCategories: [
        { id: "5", name: "Finance" },
        { id: "1", name: "Technology" },
      ],
    },
  ],
  taglineCategories: [
    { id: "1", name: "Technology" },
    { id: "2", name: "Manufacturing" },
    { id: "3", name: "Logistics" },
    { id: "4", name: "Healthcare" },
    { id: "5", name: "Finance" },
    { id: "6", name: "Education" },
  ],
  recentActivities: [
    { id: 1, business: "TechSolutions Inc.", action: "Profile updated", time: "2 hours ago" },
    { id: 2, business: "Global Logistics Partners", action: "New connection request", time: "Yesterday" },
    { id: 3, business: "InnovateMfg", action: "Verification in progress", time: "2 days ago" },
    { id: 4, business: "FinSecure Solutions", action: "New business registered", time: "3 days ago" },
  ],
  messages: [
    {
      id: "1",
      content: "Hello there! How are you doing today?",
      senderId: "1", // Admin
      receiverId: "2", // Jane
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
    },
    {
      id: "2",
      content: "Hi! I'm good, thanks for asking. Working on the product roadmap for Q2.",
      senderId: "2", // Jane
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      isRead: true,
    },
    {
      id: "3",
      content: "That sounds great! When do you think we can review it?",
      senderId: "1", // Admin
      receiverId: "2", // Jane
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      isRead: true,
    },
    {
      id: "4",
      content: "I should have a draft ready by Thursday. Do you have time for a meeting then?",
      senderId: "2", // Jane
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      isRead: true,
    },
    {
      id: "5",
      content: "Thursday works perfectly. Let's schedule for 2 PM.",
      senderId: "1", // Admin
      receiverId: "2", // Jane
      timestamp: new Date(Date.now() - 3200000).toISOString(),
      isRead: true,
    },
    {
      id: "6",
      content: "Great! I'll send a calendar invite. Also, could you share the updated design specs from the design team?",
      senderId: "2", // Jane
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 3100000).toISOString(),
      isRead: false,
    },
    // Messages between Admin and Alex
    {
      id: "7",
      content: "Hey Alex, how's the bug fix coming along?",
      senderId: "1", // Admin
      receiverId: "3", // Alex
      timestamp: new Date(Date.now() - 4600000).toISOString(),
      isRead: true,
    },
    {
      id: "8",
      content: "Hi! I've identified the issue. It's related to the database indexing.",
      senderId: "3", // Alex
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 4500000).toISOString(),
      isRead: true,
    },
    {
      id: "9",
      content: "Can you estimate when you'll have it fixed?",
      senderId: "1", // Admin
      receiverId: "3", // Alex
      timestamp: new Date(Date.now() - 4400000).toISOString(),
      isRead: true,
    },
    {
      id: "10",
      content: "I should have it resolved by end of day. I'll push the changes to the dev branch.",
      senderId: "3", // Alex
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 4300000).toISOString(),
      isRead: true,
    },
    // Messages between Admin and Sarah
    {
      id: "11",
      content: "Sarah, do you have the new UI mockups ready?",
      senderId: "1", // Admin
      receiverId: "4", // Sarah
      timestamp: new Date(Date.now() - 86500000).toISOString(),
      isRead: true,
    },
    {
      id: "12",
      content: "Yes, I've finished them! I'll share the Figma link shortly.",
      senderId: "4", // Sarah
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: true,
    },
    // Messages between Admin and Michael
    {
      id: "13",
      content: "Michael, we need to discuss the Q2 budget projections.",
      senderId: "1", // Admin
      receiverId: "5", // Michael
      timestamp: new Date(Date.now() - 172900000).toISOString(),
      isRead: true,
    },
    {
      id: "14",
      content: "Sure thing. I've prepared the analysis. When would you like to meet?",
      senderId: "5", // Michael
      receiverId: "1", // Admin
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      isRead: true,
    },
  ],
  userPresence: [
    {
      userId: "1",
      status: UserStatus.ONLINE,
      lastActive: new Date().toISOString(),
    },
    {
      userId: "2",
      status: UserStatus.ONLINE,
      lastActive: new Date().toISOString(),
    },
    {
      userId: "3",
      status: UserStatus.AWAY,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      userId: "4",
      status: UserStatus.OFFLINE,
      lastActive: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      userId: "5",
      status: UserStatus.BUSY,
      lastActive: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

export const getUserById = (id: string): User | undefined =>
  dummyData.users.find((user) => user.id === id);

export const getRoleById = (id: string): Role | undefined =>
  dummyData.roles.find((role) => role.id === id);

export const getBusinessById = (id: string): Business | undefined =>
  dummyData.businesses.find((business) => business.id === id);

export const getAllUsers = (): User[] => dummyData.users;

export const getAllRoles = (): Role[] => dummyData.roles;

export const getAllBusinesses = (): Business[] => dummyData.businesses;

export const getAllTaglineCategories = (): TaglineCategory[] => dummyData.taglineCategories;

export const getMessages = (userId1: string, userId2: string) => {
  return dummyData.messages.filter(
    message => 
      (message.senderId === userId1 && message.receiverId === userId2) || 
      (message.senderId === userId2 && message.receiverId === userId1)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getUserStatus = (userId: string) => {
  const presence = dummyData.userPresence.find(p => p.userId === userId);
  return presence?.status || UserStatus.OFFLINE;
};

export const authenticateUser = (
  email: string,
  password: string
): { token: string; user: User } | null => {
  const user = dummyData.users.find((u) => u.email === email);
  if (!user) return null;

  const account = user.accounts[0];
  if (account.password === password) {
    return { token: `dummy-token-${user.id}`, user };
  }
  return null;
};