// ChatService will manage all chat-related functionality
// In a real application, this would connect to a backend API

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    timestamp: string;
  }
  
  export class ChatService {
    private messages: Message[] = [];
    private localStorageKey = 'chat_messages';
  
    constructor() {
      this.loadMessages();
      this.initializeDummyMessages();
    }
  
    private loadMessages(): void {
      if (typeof window !== 'undefined') {
        const savedMessages = localStorage.getItem(this.localStorageKey);
        if (savedMessages) {
          this.messages = JSON.parse(savedMessages);
        }
      }
    }
  
    private saveMessages(): void {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.messages));
      }
    }
  
    private initializeDummyMessages(): void {
      // Only initialize if no messages exist
      if (this.messages.length === 0) {
        const dummyMessages: Message[] = [
          {
            id: '1',
            content: 'Hello there!',
            senderId: '1',
            receiverId: '2',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '2',
            content: 'Hi! How are you doing today?',
            senderId: '2',
            receiverId: '1',
            timestamp: new Date(Date.now() - 3500000).toISOString(),
          },
          {
            id: '3',
            content: 'I\'m doing great! Just checking in.',
            senderId: '1',
            receiverId: '2',
            timestamp: new Date(Date.now() - 3400000).toISOString(),
          },
          {
            id: '4',
            content: 'Have you reviewed the new business proposal?',
            senderId: '2',
            receiverId: '1',
            timestamp: new Date(Date.now() - 3300000).toISOString(),
          },
        ];
  
        this.messages = dummyMessages;
        this.saveMessages();
      }
    }
  
    // Get messages between two users
    getMessages(userId1: string, userId2: string): Message[] {
      return this.messages.filter(
        (message) =>
          (message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
  
    // Send a new message
    sendMessage(message: Message): void {
      this.messages.push(message);
      this.saveMessages();
      
      // In a real app, this would send the message to a server
      console.log('Message sent:', message);
      
      // Simulate a response after 1 second for demo purposes
      if (message.receiverId === '2') {
        setTimeout(() => {
          const response: Message = {
            id: Date.now().toString(),
            content: this.generateAutoResponse(message.content),
            senderId: '2',
            receiverId: '1',
            timestamp: new Date().toISOString(),
          };
          this.messages.push(response);
          this.saveMessages();
          
          // Dispatch a custom event to notify the chat page
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('newMessage', { detail: response }));
          }
        }, 1000);
      }
    }
  
    // Delete a message
    deleteMessage(messageId: string): void {
      this.messages = this.messages.filter(message => message.id !== messageId);
      this.saveMessages();
    }
  
    // Clear all messages between two users
    clearConversation(userId1: string, userId2: string): void {
      this.messages = this.messages.filter(
        message =>
          !(
            (message.senderId === userId1 && message.receiverId === userId2) ||
            (message.senderId === userId2 && message.receiverId === userId1)
          )
      );
      this.saveMessages();
    }
  
    // Simple auto-response generator for demo purposes
    private generateAutoResponse(message: string): string {
      const responses = [
        "Thanks for your message. I'll look into it.",
        "Got it! I'll get back to you soon.",
        "I appreciate you reaching out.",
        "Let me check and get back to you.",
        "Interesting. Can you tell me more?",
        "I'm working on it right now.",
        "That sounds great. Let's discuss further.",
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }