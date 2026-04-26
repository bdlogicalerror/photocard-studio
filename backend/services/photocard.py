import os
from datetime import datetime
from supabase import create_client, Client
from utils.logging import logger

class PhotocardService:
    def __init__(self):
        self.url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase: Client = None
        
        if self.url and self.key:
            try:
                self.supabase = create_client(self.url, self.key)
                logger.info("Photocard service initialized with Supabase")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")

    async def save_to_db(self, data: dict):
        if not self.supabase:
            logger.error("Supabase client not initialized")
            return
            
        try:
            # card_data should be a JSON field in Postgres
            # If payload is passed, we might want to store it there
            if "card_data" not in data and "payload" in data:
                data["card_data"] = data.pop("payload")

            result = self.supabase.table("photocards").insert(data).execute()
            return {"success": True, "data": result.data}
        except Exception as e:
            logger.error(f"Failed to insert photocard to DB: {e}")
            raise e


    async def check_and_log_guest_usage(self, identifier: str, limit: int) -> int:
        """
        Logs guest usage by IP (identifier) and returns current count.
        """
        if not self.supabase:
            return 0
            
        today = datetime.now().date().isoformat()
        
        try:
            # 1. Try to get existing record for today
            result = self.supabase.table("guest_usage") \
                .select("generation_count") \
                .eq("identifier", identifier) \
                .eq("usage_date", today) \
                .execute()
            
            if result.data:
                current_count = result.data[0]["generation_count"]
                if current_count >= limit:
                    return current_count
                
                # Increment
                new_count = current_count + 1
                self.supabase.table("guest_usage") \
                    .update({"generation_count": new_count}) \
                    .eq("identifier", identifier) \
                    .eq("usage_date", today) \
                    .execute()
                return new_count
            else:
                # Create new record
                self.supabase.table("guest_usage") \
                    .insert({
                        "identifier": identifier,
                        "usage_date": today,
                        "generation_count": 1
                    }).execute()
                return 1
        except Exception as e:
            logger.error(f"Guest usage logging error: {e}")
            return 0

    def get_by_shield_id(self, shield_id: str):
        if not self.supabase:
            return None
        result = self.supabase.table("photocards").select("*").eq("shield_id", shield_id).single().execute()
        return result.data

photocard_service = PhotocardService()
