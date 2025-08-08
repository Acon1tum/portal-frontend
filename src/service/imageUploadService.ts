export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageUploadService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

  // Test method to check if backend is accessible
  static async testBackendConnection(): Promise<boolean> {
    try {
      console.log('Testing backend connection to:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}/test`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend connection successful:', data);
        return true;
      } else {
        console.error('Backend connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      return false;
    }
  }

  static async uploadImage(file: File, type: 'profile' | 'cover'): Promise<UploadResponse> {
    try {
      console.log('Starting image processing (client-side only):', { fileName: file.name, type, size: file.size });
      // Convert file to base64 and return directly without any server roundtrip
      const base64 = await this.fileToBase64(file);
      console.log('File converted to base64, length:', base64.length);
      console.log('Base64 data starts with:', base64.substring(0, 50));
      return { success: true, url: base64 };
    } catch (error) {
      console.error('Upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  static async updateUserProfile(userId: string, updates: { profilePicture?: string; coverPhoto?: string }): Promise<UploadResponse> {
    try {
      console.log('Updating user profile:', { userId, updates });
      console.log('Base URL:', this.baseUrl);
      const url = `${this.baseUrl}/users/${userId}`;
      console.log('Full URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed with status:', response.status, 'Error:', errorText);
        throw new Error(`Update failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Profile update successful:', data);
      return { success: true, url: data.profilePicture || data.coverPhoto };
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error details:', {
      });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      };
    }
  }

  static async updateOrganizationProfile(orgId: string, updates: { profilePicture?: string; coverPhoto?: string }): Promise<UploadResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/businesses/${orgId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, url: data.profilePicture || data.coverPhoto };
    } catch (error) {
      console.error('Update error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      };
    }
  }
}
