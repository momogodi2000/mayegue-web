import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
  updateMetadata,
  list,
  listAll,
  StorageReference,
  FullMetadata,
  UploadMetadata,
} from 'firebase/storage';
import { storage } from '@/core/config/firebase.config';

export interface FileUploadOptions {
  metadata?: UploadMetadata;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onComplete?: (downloadURL: string) => void;
}

export interface FileInfo {
  name: string;
  fullPath: string;
  size: number;
  downloadURL: string;
  contentType?: string;
  timeCreated: string;
  updated: string;
  customMetadata?: Record<string, string>;
}

export class StorageService {
  // Legacy method for backward compatibility
  async uploadFile(path: string, file: File | Blob): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return this.getFileURL(path);
  }

  // Legacy method for backward compatibility
  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }

  // Legacy method for backward compatibility
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  /**
   * Enhanced upload file with options
   */
  async uploadFileWithOptions(
    filePath: string,
    file: File | Blob,
    options?: FileUploadOptions
  ): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      
      if (options?.onProgress || options?.onError || options?.onComplete) {
        // Use resumable upload for progress tracking
        return this.uploadFileWithProgress(storageRef, file, options);
      }

      // Simple upload for small files
      const snapshot = await uploadBytes(storageRef, file, options?.metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Upload file with progress tracking
   */
  private async uploadFileWithProgress(
    storageRef: StorageReference,
    file: File | Blob,
    options: FileUploadOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file, options.metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          options.onProgress?.(progress);
        },
        (error) => {
          // Error handling
          console.error('Upload error:', error);
          options.onError?.(error);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            options.onComplete?.(downloadURL);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Array<{ file: File | Blob; path: string; options?: FileUploadOptions }>
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(({ file, path, options }) =>
        this.uploadFileWithOptions(path, file, options)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw new Error(`Failed to upload files: ${error}`);
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    try {
      const deletePromises = filePaths.map(path => this.deleteFile(path));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw new Error(`Failed to delete files: ${error}`);
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string): Promise<FullMetadata> {
    try {
      const storageRef = ref(storage, filePath);
      return await getMetadata(storageRef);
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error(`Failed to get file metadata: ${error}`);
    }
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(
    filePath: string,
    metadata: Partial<UploadMetadata>
  ): Promise<FullMetadata> {
    try {
      const storageRef = ref(storage, filePath);
      return await updateMetadata(storageRef, metadata);
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw new Error(`Failed to update file metadata: ${error}`);
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(
    directoryPath: string,
    maxResults?: number
  ): Promise<FileInfo[]> {
    try {
      const storageRef = ref(storage, directoryPath);
      const listResult = maxResults 
        ? await list(storageRef, { maxResults })
        : await listAll(storageRef);

      const fileInfoPromises = listResult.items.map(async (itemRef) => {
        const [metadata, downloadURL] = await Promise.all([
          getMetadata(itemRef),
          getDownloadURL(itemRef)
        ]);

        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          size: metadata.size,
          downloadURL,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
          customMetadata: metadata.customMetadata,
        } as FileInfo;
      });

      return await Promise.all(fileInfoPromises);
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const storageRef = ref(storage, filePath);
      await getMetadata(storageRef);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file size
   */
  async getFileSize(filePath: string): Promise<number> {
    try {
      const metadata = await this.getFileMetadata(filePath);
      return metadata.size;
    } catch (error) {
      console.error('Error getting file size:', error);
      throw new Error(`Failed to get file size: ${error}`);
    }
  }

  /**
   * Upload image with compression and resizing (client-side)
   */
  async uploadImage(
    filePath: string,
    imageFile: File,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      metadata?: UploadMetadata;
      onProgress?: (progress: number) => void;
    }
  ): Promise<string> {
    try {
      const processedFile = await this.processImage(imageFile, {
        maxWidth: options?.maxWidth || 1920,
        maxHeight: options?.maxHeight || 1080,
        quality: options?.quality || 0.8,
      });

      return await this.uploadFileWithOptions(filePath, processedFile, {
        metadata: {
          contentType: 'image/jpeg',
          ...options?.metadata,
        },
        onProgress: options?.onProgress,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error}`);
    }
  }

  /**
   * Process image (resize and compress)
   */
  private async processImage(
    file: File,
    options: {
      maxWidth: number;
      maxHeight: number;
      quality: number;
    }
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const { maxWidth, maxHeight } = options;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to process image'));
            }
          },
          'image/jpeg',
          options.quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate a unique file path
   */
  generateUniqueFilePath(
    directory: string,
    fileName: string,
    userId?: string
  ): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = fileName.split('.').pop();
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    
    const uniqueName = `${nameWithoutExt}_${timestamp}_${randomId}.${fileExtension}`;
    
    if (userId) {
      return `${directory}/${userId}/${uniqueName}`;
    }
    
    return `${directory}/${uniqueName}`;
  }

  /**
   * Upload user avatar
   */
  async uploadUserAvatar(
    userId: string,
    avatarFile: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const filePath = this.generateUniqueFilePath('avatars', avatarFile.name, userId);
    
    return await this.uploadImage(filePath, avatarFile, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.8,
      metadata: {
        customMetadata: {
          userId,
          type: 'avatar',
        },
      },
      onProgress,
    });
  }

  /**
   * Upload lesson media (audio/video)
   */
  async uploadLessonMedia(
    lessonId: string,
    mediaFile: File,
    mediaType: 'audio' | 'video',
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const filePath = this.generateUniqueFilePath(
      `lessons/${lessonId}/${mediaType}`,
      mediaFile.name
    );

    return await this.uploadFileWithOptions(filePath, mediaFile, {
      metadata: {
        customMetadata: {
          lessonId,
          mediaType,
        },
      },
      onProgress,
    });
  }

  /**
   * Upload dictionary audio
   */
  async uploadDictionaryAudio(
    wordId: string,
    audioFile: File,
    language: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const filePath = this.generateUniqueFilePath(
      `dictionary/${language}/audio`,
      audioFile.name
    );

    return await this.uploadFileWithOptions(filePath, audioFile, {
      metadata: {
        contentType: 'audio/mpeg',
        customMetadata: {
          wordId,
          language,
          type: 'pronunciation',
        },
      },
      onProgress,
    });
  }
}

export const storageService = new StorageService();


