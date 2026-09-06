import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PYTHON = process.platform === "win32" ? "python" : "python3";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function runBridge(scriptName, payload) {
  return new Promise((resolve, reject) => {
    const script = path.join(__dirname, "bridge", scriptName);
    const child = spawn(PYTHON, [script], {
      cwd: PROJECT_ROOT,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (data) => {
      stdout += data;
    });
    child.stderr.on("data", (data) => {
      stderr += data;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || stdout || `Python exited with ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(stderr || stdout || String(error)));
      }
    });
    child.stdin.write(JSON.stringify(payload ?? {}));
    child.stdin.end();
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function attachBridge(server) {
  server.middlewares.use(async (req, res, next) => {
    const url = req.url?.split("?")[0];
    if (!url?.startsWith("/api/")) {
      next();
      return;
    }

    try {
      if (url === "/api/health" && req.method === "GET") {
        sendJson(res, 200, { ok: true, engine: "python" });
        return;
      }

      if (url === "/api/process" && req.method === "POST") {
        const payload = await readBody(req);
        const result = await runBridge("process.py", payload);
        sendJson(res, 200, { ...result, engine: "python" });
        return;
      }

      if (url === "/api/speak" && req.method === "POST") {
        const payload = await readBody(req);
        const result = await runBridge("speak.py", payload);
        const bytes = await fs.readFile(result.path);
        sendJson(res, 200, {
          engine: "python",
          path: result.path,
          mime: "audio/mpeg",
          audioBase64: bytes.toString("base64"),
        });
        return;
      }

      next();
    } catch (error) {
      sendJson(res, 500, { error: String(error.message || error) });
    }
  });
}

export function pythonBridge() {
  return {
    name: "speakeasy-python-bridge",
    configureServer: attachBridge,
    configurePreviewServer: attachBridge,
  };
}
