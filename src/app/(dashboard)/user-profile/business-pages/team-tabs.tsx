import { Business } from "@/utils/types";
import { getTeamMembers } from "./business-data";

interface TeamTabProps {
  business: Business;
}

export default function TeamTab({ business }: TeamTabProps) {
  const teamMembers = getTeamMembers();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Our Team</h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Meet the talented professionals behind {business.name}. Our team brings together 
          expertise across various disciplines to deliver exceptional results.
        </p>
        
        {/* Team members grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-60 overflow-hidden">
                <img 
                  src={member.photo} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground">{member.name}</h3>
                <p className="text-primary text-sm">{member.title}</p>
                <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                <div className="flex space-x-2 mt-3">
                  <button className="p-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-primary/10 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </button>
                  <button className="p-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-primary/10 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                  </button>
                  <button className="p-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-primary/10 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}