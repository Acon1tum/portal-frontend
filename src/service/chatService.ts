import { MessageStatus } from '@/utils/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// Backend Message schema from Prisma
export interface ChatMessage {
  id: string;
  content: string;
  status: MessageStatus;
  hasAttachments: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string; // receiver
  senderId: string; // sender
  user?: {
    id: string;
    name: string;
    email: string;
  };
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  attachments?: Array<{
    id: string;
    url: string;
    fileName?: string;
    fileType?: string;
    size?: number;
    uploadedAt: string;
    messageId: string;
  }>;
}

export interface CreateMessageRequest {
  content: string;
  userId: string; // receiver
  senderId: string; // sender
  hasAttachments?: boolean;
}

export interface UpdateMessageRequest {
  content?: string;
  status?: MessageStatus;
  hasAttachments?: boolean;
}

export interface UpdateMessageStatusRequest {
  status: MessageStatus;
}

class ChatService {
  // Get all messages (includes user and sender data)
  async getMessages(): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get messages between two users
  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<ChatMessage[]> {
    try {
      const allMessages = await this.getMessages();
      
      // Filter messages between the two users
      return allMessages.filter(
        (message) =>
          (message.senderId === userId1 && message.userId === userId2) ||
          (message.senderId === userId2 && message.userId === userId1)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching messages between users:', error);
      throw error;
    }
  }

  // Get a single message by ID
  async getMessageById(id: string): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch message: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw error;
    }
  }

  // Create a new message
  async createMessage(messageData: CreateMessageRequest): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_URL}/messages/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create message: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  // Update a message
  async updateMessage(id: string, updateData: UpdateMessageRequest): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_URL}/messages/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/messages/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Update message status
  async updateMessageStatus(id: string, status: MessageStatus): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_URL}/messages/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update message status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }

  // Get users for chat contacts
  async getChatUsers(): Promise<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }>> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService(); 