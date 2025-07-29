import { FC, useState } from "react";
import { MoreHorizontal, Phone, Video, Info, X, FileText, Bell, BellOff, Search, UserPlus } from "lucide-react";
import { User, UserStatus } from "@/utils/types";
import UserAvatar from "./user-avatar";

interface ChatHeaderProps {
  contact: User;
}

const ChatHeader: FC<ChatHeaderProps> = ({ contact }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  
  return (
    <>
      <div className="border-b border-border p-4 bg-background flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <UserAvatar 
            user={contact} 
            size="md" 
            showStatus={true} 
            status={UserStatus.ONLINE} 
          />
          <div className="ml-3">
            <h2 className="font-semibold">{contact.name}</h2>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">
                {contact.role.name} • {contact.email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
            title="Search in conversation"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 ${muted ? 'text-destructive hover:text-destructive/90' : 'text-muted-foreground hover:text-foreground'} rounded-full hover:bg-muted transition`}
            title={muted ? "Unmute notifications" : "Mute notifications"}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
            title="Contact information"
            onClick={() => setInfoOpen(!infoOpen)}
          >
            <Info className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
            title="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Contact information sidebar */}
      {infoOpen && (
        <div className="border-l border-border bg-card w-80 absolute right-0 top-0 h-full z-20 shadow-lg overflow-y-auto">
          <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              onClick={() => setInfoOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Contact profile */}
            <div className="flex flex-col items-center mb-6">
              <UserAvatar 
                user={contact} 
                size="lg" 
                showStatus={true} 
                status={UserStatus.ONLINE} 
              />
              <h3 className="mt-4 font-semibold text-lg">{contact.name}</h3>
              <p className="text-gray-500 text-sm">{contact.role.name}</p>
            </div>
            
            {/* Contact details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Details</h4>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Email:</span>
                    <span className="text-card-foreground">{contact.email}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24 flex-shrink-0">User ID:</span>
                    <span className="text-card-foreground">{contact.id}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Role:</span>
                    <span className="text-card-foreground">{contact.role.name}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Sex:</span>
                    <span className="text-card-foreground">{contact.sex}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Permissions</h4>
                <div className="flex flex-wrap">
                  {contact.role.permissions.map((permission) => (
                    <span 
                      key={permission.id} 
                      className="inline-block bg-accent text-accent-foreground text-xs px-2 py-1 rounded mr-1 mb-1"
                    >
                      {permission.name.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              {contact.business && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Business Information</h4>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="text-muted-foreground w-24 flex-shrink-0">Name:</span>
                      <span className="text-card-foreground">{contact.business.name}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground w-24 flex-shrink-0">Industry:</span>
                      <span className="text-card-foreground">{contact.business.industry}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground w-24 flex-shrink-0">Location:</span>
                      <span className="text-card-foreground">{contact.business.location}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Actions</h4>
                <div className="space-y-2">
                  <button className="flex items-center text-card-foreground hover:text-primary transition w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    {muted ? "Unmute notifications" : "Mute notifications"}
                  </button>
                  <button className="flex items-center text-card-foreground hover:text-primary transition w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search in conversation
                  </button>
                  <button className="flex items-center text-destructive hover:text-destructive/90 transition w-full">
                    <X className="w-4 h-4 mr-2" />
                    Block contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;