import { Posting, CreatePostingRequest, UpdatePostingRequest, PostType } from '@/utils/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

class PostingService {
  // Get all postings
  async getPostings(): Promise<Posting[]> {
    const response = await fetch(`${API_URL}/postings`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch postings');
    }

    return response.json();
  }

  // Get posting by ID
  async getPostingById(id: string): Promise<Posting> {
    const response = await fetch(`${API_URL}/postings/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posting');
    }

    return response.json();
  }

  // Get postings by organization
  async getPostingsByOrganization(organizationId: string): Promise<Posting[]> {
    const response = await fetch(`${API_URL}/postings/organization/${organizationId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch organization postings');
    }

    return response.json();
  }

  // Get postings by type
  async getPostingsByType(postType: PostType): Promise<Posting[]> {
    const response = await fetch(`${API_URL}/postings/type/${postType}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch postings by type');
    }

    return response.json();
  }

  // Create new posting
  async createPosting(data: CreatePostingRequest): Promise<Posting> {
    const response = await fetch(`${API_URL}/postings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Create posting error:', errorData);
      throw new Error(errorData.error || 'Failed to create posting');
    }

    return response.json();
  }

  // Update posting
  async updatePosting(id: string, data: UpdatePostingRequest): Promise<Posting> {
    const response = await fetch(`${API_URL}/postings/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update posting');
    }

    return response.json();
  }

  // Delete posting
  async deletePosting(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/postings/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete posting');
    }
  }

  // Toggle publishing status
  async togglePublish(id: string): Promise<Posting> {
    const response = await fetch(`${API_URL}/postings/toggle-publish/${id}`, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle publishing status');
    }

    return response.json();
  }

  // Add attachment to posting
  async addAttachment(postingId: string, attachmentData: {
    url: string;
    fileName?: string;
    fileType?: string;
    size?: number;
  }): Promise<{
    id: string;
    url: string;
    fileName?: string;
    fileType?: string;
    size?: number;
    uploadedAt: string;
    postingId: string;
  }> {
    const response = await fetch(`${API_URL}/postings/${postingId}/attachments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(attachmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to add attachment');
    }

    return response.json();
  }

  // Delete attachment
  async deleteAttachment(attachmentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/postings/attachments/${attachmentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete attachment');
    }
  }
}

export const postingService = new PostingService(); 