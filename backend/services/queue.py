import os
from arq import create_pool
from arq.connections import RedisSettings

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_host = REDIS_URL.split("://")[1].split(":")[0]
redis_port = int(REDIS_URL.split("://")[1].split(":")[1]) if ":" in REDIS_URL.split("://")[1] else 6379

class QueueService:
    def __init__(self):
        self.redis_pool = None

    async def get_pool(self):
        if not self.redis_pool:
            self.redis_pool = await create_pool(RedisSettings(host=redis_host, port=redis_port))
        return self.redis_pool

    async def enqueue_job(self, function_name: str, *args, **kwargs):
        pool = await self.get_pool()
        job = await pool.enqueue_job(function_name, *args, **kwargs)
        return job

    async def get_job_status(self, job_id: str):
        from arq.jobs import Job
        pool = await self.get_pool()
        job = Job(job_id, pool)
        
        info = await job.info()
        if not info:
            return None
            
        status = await job.status()
        info = await job.info()
        result = None
        
        if status.value == "complete":
            try:
                result = await job.result()
            except Exception:
                pass
                
        return {
            "status": status.value,
            "info": info,
            "result": result
        }

queue_service = QueueService()
