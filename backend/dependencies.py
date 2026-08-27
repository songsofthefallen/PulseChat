from redis_client import redis_client

class Dependencies:
    @staticmethod
    def get_redis():
        return redis_client