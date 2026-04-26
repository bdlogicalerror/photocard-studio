import os
from supabase import create_client, Client
from io import BytesIO
from utils.logging import logger

class StorageService:
    def __init__(self):
        self.url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase: Client = None
        
        if self.url and self.key:
            try:
                self.supabase = create_client(self.url, self.key)
                logger.info("Storage service initialized with Supabase")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")

        # Local storage for guests
        self.local_base = "/tmp/photocards"
        os.makedirs(self.local_base, exist_ok=True)

    async def upload_image(self, image_data: BytesIO, filename: str, is_guest: bool = False) -> str:
        if is_guest:
            return await self._save_locally(image_data, filename)
        return await self._upload_to_supabase(image_data, filename)

    async def _save_locally(self, image_data: BytesIO, filename: str) -> str:
        try:
            path = os.path.join(self.local_base, filename)
            with open(path, "wb") as f:
                f.write(image_data.getvalue())
            
            # This URL will be served by FastAPI static mount
            # Using relative path that works with the backend proxy or direct access
            public_url = f"/api/v1/static/{filename}"
            logger.info(f"Saved guest image locally: {path}")
            return public_url
        except Exception as e:
            logger.error(f"Local storage error: {e}", exc_info=True)
            return ""

    async def _upload_to_supabase(self, image_data: BytesIO, filename: str, bucket: str = "photocards") -> str:
        if not self.supabase:
            logger.error("Storage upload failed: Supabase client not initialized")
            return ""
        
        try:
            path = f"generated/{filename}"
            logger.info(f"Uploading file to bucket '{bucket}' at path '{path}'...")
            
            self.supabase.storage.from_(bucket).upload(
                path=path,
                file=image_data.getvalue(),
                file_options={"content-type": "image/png"}
            )
            
            public_url = self.supabase.storage.from_(bucket).get_public_url(path)
            logger.info(f"Generated Supabase Public URL: {public_url}")
            return public_url
        except Exception as e:
            logger.error(f"Supabase storage error: {e}", exc_info=True)
            return ""

storage_service = StorageService()
