from typing import Protocol


class OCRService(Protocol):
    def extract_text(self, image_bytes: bytes) -> str:
        ...


class DummyOCRService:
    def extract_text(self, image_bytes: bytes) -> str:
        _ = image_bytes
        return ""
