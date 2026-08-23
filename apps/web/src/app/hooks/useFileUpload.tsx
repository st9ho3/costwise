/**
 * - Provides a reusable hook for uploading files via the `/v1/uploads` api-client endpoint.
 * - Manages upload state (loading, error) and returns the uploaded file's public URL on success.
 * - Integrates with `useHelpers` to display user notifications for errors.
 * - Exposes both an `uploadFile` function and a `handleFileUpload` wrapper for convenience.
 */
"use client"
import { useState } from 'react';
import useHelpers from './useHelpers';
import { apiBrowser } from '../lib/api';

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { raiseNotification } = useHelpers({ path: null });
  
  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!file) {
        throw new Error('No file selected.');
      }
      const { data, error: apiError } = await apiBrowser.POST('/v1/uploads', {
        params: { query: { filename: file.name } },
        body: file as never,
        bodySerializer: (b) => b as unknown as BodyInit,
      });
      if (apiError || !data?.url) {
        throw new Error(apiError?.error?.message ?? 'Failed to upload file.');
      }
      return data.url;
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