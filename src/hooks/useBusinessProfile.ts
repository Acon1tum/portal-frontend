import { useState, useEffect } from 'react';
import { Business } from '@/utils/types';
import { fetchBusinessById } from '@/service/businessService';

interface UseBusinessProfileReturn {
  business: Business | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBusinessProfile = (id: string): UseBusinessProfileReturn => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    if (!id) {
      setError('Business ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const businessData = await fetchBusinessById(id);
      setBusiness(businessData);
    } catch (err) {
      console.error('Error fetching business:', err);
      setError(err instanceof Error ? err.message : 'Failed to load business profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  return {
    business,
    loading,
    error,
    refetch: fetchBusiness,
  };
}; 