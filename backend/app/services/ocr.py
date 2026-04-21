from typing import Protocol


class OCRService(Protocol):
    def extract_text(self, image_bytes: bytes) -> str:
        ...


class DummyOCRService:
    def extract_text(self, image_bytes: bytes) -> str:
        byte_size = len(image_bytes)
        return f"dummy-ocr-text ({byte_size} bytes)"
