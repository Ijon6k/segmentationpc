import time
from fastapi import APIRouter, File, UploadFile, HTTPException, status
from app.utils.validator import validate_image_upload
from app.utils.image_encoder import encode_image_to_base64
from app.services.image_service import ImageService
from app.services.preprocessing_service import PreprocessingService
from app.services.segmentation.threshold import ThresholdService
from app.services.segmentation.advanced import AdvancedService
from app.services.analysis_service import AnalysisService
from app.schemas.response import SegmentationResponse, SegmentationData, PreprocessingSchema, SegmentationSchema, MetricItem, AnalysisSchema

router = APIRouter()

@router.post("/segment", response_model=SegmentationResponse)
async def segment_image(image: UploadFile = File(...)):
    validate_image_upload(image)
    
    try:
        decoded_image = await ImageService.decode_image(image)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_IMAGE", "message": str(e)}
        )
        
    # Run Preprocessing
    preprocessed = PreprocessingService.process(decoded_image)
    blurred_gray = preprocessed["gaussian_blur"]
    resized_orig = preprocessed["original"]
    
    # 1. Global Thresholding
    start_global = time.perf_counter()
    global_mask = ThresholdService.global_threshold(blurred_gray)
    time_global = (time.perf_counter() - start_global) * 1000
    
    # 2. Adaptive Thresholding
    start_adaptive = time.perf_counter()
    adaptive_mask = ThresholdService.adaptive_threshold(blurred_gray)
    time_adaptive = (time.perf_counter() - start_adaptive) * 1000
    
    # 3. Otsu Thresholding
    start_otsu = time.perf_counter()
    otsu_mask = ThresholdService.otsu_threshold(blurred_gray)
    time_otsu = (time.perf_counter() - start_otsu) * 1000
    
    # 4. Region Growing
    start_rg = time.perf_counter()
    rg_mask = AdvancedService.region_growing(blurred_gray)
    time_rg = (time.perf_counter() - start_rg) * 1000
    
    # 5. Watershed
    start_ws = time.perf_counter()
    ws_mask = AdvancedService.watershed(resized_orig, blurred_gray)
    time_ws = (time.perf_counter() - start_ws) * 1000
    
    # 6. K-Means (K=3)
    start_km = time.perf_counter()
    km_mask = AdvancedService.kmeans_clustering(resized_orig, k=3)
    time_km = (time.perf_counter() - start_km) * 1000
    
    # Encode processed images to Base64
    original_base64 = encode_image_to_base64(resized_orig)
    grayscale_base64 = encode_image_to_base64(preprocessed["grayscale"])
    blur_base64 = encode_image_to_base64(blurred_gray)
    
    global_base64 = encode_image_to_base64(global_mask)
    adaptive_base64 = encode_image_to_base64(adaptive_mask)
    otsu_base64 = encode_image_to_base64(otsu_mask)
    rg_base64 = encode_image_to_base64(rg_mask)
    ws_base64 = encode_image_to_base64(ws_mask)
    km_base64 = encode_image_to_base64(km_mask)
    
    response_data = SegmentationData(
        original=original_base64,
        preprocessing=PreprocessingSchema(
            grayscale=grayscale_base64,
            gaussianBlur=blur_base64
        ),
        segmentation=SegmentationSchema(
            threshold=global_base64,
            adaptiveThreshold=adaptive_base64,
            otsu=otsu_base64,
            regionGrowing=rg_base64,
            watershed=ws_base64,
            kmeans=km_base64
        ),
        metrics=[
            MetricItem(
                algorithm="Threshold",
                executionTimeMs=round(time_global, 3),
                notes="Pambang batas global dengan nilai potong tetap 127."
            ),
            MetricItem(
                algorithm="Adaptive Threshold",
                executionTimeMs=round(time_adaptive, 3),
                notes="Pambang batas lokal menggunakan jendela Gaussian untuk menghitung nilai ambang adaptif."
            ),
            MetricItem(
                algorithm="Otsu",
                executionTimeMs=round(time_otsu, 3),
                notes="Pambang batas otomatis berdasarkan analisis histogram bimodal gambar."
            ),
            MetricItem(
                algorithm="Region Growing",
                executionTimeMs=round(time_rg, 3),
                notes="Pertumbuhan region berbasis benih dari pusat gambar dengan ambang selisih intensitas 20."
            ),
            MetricItem(
                algorithm="Watershed",
                executionTimeMs=round(time_ws, 3),
                notes="Segmentasi berbasis morfologi watershed dengan penanda otomatis dari distance transform."
            ),
            MetricItem(
                algorithm="K-Means",
                executionTimeMs=round(time_km, 3),
                notes="Klasterisasi piksel ruang warna menjadi K=3 kelompok (segmen) warna."
            )
        ],
        analysis=AnalysisService.analyze([
            MetricItem(algorithm="Threshold", executionTimeMs=time_global, notes=""),
            MetricItem(algorithm="Adaptive Threshold", executionTimeMs=time_adaptive, notes=""),
            MetricItem(algorithm="Otsu", executionTimeMs=time_otsu, notes=""),
            MetricItem(algorithm="Region Growing", executionTimeMs=time_rg, notes=""),
            MetricItem(algorithm="Watershed", executionTimeMs=time_ws, notes=""),
            MetricItem(algorithm="K-Means", executionTimeMs=time_km, notes="")
        ])
    )
    
    return SegmentationResponse(success=True, data=response_data)
