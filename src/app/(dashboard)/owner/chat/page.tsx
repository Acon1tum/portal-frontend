"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Paperclip, Send, Smile, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/custom-ui/chat/empty-chat";
import ChatHeader from "@/components/custom-ui/chat/chat-header";
import ChatMessage from "@/components/custom-ui/chat/chat-message";
import ContactList from "@/components/custom-ui/chat/contact-list";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/utils/types";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiData {
  native: string;
}

export type Contact = {
  id: string;
  name: string;
  email: string;
  role: string;
  userType?: string;
};

function userToContact(user: User | null | undefined): Contact | null {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name ?? "Unknown User",
    email: user.email,
    role: user.role,
    userType: user.userType ?? undefined,
  };
}

export default function ChatPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const {
    messages,
    contacts,
    selectedContact,
    loading,
    error,
    sendMessage,
    selectContact,
    deleteMessage,
    refreshMessages,
    searchUsersForNewChat,
    startNewConversation,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle URL parameter for pre-selected user
  useEffect(() => {
    const userParam = searchParams.get('user');
    if (userParam && !selectedContact) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        // Use startNewConversation to add the user to contacts and select them
        startNewConversation(userData);
      } catch (error) {
        console.error('Error parsing user data from URL:', error);
      }
    }
  }, [searchParams, selectedContact, startNewConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((!newMessage.trim() && !file) || !selectedContact || !user || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage, selectedContact.id);
      setNewMessage("");
      setFile(null);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiSelect = (emoji: EmojiData) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleStartNewConversation = (contact: Contact) => {
    // Transform the user to the expected format and select them
    const contactUser = {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      role: contact.role,
      userType: contact.userType,
    };
    selectContact(contactUser);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-1/4 bg-card border-r border-border shadow-sm">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Chats</h2>
          </div>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
        <div className="w-3/4 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-1/4 bg-card border-r border-border shadow-sm">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Chats</h2>
          </div>
          <div className="flex items-center justify-center p-8">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <div className="w-3/4 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refreshMessages} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Explicitly type contacts to ensure it's Contact[]
  const typedContacts: Contact[] = contacts as Contact[];

  return (
    <div className="flex h-screen bg-background">
      {/* Contacts sidebar */}
      <div className="w-1/4 bg-card border-r border-border shadow-sm">
        <ContactList
          contacts={typedContacts}
          currentUser={userToContact(user as User)}
          selectedContact={userToContact(selectedContact as User)}
          onSelectContact={(contact: Contact) => selectContact(contact)}
          onSearchUsers={searchUsersForNewChat}
          onStartNewConversation={(contact: Contact) => handleStartNewConversation(contact)}
        />
      </div>

      {/* Chat area */}
      <div className="w-3/4 flex flex-col">
        {selectedContact ? (
          <>
            <ChatHeader contact={userToContact(selectedContact as User)!} />

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-secondary scroll-none relative">
              <div className="max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  <EmptyState type="no-messages" contact={userToContact(selectedContact as User)!} />
                ) : (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isOutgoing={message.senderId === user?.id}
                      sender={userToContact(
                        message.senderId === user?.id ? (user as User) : (selectedContact as User)
                      )}
                      onDelete={handleDeleteMessage}
                      onReply={() => {
                        // reply functionality here
                      }}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {showEmojiPicker && (
                <div className="absolute bottom-24 right-6 z-50">
                  <Picker onEmojiSelect={handleEmojiSelect} data={data} />
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="border-t border-border p-4 bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 relative">
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
                  onClick={handleAttachClick}
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 px-4 py-2 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  disabled={isSending}
                />

                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  type="submit"
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition disabled:opacity-50"
                  disabled={isSending || (!newMessage.trim() && !file)}
                >
                  {isSending ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>

              {/* Show uploaded image preview */}
              {file && (
                <div className="mt-2 flex items-center space-x-4 bg-muted p-2 rounded-lg">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-sm text-foreground">{file.name}</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyState type="no-contact" />
        )}
      </div>
    </div>
  );
}
