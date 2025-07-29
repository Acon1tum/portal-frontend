import { FC, useState } from "react";
import { User, UserStatus, AttachmentType } from "@/utils/types";
import { formatDistanceToNow, format } from "date-fns";
import { Check, CheckCheck, Trash2, Reply, Copy, MoreHorizontal, Image, FileText, X } from "lucide-react";
import UserAvatar from "./user-avatar";

interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size: number;
}

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
    isRead?: boolean;
    attachments?: Attachment[];
  };
  isOutgoing: boolean;
  sender: User | null;
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
  
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });
  
  const fullTime = format(new Date(message.timestamp), 'PPpp');
  
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
  
  const renderAttachment = (attachment: Attachment) => {
    switch (attachment.type) {
      case AttachmentType.IMAGE:
        return (
          <div 
            key={attachment.id}
            className="mt-2 relative cursor-pointer"
            onClick={() => setImagePreview(attachment.url)}
          >
            <div className="rounded-lg overflow-hidden max-w-xs max-h-60">
              <img 
                src={attachment.url} 
                alt={attachment.name} 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        );
      case AttachmentType.FILE:
      case AttachmentType.AUDIO:
      case AttachmentType.VIDEO:
        return (
          <div 
            key={attachment.id}
            className="mt-2 bg-muted rounded-lg p-3 flex items-center max-w-xs"
          >
            <div className="mr-3">
              {attachment.type === AttachmentType.FILE && <FileText className="w-6 h-6 text-gray-500" />}
              {attachment.type === AttachmentType.AUDIO && <Image className="w-6 h-6 text-gray-500" />}
              {attachment.type === AttachmentType.VIDEO && <Image className="w-6 h-6 text-gray-500" />}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-gray-500">
                {(attachment.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <div
        className={`flex ${
          isOutgoing ? "justify-end" : "justify-start"
        } mb-4 group relative`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex max-w-md">
          {!isOutgoing && (
            <div className="flex-shrink-0 mr-3">
              <UserAvatar 
                user={sender} 
                showStatus={true} 
                status={sender?.id === '1' ? UserStatus.ONLINE : UserStatus.OFFLINE} 
              />
            </div>
          )}
          <div className="flex flex-col">
            <div
              className={`rounded-lg px-4 py-2 shadow-sm ${
                isOutgoing
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
              onClick={() => setShowFullTime(!showFullTime)}
            >
              {message.content && (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}

              
              {/* Render attachments if any */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2">
                  {message.attachments.map(attachment => renderAttachment(attachment))}
                </div>
              )}
            </div>
            
            <div
              className={`text-xs mt-1 text-muted-foreground flex items-center ${
                isOutgoing ? "justify-end" : ""
              }`}
            >
              {isOutgoing && (
                <>
                  {message.isRead ? (
                    <CheckCheck className="w-3 h-3 mr-1 text-blue-500" />
                  ) : (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                </>
              )}
              <span title={fullTime}>
                {showFullTime ? fullTime : formattedTime}
              </span>
            </div>
          </div>
          
          {isOutgoing && (
            <div className="flex-shrink-0 ml-3">
              <UserAvatar user={sender} size="sm" />
            </div>
          )}
          
          {/* Message actions */}
          {showActions && (
            <div className={`absolute ${isOutgoing ? 'right-16' : 'left-16'} top-0 bg-popover shadow-md rounded-lg p-1 flex items-center z-10`}>
              <button 
                className="p-1 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                title="Reply"
                onClick={handleReplyMessage}
              >
                <Reply className="w-4 h-4" />
              </button>
              <button 
                className="p-1 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                title="Copy text"
                onClick={handleCopyText}
              >
                <Copy className="w-4 h-4" />
              </button>
              {isOutgoing && (
                <button 
                  className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded"
                  title="Delete message"
                  onClick={handleDeleteMessage}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button 
                className="p-1 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded"
                title="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
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