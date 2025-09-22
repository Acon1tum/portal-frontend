import { FC, useState } from "react";
import { UserStatus, MessageStatus } from "@/utils/types";
import { formatDistanceToNow, format } from "date-fns";
import { Check, CheckCheck, Trash2, Reply, Copy, MoreHorizontal, Image, FileText, X } from "lucide-react";
import UserAvatar from "./user-avatar";
import type { ChatMessage } from "@/service/chatService";

interface ChatMessageProps {
  message: ChatMessage;
  isOutgoing: boolean;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
    userType?: string;
  } | null;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

const ChatMessage: FC<ChatMessageProps> = ({ 
  message, 
  isOutgoing, 
  sender,
  onDelete,
  onReply 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showFullTime, setShowFullTime] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Safely handle date formatting with fallback
  const getFormattedTime = () => {
    try {
      if (!message.createdAt) {
        console.warn('Message has no createdAt:', message);
        return 'Just now';
      }
      const date = new Date(message.createdAt);
      if (isNaN(date.getTime())) {
        console.warn('Invalid createdAt date:', message.createdAt, 'for message:', message);
        return 'Just now';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting message time:', error, 'for message:', message);
      return 'Just now';
    }
  };

  const getFullTime = () => {
    try {
      if (!message.createdAt) return 'Unknown time';
      const date = new Date(message.createdAt);
      if (isNaN(date.getTime())) return 'Unknown time';
      return format(date, 'PPpp');
    } catch (error) {
      console.error('Error formatting full message time:', error);
      return 'Unknown time';
    }
  };

  const formattedTime = getFormattedTime();
  const fullTime = getFullTime();
  
  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setShowActions(false);
  };
  
  const handleDeleteMessage = () => {
    if (onDelete) {
      onDelete(message.id);
    }
    setShowActions(false);
  };
  
  const handleReplyMessage = () => {
    if (onReply) {
      onReply(message.id);
    }
    setShowActions(false);
  };
  
  const renderAttachment = (attachment: NonNullable<ChatMessage['attachments']>[0]) => {
    if (!attachment) return null;
    
    const isImage = attachment.fileType?.startsWith('image/');
    
    if (isImage) {
      return (
        <div 
          key={attachment.id}
          className="mt-2 relative cursor-pointer"
          onClick={() => setImagePreview(attachment.url)}
        >
          <div className="rounded-lg overflow-hidden max-w-xs max-h-60">
            <img 
              src={attachment.url} 
              alt={attachment.fileName || 'Image'} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div 
          key={attachment.id}
          className="mt-2 bg-muted rounded-lg p-3 flex items-center max-w-xs"
        >
          <div className="mr-3">
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{attachment.fileName || 'File'}</p>
            <p className="text-xs text-gray-500">
              {attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : 'Unknown size'}
            </p>
          </div>
        </div>
      );
    }
  };
  
  return (
    <>
      <div
        className={`flex ${
          isOutgoing ? "justify-end" : "justify-start"
        } mb-3 group relative`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex max-w-[70%] items-end">
          {!isOutgoing && (
            <div className="flex-shrink-0 mr-2 mb-1">
              <UserAvatar 
                user={sender} 
                showStatus={true} 
                status={sender?.id === '1' ? UserStatus.ONLINE : UserStatus.OFFLINE}
                size="sm"
              />
            </div>
          )}
          
          <div className="flex flex-col">
            <div
              className={`relative rounded-2xl px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                isOutgoing
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600"
              }`}
              onClick={() => setShowFullTime(!showFullTime)}
            >
              {message.content && (
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
              )}

              {/* Render attachments if any */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2">
                  {message.attachments.map(attachment => renderAttachment(attachment))}
                </div>
              )}
              
              {/* Message reactions placeholder */}
              <div className="flex items-center mt-2 space-x-1">
                <button className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20 rounded-full px-2 py-1">
                  😊
                </button>
                <button className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20 rounded-full px-2 py-1">
                  ❤️
                </button>
                <button className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20 rounded-full px-2 py-1">
                  👍
                </button>
              </div>
            </div>
            
            <div
              className={`text-xs mt-1 text-muted-foreground flex items-center space-x-1 ${
                isOutgoing ? "justify-end" : ""
              }`}
            >
              {isOutgoing && (
                <>
                  {message.status === MessageStatus.READ ? (
                    <CheckCheck className="w-3 h-3 text-blue-500" />
                  ) : message.status === MessageStatus.DELIVERED ? (
                    <CheckCheck className="w-3 h-3 text-gray-400" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                </>
              )}
              <span title={fullTime} className="hover:text-foreground cursor-pointer">
                {showFullTime ? fullTime : formattedTime}
              </span>
            </div>
          </div>
          
          {isOutgoing && (
            <div className="flex-shrink-0 ml-2 mb-1">
              <UserAvatar user={sender} size="sm" />
            </div>
          )}
          
          {/* Message actions */}
          {showActions && (
            <div className={`absolute ${isOutgoing ? 'right-16' : 'left-16'} top-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 flex items-center z-10 border border-gray-200 dark:border-gray-600`}>
              <button 
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Reply"
                onClick={handleReplyMessage}
              >
                <Reply className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Copy text"
                onClick={handleCopyText}
              >
                <Copy className="w-4 h-4" />
              </button>
              {isOutgoing && (
                <button 
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete message"
                  onClick={handleDeleteMessage}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Image preview modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-secondary bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl max-h-full relative">
            <button 
              className="absolute top-2 right-2 p-2 bg-secondary-foreground bg-opacity-50 text-secondary rounded-full hover:bg-opacity-70"
              onClick={() => setImagePreview(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;