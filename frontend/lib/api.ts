import { SegmentationResponse } from "../types/api";

export async function segmentImage(file: File): Promise<SegmentationResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || "/api";
  const response = await fetch(`${apiBase}/segment`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorDetail;
    try {
      errorDetail = await response.json();
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (errorDetail && errorDetail.detail) {
      if (typeof errorDetail.detail === "string") {
        throw new Error(errorDetail.detail);
      }
      if (errorDetail.detail.message) {
        throw new Error(errorDetail.detail.message);
      }
    }
    
    if (errorDetail && errorDetail.error && errorDetail.error.message) {
      throw new Error(errorDetail.error.message);
    }

    throw new Error("Failed to process image on server.");
  }

  const result: SegmentationResponse = await response.json();
  if (!result.success) {
    throw new Error(result.error?.message || "Segmentation request failed.");
  }

  return result;
}
