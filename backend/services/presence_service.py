import redis
from schemas import UserPresenceResponse

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

    @staticmethod
    def is_online(user_id: int, redis_client: redis.Redis):
        key = f"presence:user:{user_id}"

        return redis_client.exists(key) == 1

    @staticmethod
    def get_users_presence(user_ids: list[int], redis_client: redis.Redis):

        results = []

        for user_id in user_ids:

            status = PresenceService.is_online(user_id, redis_client)

            results.append(UserPresenceResponse(user_id=user_id, status="Online" if status else "Offline"))

        return results