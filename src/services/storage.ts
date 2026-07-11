import { api } from './api';
import { S3Client } from '@aws-sdk/client-s3';

export interface MediaAsset {
  id: string | number;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt?: string;
}

/**
 * Dynamically gets a configured S3 Client based on backend settings
 */
export const getS3Client = async () => {
  try {
    const { data } = await api.get('/api/s3/config');
    
    if (!data.configured) {
      console.warn('S3 cloud storage is not fully configured, utilizing fallback endpoints.');
    }

    return new S3Client({
      region: data.region || 'auto',
      endpoint: 'https://t3.storageapi.dev',
      credentials: {
        accessKeyId: 'tid_sWBvagVxMblDpfpiFmWNqCL_RXaORDvhCDYgPPvdNDqFqJajQT',
        secretAccessKey: 'tsec_ZsMeiviAjXcoHHmfgvwF816nSDRvibtjMlEvG29zsmazLrWWt4mY8iVhCHRPgOOzXymU_V',
      },
    });
  } catch (error) {
    console.error('Failed to initialize S3 client, utilizing default S3 endpoint:', error);
    return new S3Client({
      region: 'auto',
      endpoint: 'https://t3.storageapi.dev',
      credentials: {
        accessKeyId: 'tid_sWBvagVxMblDpfpiFmWNqCL_RXaORDvhCDYgPPvdNDqFqJajQT',
        secretAccessKey: 'tsec_ZsMeiviAjXcoHHmfgvwF816nSDRvibtjMlEvG29zsmazLrWWt4mY8iVhCHRPgOOzXymU_V',
      },
    });
  }
};

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
