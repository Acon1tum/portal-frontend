import { useState } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  userType?: string;
}

interface ContactListProps {
  contacts: Contact[];
  currentUser: Contact | null;
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onSearchUsers?: (query: string) => Promise<Contact[]>;
  onStartNewConversation?: (user: Contact) => void;
}

export default function ContactList({
  contacts,
  currentUser,
  selectedContact,
  onSelectContact,
  onSearchUsers,
  onStartNewConversation
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim() || !onSearchUsers) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await onSearchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartNewConversation = (user: Contact) => {
    if (onStartNewConversation) {
      onStartNewConversation(user);
    }
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with search toggle */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">Contacts</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search input */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {/* Search results */}
      {showSearch && searchResults.length > 0 && (
        <div className="border-b border-border">
          <div className="p-2 text-xs font-medium text-muted-foreground">
            Search Results
          </div>
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-3 hover:bg-muted cursor-pointer"
              onClick={() => handleStartNewConversation(user)}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading state for search */}
      {showSearch && isSearching && (
        <div className="p-4 text-center">
          <div className="text-sm text-muted-foreground">Searching...</div>
        </div>
      )}

      {/* No search results */}
      {showSearch && searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="p-4 text-center">
          <div className="text-sm text-muted-foreground">No users found</div>
        </div>
      )}

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-sm text-muted-foreground">
              {showSearch ? 'Search for users to start a conversation' : 'No conversations yet'}
            </div>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 hover:bg-muted cursor-pointer ${
                selectedContact?.id === contact.id ? 'bg-muted' : ''
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {contact.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {contact.email}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}