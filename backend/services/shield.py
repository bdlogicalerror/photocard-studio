import numpy as np
import cv2
from PIL import Image
from imwatermark import WatermarkEncoder, WatermarkDecoder
from utils.logging import logger

class ShieldService:
    def __init__(self):
        # The watermark method 'dwtDct' is robust against compression and sharing
        self.method = 'dwtDct'
        self.watermark_length = 32 # Bits length for the ID

    def embed_shield(self, pil_image: Image.Image, secret_id: str) -> Image.Image:
        """
        Embeds an invisible 32-bit security fingerprint into a PIL image.
        """
        try:
            logger.info(f"🛡️ Embedding authenticity shield for ID: {secret_id}")
            
            # Convert PIL to OpenCV (BGR)
            cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
            
            encoder = WatermarkEncoder()
            # Embed using DWT+DCT
            encoder.set_watermark('bytes', secret_id.encode('utf-8')[:4]) 
            
            wm_image = encoder.encode(cv_image, self.method)
            
            # Convert back to PIL
            return Image.fromarray(cv2.cvtColor(wm_image, cv2.COLOR_BGR2RGB))
        except Exception as e:
            logger.error(f"Authenticity Shield error: {e}", exc_info=True)
            return pil_image

    def extract_shield(self, pil_image: Image.Image) -> str:
        """
        Extracts the invisible 32-bit security fingerprint from an image.
        """
        try:
            logger.info("🔍 Attempting to extract authenticity shield...")
            
            # Convert PIL to OpenCV (BGR)
            cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
            
            decoder = WatermarkDecoder('bytes', 32)
            watermark = decoder.decode(cv_image, self.method)
            
            if watermark:
                # Attempt to decode the bytes back to a string ID
                # We only stored 4 bytes, so we take the first 4
                try:
                    return watermark[:4].decode('utf-8', errors='ignore')
                except:
                    return "valid_shield_id" # Fallback if decoding fails but watermark exists
            return ""
        except Exception as e:
            logger.error(f"Shield extraction error: {e}")
            return ""

shield_service = ShieldService()
