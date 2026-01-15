import { FastifyInstance } from "fastify";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "./db.js";
import { getCache, setCache, deleteCachePattern } from "./cache.js";

export const registerUserRoutes = async (app: FastifyInstance) => {
  app.get("/users", async () => {
    const cacheKey = "users:all";
    const cached = await getCache<any[]>(cacheKey);
    if (cached) {
      return { success: true, users: cached, cached: true };
    }
    const users = await listUsers();
    await setCache(cacheKey, users, 60);
    return { success: true, users, cached: false };
  });

  app.get(
    "/users/:id",
    async (request, reply) => {
      const params = request.params as { id: string };
      const cacheKey = `users:id:${params.id}`;
      const cached = await getCache<any>(cacheKey);
      if (cached) {
        return { success: true, user: cached, cached: true };
      }
      const user = await getUserById(params.id);
      if (!user) {
        reply.code(404);
        return { success: false, message: "User not found" };
      }
      await setCache(cacheKey, user, 60);
      return { success: true, user, cached: false };
    }
  );

  app.post(
    "/users",
    async (request, reply) => {
      const body = request.body as { email?: string; name?: string };
      if (!body.email || !body.name) {
        reply.code(400);
        return { success: false, message: "Email and name are required" };
      }
      const user = await createUser(body.email, body.name);
      await deleteCachePattern("users:*");
      reply.code(201);
      return { success: true, user };
    }
  );

  app.put(
    "/users/:id",
    async (request, reply) => {
      const params = request.params as { id: string };
      const body = request.body as { email?: string; name?: string };
      if (!body.email || !body.name) {
        reply.code(400);
        return { success: false, message: "Email and name are required" };
      }
      const user = await updateUser(params.id, body.email, body.name);
      if (!user) {
        reply.code(404);
        return { success: false, message: "User not found" };
      }
      await deleteCachePattern("users:*");
      return { success: true, user };
    }
  );

  app.delete(
    "/users/:id",
    async (request, reply) => {
      const params = request.params as { id: string };
      const result = await deleteUser(params.id);
      if (!result) {
        reply.code(404);
        return { success: false, message: "User not found" };
      }
      await deleteCachePattern("users:*");
      return { success: true, id: result.id };
    }
  );
};


