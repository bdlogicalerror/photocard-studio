---
trigger: model_decision
---

# NewsCards Backend & Security Rules
## Focus: Authenticity Shield & Robust Steganography

### 1. Mandatory Security Protocols
- **Atomic Embedding:** No image shall be returned via the `/generate` or `/export` endpoints without first passing through the `ImageVerifier.embed_id` pipeline. 
- **Integrity Enforcement:** The invisible ID must be a hybrid DWT-DCT signature. Never simplify this to metadata (EXIF) or simple LSB steganography, as these fail our "Authenticity Shield" promise.
- **HMAC Verification:** IDs must be generated using an HMAC-SHA256 hash of the Project ID and a server-side secret to prevent spoofing.

### 2. Coding Standards
- **Asynchronous I/O:** Use `async` for all Supabase database queries and storage uploads.
- **CPU Offloading:** Image processing (Pillow/OpenCV/Wavelets) is CPU-bound. Always wrap these calls in `starlette.concurrency.run_in_threadpool` or a standard `ThreadPoolExecutor` to prevent blocking the FastAPI event loop.
- **Error Silencing:** In the event of a watermark extraction failure during verification, return a clear `422 Unprocessable Entity` with a "Invalid or Corrupted NewsCard" message.

### 3. Image Processing Logic
- **Color Space:** Perform all watermarking in the **YUV color space** (Y-channel) to maximize robustness against social media compression while remaining invisible to the human eye.
- **Font Rendering:** Always support UTF-8 and complex script shaping (HarfBuzz/FriBidi) for Bengali font support as per the project requirements.

### 4. Deployment & Performance
- **Docker Pathing:** Adhere to `/mnt/storage/Docker_MBAM1/photo_card_volume` for all persistent storage and volume mounts.
- **M1 Optimization:** Use `python:3.11-slim` to ensure compatibility with native C++ extensions for image processing libraries.