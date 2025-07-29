"use client";

import { useState, useEffect, useRef } from "react";
import { ChatService } from "@/components/custom-ui/chat/chat-service";
import { User } from "@/utils/types";
import { dummyData } from "@/utils/dummy-data";
import { Paperclip, Send, Smile } from "lucide-react";
import EmptyState from "@/components/custom-ui/chat/empty-chat";
import ChatHeader from "@/components/custom-ui/chat/chat-header";
import ChatMessage from "@/components/custom-ui/chat/chat-message";
import ContactsList from "@/components/custom-ui/chat/contact-list";
import Picker from "@emoji-mart/react"
// import data from "@emoji-mart/data"


export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = new ChatService();

  useEffect(() => {
    const user = dummyData.users[0];
    setCurrentUser(user);
    setSelectedContact(dummyData.users[1]);
    if (user) loadMessages();

    const handleNewMessage = (event: CustomEvent) => {
      const newMsg = event.detail;
      if (newMsg.senderId === selectedContact?.id && newMsg.receiverId === user.id) {
        setMessages(prevMessages => [...prevMessages, newMsg]);
      }
    };

    window.addEventListener("newMessage", handleNewMessage as EventListener);

    return () => {
      window.removeEventListener("newMessage", handleNewMessage as EventListener);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
  }, [selectedContact]);

  const loadMessages = () => {
    if (selectedContact && currentUser) {
      const loadedMessages = chatService.getMessages(currentUser.id, selectedContact.id);
      setMessages(loadedMessages);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
  
    if ((!newMessage.trim() && !file) || !currentUser || !selectedContact) return;
  
    const attachments = file
      ? [{
          id: Date.now().toString(),
          type: "image",  
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        }]
      : [];
  
    const message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments,   
    };
  
    chatService.sendMessage(message);
    setMessages([...messages, message]);
    setNewMessage("");
    setFile(null);
  };
  

  const handleEmojiSelect = (emoji: any) => {
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

  return (
    <div className="flex h-screen bg-background">
      {/* Contacts sidebar */}
      <div className="w-1/4 bg-card border-r border-border shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Chats</h2>
        </div>
        <ContactsList
          contacts={dummyData.users}
          currentUser={currentUser}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
      </div>

      {/* Chat area */}
      <div className="w-3/4 flex flex-col">
        {selectedContact ? (
          <>
            <ChatHeader contact={selectedContact} />

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-secondary scroll-none relative">
              <div className="max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  <EmptyState type="no-messages" contact={selectedContact} />
                ) : (
                  messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isOutgoing={message.senderId === currentUser?.id}
                      sender={message.senderId === currentUser?.id ? currentUser : selectedContact}
                      onDelete={(messageId) => {
                        chatService.deleteMessage(messageId);
                        setMessages(messages.filter((m) => m.id !== messageId));
                      }}
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
                  <Picker onEmojiSelect={handleEmojiSelect} />
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
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
                >
                  <Send className="w-5 h-5" />
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
