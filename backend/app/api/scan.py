from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.ocr import DummyOCRService

router = APIRouter()

ocr_service = DummyOCRService()


@router.post("/scan")
async def scan_label(image: UploadFile = File(...)) -> dict:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルを選択してください。")

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="空のファイルはアップロードできません。")

    extracted_text = ocr_service.extract_text(image_bytes)

    return {
        "filename": image.filename,
        "ocr_text": extracted_text,
        "candidates": [
            {"name": "The Glenlivet 12", "score": 0.91},
            {"name": "Glenfiddich 12", "score": 0.86},
            {"name": "Bowmore 12", "score": 0.74},
        ],
    }
