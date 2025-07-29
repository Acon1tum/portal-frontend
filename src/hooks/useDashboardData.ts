import { useState, useEffect } from 'react';
import { Business, TaglineCategory } from '@/utils/types';
import { fetchBusinesses, fetchTaglineCategories } from '@/service/businessService';
import { fetchRecentActivities, RecentActivity } from '@/service/activityService';

interface DashboardData {
  businesses: Business[];
  categories: TaglineCategory[];
  activities: RecentActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): DashboardData => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<TaglineCategory[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [businessesData, categoriesData, activitiesData] = await Promise.allSettled([
        fetchBusinesses(),
        fetchTaglineCategories(),
        fetchRecentActivities(),
      ]);

      // Handle businesses
      if (businessesData.status === 'fulfilled') {
        setBusinesses(businessesData.value);
      } else {
        console.error('Failed to fetch businesses:', businessesData.reason);
        setError('Failed to load businesses');
      }

      // Handle categories
      if (categoriesData.status === 'fulfilled') {
        setCategories(categoriesData.value);
      } else {
        console.error('Failed to fetch categories:', categoriesData.reason);
        setError('Failed to load categories');
      }

      // Handle activities
      if (activitiesData.status === 'fulfilled') {
        setActivities(activitiesData.value);
      } else {
        console.error('Failed to fetch activities:', activitiesData.reason);
        // Don't set error for activities as it's optional
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    businesses,
    categories,
    activities,
    loading,
    error,
    refetch: fetchData,
  };
}; 