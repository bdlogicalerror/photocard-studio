import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import requests
from io import BytesIO
import textwrap

class Renderer:
    def __init__(self, templates_path: str = "assets/templates.json"):
        self.canvas_size = (1080, 1080)
        self.assets_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        self.fonts_path = os.path.join(self.assets_path, "fonts")
        # Load templates (simplified for now, ideally shared with frontend)
        # In a real app, this might come from Supabase
        self.templates = [] 

    def _get_font(self, family: str, size: int, weight: str = "bold"):
        # Mapping frontend font families to local .ttf files
        # You'll need to download these fonts to backend/assets/fonts/
        font_map = {
            "bengali": "NotoSerifBengali-Bold.ttf" if weight == "bold" else "NotoSerifBengali-Regular.ttf",
            "sans": "NotoSansBengali-Bold.ttf" if weight == "bold" else "NotoSansBengali-Regular.ttf",
            "display": "PlayfairDisplay-Bold.ttf"
        }
        font_name = font_map.get(family, "NotoSansBengali-Bold.ttf")
        font_path = os.path.join(self.fonts_path, font_name)
        
        if not os.path.exists(font_path):
            # Fallback to a system font if available, or just return a default
            return ImageFont.load_default()
        
        return ImageFont.truetype(font_path, size)

    async def render_card(self, template: dict, card_data: dict) -> Image.Image:
        style = template.get("style", {})
        layout = template.get("layout", "single-top")
        
        # Create canvas
        canvas = Image.new("RGB", self.canvas_size, style.get("backgroundColor", "#ffffff"))
        draw = ImageDraw.Draw(canvas)
        
        # 1. Draw Accent Bar
        accent_color = style.get("accentColor", "#ed1c24")
        accent_height = style.get("accentBarHeight", 10)
        accent_pos = style.get("accentBarPosition", "top")
        
        if accent_pos == "top":
            draw.rectangle([0, 0, 1080, accent_height], fill=accent_color)
        elif accent_pos == "bottom":
            draw.rectangle([0, 1080 - accent_height, 1080, 1080], fill=accent_color)

        # 2. Draw Photo (Assuming single-top for now)
        if layout == "single-top":
            photo_height = int(1080 * 0.55)
            if card_data.get("photos"):
                photo_url = card_data["photos"][0].get("src")
                if photo_url:
                    try:
                        response = requests.get(photo_url)
                        img = Image.open(BytesIO(response.content))
                        
                        # Object-fit: cover logic
                        target_ratio = 1080 / photo_height
                        img_ratio = img.width / img.height
                        
                        if img_ratio > target_ratio:
                            # Img is wider
                            new_width = int(photo_height * img_ratio)
                            img = img.resize((new_width, photo_height), Image.Resampling.LANCZOS)
                            left = (new_width - 1080) // 2
                            img = img.crop((left, 0, left + 1080, photo_height))
                        else:
                            # Img is taller
                            new_height = int(1080 / img_ratio)
                            img = img.resize((1080, new_height), Image.Resampling.LANCZOS)
                            top = (new_height - photo_height) // 2
                            img = img.crop((0, top, 1080, top + photo_height))
                            
                        canvas.paste(img, (0, accent_height if accent_pos == "top" else 0))
                    except Exception as e:
                        print(f"Error loading photo: {e}")

        # 3. Draw Text
        padding = style.get("padding", 50)
        headline = card_data.get("headline", "")
        subheadline = card_data.get("subheadline", "")
        
        h_font = self._get_font(style.get("fontFamily", "bengali"), style.get("headlineFontSize", 64), "bold")
        s_font = self._get_font(style.get("fontFamily", "bengali"), style.get("subheadlineFontSize", 30), "regular")
        
        # Headline
        h_color = style.get("headlineColor", "#222222")
        h_y = int(1080 * 0.55) + padding + (accent_height if accent_pos == "top" else 0)
        
        # Simple wrapping
        wrapped_h = textwrap.fill(headline, width=30) # Rough estimate
        draw.multiline_text((padding, h_y), wrapped_h, font=h_font, fill=h_color, spacing=10)
        
        # 4. Draw Brand Bar
        if style.get("showBrandBar"):
            bar_bg = style.get("brandBarBg", "#f8f8f8")
            bar_color = style.get("brandColor", "#ed1c24")
            draw.rectangle([0, 1080 - 120, 1080, 1080], fill=bar_bg)
            
            brand_name = card_data.get("brandName", "News Cards Studio")
            draw.text((padding, 1080 - 80), brand_name, font=s_font, fill=bar_color)

        return canvas

renderer = Renderer()
