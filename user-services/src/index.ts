import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { Registry, Counter, Histogram, collectDefaultMetrics } from "prom-client";
import { registerUserRoutes } from "./routes.js";
import { initializeDatabaseMetrics, setupDatabasePoolEvents } from "./db.js";

dotenv.config();

const register = new Registry();

collectDefaultMetrics({ register });

initializeDatabaseMetrics(register);
setupDatabasePoolEvents();

const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const normalizeRoute = (pathname: string): string => {
  if (pathname.startsWith("/users/")) {
    return "/users/:id";
  }
  return pathname;
};

const createServer = () => {
  const app = fastify({
    logger: true
  });

  app.register(cors, {
    origin: true
  });

  app.addHook("onRequest", async (request, reply) => {
    (request as any).startTime = Date.now();
  });

  app.addHook("onResponse", async (request, reply) => {
    const route = normalizeRoute(request.url);
    const method = request.method;
    const statusCode = reply.statusCode;
    const duration = (Date.now() - (request as any).startTime) / 1000;

    httpRequestDuration.observe(
      { method, route, status_code: statusCode.toString() },
      duration
    );
    httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  });

  app.get("/", async () => {
    return { message: "User service is running" };
  });

  app.get("/metrics", async (request, reply) => {
    reply.type("text/plain");
    return await register.metrics();
  });

  app.register(registerUserRoutes);

  return app;
};

const start = async () => {
  const port = Number(process.env.USER_SERVICE_PORT) || 4000;
  const host = process.env.USER_SERVICE_HOST || "0.0.0.0";
  const app = createServer();
  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();


