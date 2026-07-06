export interface PreprocessingSchema {
  grayscale: string;
  gaussianBlur: string;
}

export interface SegmentationSchema {
  threshold: string;
  adaptiveThreshold: string;
  otsu: string;
  regionGrowing: string;
  watershed: string;
  kmeans: string;
}

export interface MetricItem {
  algorithm: string;
  executionTimeMs: number;
  iou: number | null;
  dice: number | null;
  notes: string;
}

export interface AnalysisSchema {
  bestAlgorithm: string;
  reason: string;
  strengths: string[];
  weaknesses: string[];
  executionSummary: string;
  conclusion: string;
}

export interface SegmentationData {
  original: string;
  preprocessing: PreprocessingSchema;
  segmentation: SegmentationSchema;
  metrics: MetricItem[];
  analysis: AnalysisSchema;
}

export interface SegmentationResponse {
  success: boolean;
  data: SegmentationData;
  error?: {
    code: string;
    message: string;
  };
}
