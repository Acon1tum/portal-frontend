// WebSocket hook for real-time chat functionality
import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { MessageStatus } from '@/utils/types';
import { ChatMessage } from '@/service/chatService';

interface WebSocketMessage {
  message: ChatMessage;
  timestamp: string;
}

interface WebSocketStatusUpdate {
  messageId: string;
  status: string;
  timestamp: string;
}

interface UseWebSocketProps {
  onNewMessage: (message: ChatMessage) => void;
  onMessageStatusUpdate: (messageId: string, status: MessageStatus) => void;
  onMessageDeleted?: (messageId: string) => void;
  selectedContactId?: string;
}

// Type for socket.io socket
interface Socket {
  on(event: string, callback: (data: unknown) => void): void;
  emit(event: string, data?: unknown): void;
  close(): void;
}

export const useWebSocket = ({ onNewMessage, onMessageStatusUpdate, onMessageDeleted, selectedContactId }: UseWebSocketProps) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Import socket.io-client dynamically to avoid SSR issues
    import('socket.io-client').then((socketIO) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';
      const socket = socketIO.default(API_URL, {
        auth: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      socket.on('connect', () => {
        console.log('WebSocket connected successfully');
        console.log('Socket ID:', socket.id);
        // Authenticate the user and join their personal room
        socket.emit('authenticate', {
          userId: user.id,
          userEmail: user.email,
        });
        console.log('Sent authentication for user:', user.id);
      });

      socket.on('connect_error', (error: unknown) => {
        console.error('WebSocket connection error:', error);
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socket.on('test-message', (data: { message: string; timestamp: string }) => {
        console.log('Received test message from server:', data);
      });

      socket.on('pong', (data: { timestamp: string }) => {
        console.log('Received pong from server:', data);
      });

      socket.on('message-created', (data: WebSocketMessage) => {
        console.log('New message received:', data);
        console.log('Current user ID:', user.id);
        console.log('Selected contact ID:', selectedContactId);
        
        if (data.message) {
          // Check if the message is between current user and selected contact
          const isRelevantMessage = 
            (data.message.senderId === user.id && data.message.userId === selectedContactId) ||
            (data.message.senderId === selectedContactId && data.message.userId === user.id);
          
          console.log('Is relevant message:', isRelevantMessage);
          
          if (isRelevantMessage) {
            console.log('Adding message to chat');
            onNewMessage(data.message);
          } else {
            console.log('Message not relevant for current conversation');
          }
        }
      });

      socket.on('message-status-updated', (data: WebSocketStatusUpdate) => {
        console.log('Message status updated:', data);
        onMessageStatusUpdate(data.messageId, data.status as MessageStatus);
      });

      socket.on('message-deleted', (data: { messageId: string }) => {
        console.log('Message deleted:', data);
        onMessageDeleted?.(data.messageId);
      });

      socketRef.current = socket;

      return () => {
        socket.close();
      };
    }).catch((error) => {
      console.error('Failed to load socket.io-client:', error);
    });
  }, [user, selectedContactId, onNewMessage, onMessageStatusUpdate, onMessageDeleted]);

  const emitMessage = (message: ChatMessage, receiverId: string) => {
    console.log('Frontend emitting send-message:', { message, receiverId });
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        message,
        receiverId,
      });
    }
  };

  const emitDeleteMessage = (messageId: string) => {
    console.log('Frontend emitting delete-message:', { messageId, senderId: user?.id, receiverId: selectedContactId });
    if (socketRef.current) {
      socketRef.current.emit('delete-message', { 
        messageId,
        senderId: user?.id,
        receiverId: selectedContactId,
      });
    }
  };

  const emitStatusUpdate = (messageId: string, status: MessageStatus) => {
    console.log('Frontend emitting update-message-status:', { messageId, status, senderId: user?.id, receiverId: selectedContactId });
    if (socketRef.current) {
      socketRef.current.emit('update-message-status', { 
        messageId, 
        status,
        senderId: user?.id,
        receiverId: selectedContactId,
      });
    }
  };

  const testConnection = () => {
    if (socketRef.current) {
      console.log('Testing WebSocket connection...');
      socketRef.current.emit('ping');
    }
  };

  return {
    emitMessage,
    emitDeleteMessage,
    emitStatusUpdate,
    testConnection,
  };
}; 