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
      
      // Filter out contacts that already exist in the conversations list
      const existingContactIds = new Set(contacts.map(contact => contact.id));
      const filteredResults = results.filter(user => !existingContactIds.has(user.id));
      
      setSearchResults(filteredResults);
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
      {/* Search toggle */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-10 w-10 p-0 rounded-full hover:bg-primary/20 transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
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
          <>
            {/* Info section for existing conversations */}
            <div className="p-3 border-b border-border bg-muted/20">
              <div className="text-[0.625rem] font-medium text-muted-foreground uppercase tracking-wide">
                Existing Conversations
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {contacts.length} conversation{contacts.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Contacts list */}
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-200 border-b border-border/50 ${
                  selectedContact?.id === contact.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center mr-3 ring-2 ring-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute bottom-1 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {contact.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2m
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate mb-1">
                    {contact.email}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    Hey! How are you doing today? 👋
                  </div>
                </div>
                {/* Unread message indicator */}
                <div className="ml-2">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-semibold">2</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}