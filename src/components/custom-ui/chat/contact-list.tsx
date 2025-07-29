import { FC, useState } from "react";
import { Search } from "lucide-react";
import { User, UserStatus } from "@/utils/types";
import UserAvatar from "./user-avatar";
interface ContactsListProps {
  contacts: User[];
  currentUser: User | null;
  selectedContact: User | null;
  onSelectContact: (contact: User) => void;
}

const ContactsList: FC<ContactsListProps> = ({
  contacts,
  currentUser,
  selectedContact,
  onSelectContact,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter out the current user from contacts and apply search
  const filteredContacts = contacts.filter(
    (contact) => 
      contact.id !== currentUser?.id && 
      (searchTerm === "" || 
       contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-input rounded-lg bg-muted focus:outline-none focus:ring-primary focus:border-primary text-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-none">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No contacts found matching "{searchTerm}"
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 border-b border-border flex items-center cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedContact?.id === contact.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="relative">
                <UserAvatar 
                  user={contact} 
                  size="lg" 
                  showStatus={true} 
                  status={contact.id === '1' || contact.id === '2' ? UserStatus.ONLINE : UserStatus.OFFLINE} 
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-foreground">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">12:45 PM</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate w-40">
                    {contact.role.name === "Admin" 
                      ? "Admin privileges enabled" 
                      : "Regular user"}
                  </p>
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    2
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactsList;