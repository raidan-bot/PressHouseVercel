import { api } from './api';

export interface MediaAsset {
  id: string | number;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt?: string;
}

/**
 * Handle secure file upload directly via S3 router on backend
 */
export const uploadFile = async (file: File, uploadedBy: string = 'admin'): Promise<MediaAsset> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', uploadedBy);

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Retrieves all registered media from database library
 */
export const fetchMedia = async (): Promise<MediaAsset[]> => {
  const response = await api.get('/api/media');
  return response.data;
};

/**
 * Deletes a registered media item
 */
export const deleteMedia = async (id: string | number): Promise<void> => {
  await api.delete(`/api/media/${id}`);
};
