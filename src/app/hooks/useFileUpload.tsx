/**
 * - Provides a reusable hook for uploading files to Vercel Blob storage via a `/api/upload` endpoint.
 * - Manages upload state (loading, error) and returns the uploaded file’s public URL on success.
 * - Integrates with `useHelpers` to display user notifications for errors.
 * - Exposes both an `uploadFile` function and a `handleFileUpload` wrapper for convenience.
 */
"use client"
import { useState } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import useHelpers from './useHelpers';
export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { raiseNotification } = useHelpers({path: null});
  
  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!file) {
        throw new Error('No file selected.');
      }
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }
      const newBlob = (await response.json()) as PutBlobResult;
      return newBlob.url;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileUpload = async (file: File) => {
    if (file) {
      try {
        const url = await uploadFile(file);
        return url;
      } catch (err) {
        raiseNotification({
          success: false,
          message: 'An unexpected error occurred.',
          error: { message: `${err}` },
        });
      }
    }
  };
  return {
    uploadFile,
    isLoading,
    error,
    handleFileUpload,
  };
};