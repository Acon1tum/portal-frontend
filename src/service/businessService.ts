import { Business, TaglineCategory } from '@/utils/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// Transform backend Organization to frontend Business format
const transformOrganizationToBusiness = (org: any): Business => {
  return {
    id: org.id,
    name: org.name,
    domain: org.domain || undefined,
    logo: org.logo || undefined,
    industry: org.industry || undefined,
    description: org.description || undefined,
    location: org.location || undefined,
    phoneNumber: org.phoneNumber || undefined,
    email: org.email || undefined,
    websiteUrl: org.websiteUrl || undefined,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    userId: org.userId || '',
    verificationStatus: org.verificationStatus,
    taglineCategories: org.taglineCategories || [],
  };
};

// Fetch all businesses
export const fetchBusinesses = async (): Promise<Business[]> => {
  try {
    const response = await fetch(`${API_URL}/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include session cookies
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch businesses: ${response.status}`);
    }

    const data = await response.json();
    const organizations = Array.isArray(data) ? data : data.businesses || data;
    
    // Transform each organization to business format
    return organizations.map(transformOrganizationToBusiness);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

// Fetch a single business by ID
export const fetchBusinessById = async (id: string): Promise<Business> => {
  try {
    const response = await fetch(`${API_URL}/businesses/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Business not found');
      }
      throw new Error(`Failed to fetch business: ${response.status}`);
    }

    const data = await response.json();
    const organization = data.business || data;
    
    return transformOrganizationToBusiness(organization);
  } catch (error) {
    console.error('Error fetching business:', error);
    throw error;
  }
};

// Fetch tagline categories
export const fetchTaglineCategories = async (): Promise<TaglineCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/taglines`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tagline categories: ${response.status}`);
    }

    const data = await response.json();
    return data.taglines || data.categories || data; // Handle different response formats
  } catch (error) {
    console.error('Error fetching tagline categories:', error);
    throw error;
  }
};

// Fetch businesses by category
export const fetchBusinessesByCategory = async (categoryId: string): Promise<Business[]> => {
  try {
    const response = await fetch(`${API_URL}/taglines/${categoryId}/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch businesses by category: ${response.status}`);
    }

    const data = await response.json();
    const organizations = data.businesses || data;
    
    return organizations.map(transformOrganizationToBusiness);
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    throw error;
  }
};

// Search businesses
export const searchBusinesses = async (query: string, categoryId?: string): Promise<Business[]> => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoryId && categoryId !== 'all') params.append('category', categoryId);

    const response = await fetch(`${API_URL}/businesses/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to search businesses: ${response.status}`);
    }

    const data = await response.json();
    const organizations = data.businesses || data;
    
    return organizations.map(transformOrganizationToBusiness);
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
}; 