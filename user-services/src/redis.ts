import { Redis } from "ioredis";

let redisClient: Redis | null = null;

export const createRedisClient = (logger: any): Redis | null => {
  const isEnabled = process.env.FEATURE_REDIS_CACHE === "true";

  if (!isEnabled) {
    logger.info("Redis feature flag: disabled");
    return null;
  }

  if (redisClient) return redisClient;

  const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  };

  redisClient = new Redis(redisConfig);

  redisClient.on("connect", () => {
    logger.info("Redis connected", {
      target: "redis",
      host: redisConfig.host,
      port: redisConfig.port,
    });
  });

  redisClient.on("error", (err) => {
    logger.error("Redis error", {
      target: "redis",
      error: err.message,
    });
  });

  redisClient.on("close", () => {
    logger.warn("Redis connection closed", {
      target: "redis",
    });
  });

  redisClient.on("reconnecting", () => {
    logger.info("Redis reconnecting", {
      target: "redis",
    });
  });

  redisClient.connect().catch((err) => {
    logger.error("Redis connection failed", {
      target: "redis",
      error: err.message,
    });
  });

  return redisClient;
};

export const getRedisClient = (): Redis | null => {
  return redisClient;
};

export const checkRedisHealth = async (): Promise<boolean> => {
  const isEnabled = process.env.FEATURE_REDIS_CACHE === "true";
  if (!isEnabled || !redisClient) {
    return false;
  }

  try {
    const result = await redisClient.ping();
    return result === "PONG";
  } catch {
    return false;
  }
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
