import redis

class PresenceService:

    PRESENCE_TTL = 60

    @staticmethod
    def set_online(user_id: int, redis_client: redis.Redis):
        key = f"presence:user:{user_id}"

        redis_client.set(
            key,
            "online",
            ex=PresenceService.PRESENCE_TTL,
        )