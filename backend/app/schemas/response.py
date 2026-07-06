from pydantic import BaseModel
from typing import List, Optional

class PreprocessingSchema(BaseModel):
    grayscale: str
    gaussianBlur: str

class SegmentationSchema(BaseModel):
    threshold: str
    adaptiveThreshold: str
    otsu: str
    regionGrowing: str
    watershed: str
    kmeans: str

class MetricItem(BaseModel):
    algorithm: str
    executionTimeMs: float
    iou: Optional[float] = None
    dice: Optional[float] = None
    notes: str

class AnalysisSchema(BaseModel):
    bestAlgorithm: str
    reason: str
    strengths: List[str]
    weaknesses: List[str]
    executionSummary: str
    conclusion: str

class SegmentationData(BaseModel):
    original: str
    preprocessing: PreprocessingSchema
    segmentation: SegmentationSchema
    metrics: List[MetricItem]
    analysis: AnalysisSchema

class SegmentationResponse(BaseModel):
    success: bool = True
    data: SegmentationData
