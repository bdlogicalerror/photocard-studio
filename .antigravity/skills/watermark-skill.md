# Skill: Robust Image Verification
## Technique: DCT (Discrete Cosine Transform) Watermarking

### Implementation Logic
- Use the `invisible-watermark` library in the FastAPI backend.
- **ID Format:** Use a 64-bit integer or a short UUID mapped to the user's `project_id`.
- **Method:** Use 'iva' or 'dct' algorithms for maximum survival against social media compression.

### Verification Flow
1. User uploads an image to `/verify`.
2. Backend runs `WatermarkDecoder`.
3. Extract the ID and query Supabase to see if it matches a generated project.