import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { createNoteRouter } from "./feature/note/create/router";

export const app = new OpenAPIHono();

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  }),
);

app.get("/health", (c) => c.json({ status: "OK" }));

app.route("/", createNoteRouter());

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Note App API",
  },
});
