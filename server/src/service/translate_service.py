import io
import logging
import uuid

import cv2 as cv
import numpy as np
import pytesseract
from PIL import Image, ImageDraw, ImageFont
from fastapi import Depends
from googletrans import Translator
from langdetect import detect

from src.models.image_model import ImageStatus
from src.repository import ImageRepository
from src.schemas import TranslateImageRequest

logger = logging.getLogger(__name__)


class TranslateService:
    def __init__(
            self,
            image_repository: ImageRepository = Depends(ImageRepository),
    ):
        self.image_repository = image_repository

    def extract_text(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)

        gray_image = cv.cvtColor(image_np, cv.COLOR_BGR2GRAY)

        threshold_img = cv.threshold(gray_image, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)[1]

        text = pytesseract.image_to_string(threshold_img)
        return text

    def detect_language(self, text):
        try:
            language = detect(text)
            return language
        except:
            return 'unknown'

    def translate_text(self, text, src_lang, target_language):
        translator = Translator()
        translated = translator.translate(text, src=src_lang, dest=target_language)
        return translated.text

    async def translate_image(self, image_data: bytes, request_data: TranslateImageRequest) -> bytes:
        text = self.extract_text(image_data)
        src_lang = self.detect_language(text)
        translated_text = self.translate_text(text, src_lang, request_data.target_language)
        final_image = self.overlay_text_on_image(image_data, translated_text)

        saved_path = f"path/to/saved/{uuid.uuid4()}"
        image = Image.open(io.BytesIO(final_image))
        image.save(saved_path, format='PNG')

        await self.image_repository.create(
            path=saved_path,
            name=request_data.name,
            description=request_data.description,
            source_language=src_lang,
            target_language=request_data.target_language,
            status=ImageStatus.TRANSLATED
        )

        return final_image

    def overlay_text_on_image(self, image_bytes, text):
        image = Image.open(io.BytesIO(image_bytes))
        draw = ImageDraw.Draw(image)
        font = ImageFont.load_default()
        text_width, text_height = draw.textsize(text, font)

        width, height = image.size
        x = (width - text_width) / 2
        y = (height - text_height) / 2
        draw.text((x, y), text, font=font, fill=(255, 255, 255))

        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        return img_byte_arr
