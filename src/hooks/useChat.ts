import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { chatService, ChatMessage, CreateMessageRequest } from '@/service/chatService';
import { MessageStatus } from '@/utils/types';
import { useWebSocket } from './useWebSocket';

interface UseChatReturn {
  messages: ChatMessage[];
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }>;
  selectedContact: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  } | null;
  loading: boolean;
  error: string | null;
  sendMessage: (content: string, receiverId: string) => Promise<void>;
  selectContact: (contact: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }) => void;
  deleteMessage: (messageId: string) => Promise<void>;
  updateMessageStatus: (messageId: string, status: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  searchUsersForNewChat: (query?: string) => Promise<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }>>;
  startNewConversation: (user: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }) => void;
}

export const useChat = (): UseChatReturn => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }>>([]);
  const [selectedContact, setSelectedContact] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load contacts (users with conversations)
  const loadContacts = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const contactsData = await chatService.getChatContacts(user.id);
      setContacts(contactsData);
      setError(null);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load messages between current user and selected contact
  const loadMessages = useCallback(async () => {
    if (!user || !selectedContact) return;

    try {
      setLoading(true);
      const messagesData = await chatService.getMessagesBetweenUsers(user.id, selectedContact.id);
      console.log('Loaded messages:', messagesData);
      // Validate message dates before setting
      const validatedMessages = messagesData.map(msg => {
        if (!msg.createdAt || isNaN(new Date(msg.createdAt).getTime())) {
          console.warn('Invalid message createdAt:', msg);
          return {
            ...msg,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        return msg;
      });
      setMessages(validatedMessages);
      setError(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user, selectedContact]);

  // WebSocket handlers
  const handleNewMessage = useCallback((message: ChatMessage) => {
    // Validate message dates
    const validatedMessage = {
      ...message,
      createdAt: message.createdAt && !isNaN(new Date(message.createdAt).getTime()) 
        ? message.createdAt 
        : new Date().toISOString(),
      updatedAt: message.updatedAt && !isNaN(new Date(message.updatedAt).getTime()) 
        ? message.updatedAt 
        : new Date().toISOString()
    };

    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      const messageExists = prev.some(msg => msg.id === validatedMessage.id);
      if (messageExists) {
        console.log('Message already exists, skipping duplicate:', validatedMessage.id);
        return prev;
      }
      
      // Check if there's a temporary message to replace
      const tempMessageIndex = prev.findIndex(msg => 
        msg.id.startsWith('temp-') && 
        msg.content === validatedMessage.content &&
        msg.senderId === validatedMessage.senderId
      );
      
      if (tempMessageIndex !== -1) {
        console.log('Replacing temporary message with real message:', validatedMessage.id);
        const newMessages = [...prev];
        newMessages[tempMessageIndex] = validatedMessage;
        return newMessages;
      }
      
      console.log('Adding new message to chat:', validatedMessage.id);
      return [...prev, validatedMessage];
    });

    // Update contacts if this is a new conversation
    setContacts(prev => {
      const isNewConversation = !prev.some(contact => 
        contact.id === message.senderId || contact.id === message.userId
      );
      
      if (isNewConversation && user) {
        // Refresh contacts to get the updated list with proper user data
        loadContacts();
        return prev; // Return current contacts, will be updated by loadContacts
      }
      
      return prev;
    });
  }, [user, loadContacts]);

  const handleMessageStatusUpdate = useCallback((messageId: string, status: MessageStatus) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const handleMessageDeleted = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  // Initialize WebSocket
  const { emitMessage, emitDeleteMessage, emitStatusUpdate } = useWebSocket({
    onNewMessage: handleNewMessage,
    onMessageStatusUpdate: handleMessageStatusUpdate,
    onMessageDeleted: handleMessageDeleted,
    selectedContactId: selectedContact?.id,
  });

  // Send a message
  const sendMessage = useCallback(async (content: string, receiverId: string) => {
    if (!user || !content.trim()) return;

    try {
      const messageData: CreateMessageRequest = {
        content: content.trim(),
        userId: receiverId, // receiver
        senderId: user.id, // sender
        hasAttachments: false,
      };

      // Add optimistic update with temporary ID
      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        status: 'PENDING' as MessageStatus,
        hasAttachments: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: receiverId,
        senderId: user.id,
      };
      
      setMessages(prev => [...prev, tempMessage]);

      const newMessage = await chatService.createMessage(messageData);
      
      // Replace temporary message with real message
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? newMessage : msg
      ));
      
      // Emit WebSocket event for real-time updates
      emitMessage(newMessage, receiverId);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    }
  }, [user, emitMessage]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Emit WebSocket event for real-time updates
      emitDeleteMessage(messageId);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message');
    }
  }, [emitDeleteMessage]);

  // Update message status
  const updateMessageStatus = useCallback(async (messageId: string, status: string) => {
    try {
      await chatService.updateMessageStatus(messageId, status as MessageStatus);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, status: status as MessageStatus } : msg
        )
      );
      
      // Emit WebSocket event for real-time updates
      emitStatusUpdate(messageId, status as MessageStatus);
    } catch (err) {
      console.error('Error updating message status:', err);
      setError('Failed to update message status');
    }
  }, [emitStatusUpdate]);

  // Select a contact
  const selectContact = useCallback((contact: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }) => {
    setSelectedContact(contact);
  }, []);

  // Search users for new conversations
  const searchUsersForNewChat = useCallback(async (query?: string) => {
    if (!user) return [];
    
    try {
      const users = await chatService.searchUsersForNewChat(user.id, query);
      return users;
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users');
      return [];
    }
  }, [user]);

  // Start a new conversation
  const startNewConversation = useCallback((user: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  }) => {
    // Add the user to contacts if not already present
    setContacts(prev => {
      const contactExists = prev.some(contact => contact.id === user.id);
      if (!contactExists) {
        return [...prev, user];
      }
      return prev;
    });
    
    // Select the user as the current contact
    selectContact(user);
    
    // Clear messages for the new conversation
    setMessages([]);
  }, [selectContact]);

  // Refresh messages
  const refreshMessages = useCallback(async () => {
    await loadMessages();
  }, [loadMessages]);



  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Load messages when contact changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    contacts,
    selectedContact,
    loading,
    error,
    sendMessage,
    selectContact,
    deleteMessage,
    updateMessageStatus,
    refreshMessages,
    searchUsersForNewChat,
    startNewConversation,
  };
}; 