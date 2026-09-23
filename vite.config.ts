import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { parse as parseUrl } from "node:url";
import leadsHandler from "./backend/api/leads.js";
import newsletterHandler from "./backend/api/newsletter.js";
import dashboardLoginHandler from "./backend/api/dashboard/auth/login.js";
import dashboardMeHandler from "./backend/api/dashboard/auth/me.js";
import dashboardLogoutHandler from "./backend/api/dashboard/auth/logout.js";
import dashboardOverviewHandler from "./backend/api/dashboard/overview.js";
import dashboardLeadsHandler from "./backend/api/dashboard/leads.js";
import dashboardCmsHandler from "./backend/api/dashboard/cms.js";
import dashboardEventsHandler from "./backend/api/dashboard/events.js";
import dashboardAssistantHandler from "./backend/api/dashboard/assistant.js";
import publicContentHandler from "./backend/api/public/content.js";
import publicAssistantHandler from "./backend/api/public/assistant.js";

const base = process.env.BASE_PATH || "/";
const isPreview = process.env.IS_PREVIEW ? true : false;

loadLocalEnv();

export default defineConfig({
  root: "frontend",
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
  },
  plugins: [react(), localApiPlugin()],
  base,
  build: {
    sourcemap: isPreview,
    outDir: "../out",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./frontend/src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});

function localApiPlugin(): Plugin {
  const handlers: Record<string, (req: any, res: any) => Promise<void> | void> = {
    "/leads": leadsHandler,
    "/newsletter": newsletterHandler,
    "/dashboard/auth/login": dashboardLoginHandler,
    "/dashboard/auth/me": dashboardMeHandler,
    "/dashboard/auth/logout": dashboardLogoutHandler,
    "/dashboard/overview": dashboardOverviewHandler,
    "/dashboard/leads": dashboardLeadsHandler,
    "/dashboard/cms": dashboardCmsHandler,
    "/dashboard/events": dashboardEventsHandler,
    "/dashboard/assistant": dashboardAssistantHandler,
    "/public/content": publicContentHandler,
    "/public/assistant": publicAssistantHandler,
  };

  return {
    name: "local-api-functions",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        const parsed = parseUrl(req.url || "", true);
        const pathname = parsed.pathname || "/";
        const handler = handlers[pathname];
        if (!handler) return next();

        try {
          (req as any).query = parsed.query || {};
          (req as any).body = await readBody(req);
          patchResponse(res);
          await handler(req, res);
        } catch (error) {
          console.error(error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: "Local API error." }));
          }
        }
      });
    },
  };
}

function patchResponse(res: any) {
  res.status = (statusCode: number) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (payload: unknown) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
  };
  res.send = (payload: unknown) => {
    if (typeof payload === "object") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(payload));
      return;
    }
    res.end(String(payload ?? ""));
  };
}

async function readBody(req: any): Promise<unknown> {
  if (!["POST", "PUT", "PATCH"].includes(req.method || "")) return undefined;

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  const contentType = String(req.headers["content-type"] || "");
  if (contentType.includes("application/json")) return JSON.parse(raw);
  return raw;
}

function loadLocalEnv() {
  if (!existsSync(".env")) return;

  const env = readFileSync(".env", "utf8");
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...rest] = trimmed.split("=");
    if (process.env[key]) continue;
    process.env[key] = rest.join("=").trim().replace(/^"|"$/g, "");
  }
}



