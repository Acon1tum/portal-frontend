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

  // WebSocket handlers
  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      const messageExists = prev.some(msg => msg.id === message.id);
      if (messageExists) {
        console.log('Message already exists, skipping duplicate:', message.id);
        return prev;
      }
      
      // Check if there's a temporary message to replace
      const tempMessageIndex = prev.findIndex(msg => 
        msg.id.startsWith('temp-') && 
        msg.content === message.content &&
        msg.senderId === message.senderId
      );
      
      if (tempMessageIndex !== -1) {
        console.log('Replacing temporary message with real message:', message.id);
        const newMessages = [...prev];
        newMessages[tempMessageIndex] = message;
        return newMessages;
      }
      
      console.log('Adding new message to chat:', message.id);
      return [...prev, message];
    });
  }, []);

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

  // Load contacts (users)
  const loadContacts = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const users = await chatService.getChatUsers();
      // Filter out the current user
      const filteredUsers = users.filter((u) => u.id !== user.id);
      setContacts(filteredUsers);
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
      setMessages(messagesData);
      setError(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [user, selectedContact]);

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
  };
}; 