import redis

from fastapi import HTTPException
from schemas import UserPresenceResponse
from config import settings


class PresenceService:

    TTL = settings.PRESENCE_TTL

    @staticmethod
    def set_online(user_id: int, redis_client: redis.Redis):
        key = f"presence:user:{user_id}"

        try:
            redis_client.set(
                key,
                "online",
                ex=PresenceService.TTL,
            )
        except redis.exceptions.RedisError:
            raise HTTPException(
                status_code=503,
                detail="Presence service is temporarily unavailable",
            )

    @staticmethod
    def is_online(user_id: int, redis_client: redis.Redis):
        key = f"presence:user:{user_id}"

        try:
            return redis_client.exists(key) == 1
        except redis.exceptions.RedisError:
            raise HTTPException(
                status_code=503,
                detail="Presence service is temporarily unavailable",
            )

    @staticmethod
    def get_users_presence(
        user_ids: list[int],
        redis_client: redis.Redis
    ):
        keys = [f"presence:user:{user_id}" for user_id in user_ids]

        try:
            values = redis_client.mget(keys)
        except redis.exceptions.RedisError:
            raise HTTPException(
                status_code=503,
                detail="Presence service is temporarily unavailable",
            )

        return [
            UserPresenceResponse(
                user_id=user_id,
                status="Online" if value is not None else "Offline"
            )
            for user_id, value in zip(user_ids, values)
        ]