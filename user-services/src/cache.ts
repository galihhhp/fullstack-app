import { getRedisClient } from "./redis.js";

const DEFAULT_TTL = Number(process.env.REDIS_TTL) || 60;

const isRedisEnabled = (): boolean => {
  return process.env.FEATURE_REDIS_CACHE === "true";
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  if (!isRedisEnabled()) {
    return null;
  }

  const client = getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch {
    return null;
  }
};

export const setCache = async (
  key: string,
  value: any,
  ttl: number = DEFAULT_TTL
): Promise<boolean> => {
  if (!isRedisEnabled()) {
    return false;
  }

  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const deleteCache = async (key: string): Promise<boolean> => {
  if (!isRedisEnabled()) {
    return false;
  }

  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.del(key);
    return true;
  } catch {
    return false;
  }
};

export const deleteCachePattern = async (pattern: string): Promise<number> => {
  if (!isRedisEnabled()) {
    return 0;
  }

  const client = getRedisClient();
  if (!client) {
    return 0;
  }

  try {
    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;
    const deleted = await client.del(...keys);
    return deleted;
  } catch {
    return 0;
  }
};
