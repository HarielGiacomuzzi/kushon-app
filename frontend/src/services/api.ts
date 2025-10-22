import { logger } from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Log API configuration on module load
logger.info('API Config', `API Base URL: ${API_BASE_URL}`);
logger.info('API Config', `Environment: ${import.meta.env.MODE}`);

export interface Publisher {
  id: string;
  name: string;
  country?: string;
}

export interface CreateTitleData {
  name: string;
  synopsis?: string;
  author?: string;
  genre?: string;
  publisherId: string;
  volumes: {
    number: number;
    title?: string;
  }[];
}

export interface UpdateTitleData {
  name?: string;
  synopsis?: string;
  author?: string;
  genre?: string;
  publisherId?: string;
  volumes?: { number: number; title: string }[];
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS';
}

export interface TitleResponse {
  id: string;
  name: string;
  synopsis?: string;
  author?: string;
  genre?: string;
  slug: string;
  coverImage?: string;
  status: string;
  publisherId: string;
  createdAt: string;
  updatedAt: string;
  volumes?: VolumeResponse[];
}

export interface VolumeResponse {
  id: string;
  number: number;
  title?: string;
  coverImage?: string;
  titleId: string;
  releaseAt?: string;
  createdAt: string;
  updatedAt: string;
  owned?: boolean;
}

class ApiService {
  private getToken() {
    return localStorage.getItem('token');
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    const startTime = Date.now();

    const token = this.getToken();
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (options.headers) {
      if (Array.isArray(options.headers)) {
      } else {
        headers = { ...headers, ...options.headers as Record<string, string> };
      }
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Log the request
    const requestBody = options.body ? JSON.parse(options.body as string) : undefined;
    logger.apiRequest(method, url, requestBody);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        logger.apiError(method, url, {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Log successful response
      logger.apiResponse(method, url, response.status, duration, data);

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.apiError(method, url, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      throw error;
    }
  }

  async getPublishers(): Promise<{ success: boolean; data: Publisher[] }> {
    return this.fetchApi('/publishers');
  }

  async createPublisher(data: { name: string; country?: string }): Promise<{ success: boolean; data: Publisher }> {
    return this.fetchApi('/publishers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTitles(): Promise<{ success: boolean; data: TitleResponse[] }> {
    return this.fetchApi('/titles');
  }

  async getTitle(id: string): Promise<{ success: boolean; data: TitleResponse }> {
    return this.fetchApi(`/titles/${id}`);
  }

  async createTitle(formData: FormData): Promise<{ success: boolean; data: TitleResponse }> {
    const url = `${API_BASE_URL}/titles`;
    const method = 'POST';
    const startTime = Date.now();
    const token = this.getToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    logger.apiRequest(method, url, { formData: 'multipart/form-data' });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        logger.apiError(method, url, {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      logger.apiResponse(method, url, response.status, duration, data);

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.apiError(method, url, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      throw error;
    }
  }

  async updateTitle(id: string, data: UpdateTitleData): Promise<{ success: boolean; data: TitleResponse; message?: string }> {
    return this.fetchApi(`/titles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateTitleWithImages(id: string, formData: FormData): Promise<{ success: boolean; data: TitleResponse; message?: string }> {
    const url = `${API_BASE_URL}/titles/${id}`;
    const method = 'PUT';
    const startTime = Date.now();
    const token = this.getToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    logger.apiRequest(method, url, { formData: 'multipart/form-data' });

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        logger.apiError(method, url, {
          status: response.status,
          statusText: response.statusText,
          duration: `${duration}ms`
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      logger.apiResponse(method, url, response.status, duration, data);

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.apiError(method, url, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`
      });
      throw error;
    }
  }

  async deleteTitle(id: string): Promise<{ success: boolean; message?: string }> {
    return this.fetchApi(`/titles/${id}`, {
      method: 'DELETE',
    });
  }

  async getTitleVolumes(titleId: string): Promise<{ success: boolean; data: VolumeResponse[] }> {
    return this.fetchApi(`/titles/${titleId}/volumes`);
  }

  async getUserVolumeProgress(titleId: string): Promise<{ success: boolean; data: { volumeId: string; owned: boolean }[] }> {
    return this.fetchApi(`/user/titles/${titleId}/volumes`);
  }

  async updateUserVolumeProgress(titleId: string, volumeData: { volumeId: string; owned: boolean }[]): Promise<{ success: boolean; message?: string }> {
    return this.fetchApi(`/user/titles/${titleId}/volumes`, {
      method: 'PUT',
      body: JSON.stringify({ volumes: volumeData }),
    });
  }

  async getNotificationPreference(titleId: string): Promise<{ success: boolean; data: { emailOnNewVolume: boolean } }> {
    return this.fetchApi(`/user/titles/${titleId}/notifications`);
  }

  async updateNotificationPreference(titleId: string, emailOnNewVolume: boolean): Promise<{ success: boolean; message?: string }> {
    return this.fetchApi(`/user/titles/${titleId}/notifications`, {
      method: 'PUT',
      body: JSON.stringify({ emailOnNewVolume }),
    });
  }
}

export const apiService = new ApiService();