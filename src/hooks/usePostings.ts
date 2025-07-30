import { useState, useCallback } from 'react';
import { postingService } from '@/service/postingService';
import { Posting, CreatePostingRequest, UpdatePostingRequest, PostType } from '@/utils/types';

export const usePostings = () => {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all postings
  const fetchPostings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postingService.getPostings();
      setPostings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch postings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch postings by organization
  const fetchPostingsByOrganization = useCallback(async (organizationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await postingService.getPostingsByOrganization(organizationId);
      setPostings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization postings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch postings by type
  const fetchPostingsByType = useCallback(async (postType: PostType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await postingService.getPostingsByType(postType);
      setPostings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch postings by type');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new posting
  const createPosting = useCallback(async (data: CreatePostingRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newPosting = await postingService.createPosting(data);
      setPostings(prev => [newPosting, ...prev]);
      return newPosting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create posting');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update posting
  const updatePosting = useCallback(async (id: string, data: UpdatePostingRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPosting = await postingService.updatePosting(id, data);
      setPostings(prev => prev.map(posting => 
        posting.id === id ? updatedPosting : posting
      ));
      return updatedPosting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update posting');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete posting
  const deletePosting = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await postingService.deletePosting(id);
      setPostings(prev => prev.filter(posting => posting.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete posting');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle publishing status
  const togglePublish = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPosting = await postingService.togglePublish(id);
      setPostings(prev => prev.map(posting => 
        posting.id === id ? updatedPosting : posting
      ));
      return updatedPosting;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle publishing status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add attachment to posting
  const addAttachment = useCallback(async (postingId: string, attachmentData: {
    url: string;
    fileName?: string;
    fileType?: string;
    size?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const attachment = await postingService.addAttachment(postingId, attachmentData);
      // Update the posting with the new attachment
      setPostings(prev => prev.map(posting => 
        posting.id === postingId 
          ? { ...posting, attachments: [...posting.attachments, attachment] }
          : posting
      ));
      return attachment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add attachment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete attachment
  const deleteAttachment = useCallback(async (attachmentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await postingService.deleteAttachment(attachmentId);
      // Remove the attachment from all postings
      setPostings(prev => prev.map(posting => ({
        ...posting,
        attachments: posting.attachments.filter(att => att.id !== attachmentId)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete attachment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    postings,
    loading,
    error,
    fetchPostings,
    fetchPostingsByOrganization,
    fetchPostingsByType,
    createPosting,
    updatePosting,
    deletePosting,
    togglePublish,
    addAttachment,
    deleteAttachment,
  };
}; 