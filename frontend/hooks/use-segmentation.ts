import { useState, useCallback } from "react";
import { segmentImage } from "../lib/api";
import { SegmentationData } from "../types/api";

export function useSegmentation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SegmentationData | null>(null);

  const triggerSegmentation = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await segmentImage(file);
      setResult(response.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    triggerSegmentation,
    reset,
  };
}
