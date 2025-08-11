import { FC } from "react";
import { MessageSquare } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  userType?: string;
}

interface EmptyStateProps {
  contact?: Contact | null;
  type: "no-contact" | "no-messages";
}

const EmptyState: FC<EmptyStateProps> = ({ contact, type }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-secondary text-muted-foreground p-4">
      <div className="max-w-md text-center">
        {type === "no-contact" ? (
          <>
            <div className="bg-accent rounded-full p-4 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Select a contact to start chatting
            </h3>
            <p className="text-muted-foreground">
              Choose a contact from the list to start a new conversation or continue an existing one.
            </p>
          </>
        ) : (
          <>
            <div className="bg-accent rounded-full p-4 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No messages yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start the conversation with {contact?.name}. Say hello or ask a question!
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmptyState;