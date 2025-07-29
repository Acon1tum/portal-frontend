// src/components/BusinessList.tsx
import { Business } from "@/utils/types";

interface BusinessListProps {
  businesses: Business[];
}

const BusinessList = ({ businesses }: BusinessListProps) => {
  return (
    <div>
      {businesses.map((b) => (
        <div key={b.id}>
          <h2>{b.name}</h2>
          <p>{b.industry}</p>
        </div>
      ))}
    </div>
  );
};

export default BusinessList;
