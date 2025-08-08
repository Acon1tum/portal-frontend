import { User, Briefcase, FileText, Star, Settings, MessageSquare } from "lucide-react";

interface UserTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function UserTabs({ activeTab, setActiveTab }: UserTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "posts", label: "Posts", icon: FileText },
  ];

  return (
    <div className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 pt-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
