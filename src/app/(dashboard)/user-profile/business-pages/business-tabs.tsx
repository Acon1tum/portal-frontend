interface BusinessTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }
  
  export default function BusinessTabs({ activeTab, setActiveTab }: BusinessTabsProps) {
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "products", label: "Products & Services" },
      { id: "team", label: "Team" },
      { id: "reviews", label: "Reviews" }
    ];
  
    return (
      <div className="pt-20 pb-4 px-8 border-b border-border">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`px-1 py-2 font-medium transition-colors relative ${
                activeTab === tab.id 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }