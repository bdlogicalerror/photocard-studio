from PIL import Image, ImageDraw, ImageFont
from utils.logging import logger

class BrandingService:
    def __init__(self):
        self.branding_text = "ai.newscards.xyz"

    def apply_guest_branding(self, pil_image: Image.Image) -> Image.Image:
        """
        Adds a professional embossed branding for guest users.
        Visible but premium.
        """
        try:
            logger.info("🎨 Refining embossed branding visibility")
            
            # Convert base image to RGBA
            base = pil_image.convert("RGBA")
            width, height = base.size
            
            # 1. Create a transparent layer
            txt_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(txt_layer)
            
            # 2. Font setup - slightly larger (20px) for better visibility
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
            except:
                font = ImageFont.load_default()

            text = self.branding_text
            
            # 3. Precise size calculation
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            # Position: Middle Right with 40px margin
            text_x = width - text_width - 40
            text_y = (height // 2) - (text_height // 2)
            
            # 4. Draw Embossed Effect with improved contrast
            # - Stroke (Border): More defined (Alpha 120)
            # - Fill (Body): Clearly visible but transparent (Alpha 60)
            draw.text(
                (text_x, text_y), 
                text, 
                font=font, 
                fill=(255, 255, 255, 60), 
                stroke_width=1, 
                stroke_fill=(0, 0, 0, 120) 
            )
            
            # 5. Composite
            out = Image.alpha_composite(base, txt_layer)
            
            return out.convert("RGB")
        except Exception as e:
            logger.error(f"Branding error: {e}")
            return pil_image

branding_service = BrandingService()
