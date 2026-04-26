from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "News Cards Studio"
    API_V1_STR: str = "/api/v1"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_BUCKET_NAME: str = "photocards"
    
    # Security
    SECRET_KEY: str = "your-secret-key-for-hashing"  # Change this in production
    
    # Assets
    FONTS_DIR: str = "assets/fonts"
    
    model_config = ConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
