import { FastifyInstance } from "fastify";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "./db.js";

export const registerUserRoutes = async (app: FastifyInstance) => {
  app.get("/users", async () => {
    const users = await listUsers();
    return { success: true, users };
  });

  app.get(
    "/users/:id",
    async (request, reply) => {
      const params = request.params as { id: string };
      const user = await getUserById(params.id);
      if (!user) {
        reply.code(404);
        return { success: false, message: "User not found" };
      }
      return { success: true, user };
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
      return { success: true, id: result.id };
    }
  );
};


