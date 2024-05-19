import io
import logging

import cv2 as cv
import numpy as np
import pytesseract
from PIL import Image, ImageDraw, ImageFont
from googletrans import Translator
from langdetect import detect

logger = logging.getLogger(__name__)

pytesseract.pytesseract.tesseract_cmd = r'D:\Tesseract-OCR\tesseract.exe'


class TranslateManager:
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

    def translate_text(self, text, src_lang, target_lang):
        translator = Translator()
        translated = translator.translate(text, src=src_lang, dest=target_lang)
        return translated.text

        # def overlay_text_on_image(self, image_bytes, text):
        #     image = Image.open(io.BytesIO(image_bytes))
        #     draw = ImageDraw.Draw(image)
        #
        #     # Load the default font or a specific font
        #     font = ImageFont.load_default()
        #
        #     # Determine the size and position of the text on the image
        #     # Calculate bounding box for the text
        #     width, height = image.size
        #     text_bbox = draw.textbbox((0, 0), text, font=font)  # Top-left corner as origin
        #     text_width = text_bbox[2] - text_bbox[0]  # Right x - Left x
        #     text_height = text_bbox[3] - text_bbox[1]  # Lower y - Upper y
        #
        #     # Calculate position to center the text
        #     x = (width - text_width) / 2
        #     y = (height - text_height) / 2
        #
        #     # Draw the text centered on the image
        #     draw.text((x, y), text, font=font, fill=(255, 255, 255))
        #
        #     # Save the image into a byte array for further processing or transmission
        #     img_byte_arr = io.BytesIO()
        #     image.save(img_byte_arr, format='PNG')
        #     return img_byte_arr.getvalue()

    def overlay_text_on_image(self, image_bytes, text, font_path="arial.ttf", initial_font_size=20):
        image = Image.open(io.BytesIO(image_bytes))
        draw = ImageDraw.Draw(image)
        width, height = image.size

        font_size = initial_font_size
        font = ImageFont.truetype(font_path, font_size)

        # Получаем начальные размеры текста
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]

        max_iterations = 100  # Защита от бесконечного цикла
        iterations = 0

        # Постепенно увеличиваем размер шрифта
        while iterations < max_iterations:
            new_text_width = text_bbox[2] - text_bbox[0]
            new_text_height = text_bbox[3] - text_bbox[1]
            if new_text_width >= text_width and new_text_height >= text_height:
                break
            font_size += 1  # Увеличиваем шрифт на 1
            font = ImageFont.truetype(font_path, font_size)
            text_bbox = draw.textbbox((0, 0), text, font=font)
            iterations += 1

        # Позиционирование текста
        x = (width - new_text_width) / 2
        y = (height - new_text_height) / 2

        # Нанесение текста на изображение
        draw.text((x, y), text, font=font, fill="black")

        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        return img_byte_arr.getvalue()
