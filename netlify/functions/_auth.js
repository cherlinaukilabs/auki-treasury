export function requireBasicAuth(event) {
  const user = process.env.AUKI_TREASURY_USER || "";
  const pass = process.env.AUKI_TREASURY_PASS || "";

  // Fail closed if not configured.
  if (!user || !pass) {
    return {
      ok: false,
      response: {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Auth is not configured on server." }),
      },
    };
  }

  const header = event.headers?.authorization || event.headers?.Authorization || "";
  if (!header.startsWith("Basic ")) {
    return {
      ok: false,
      response: {
        statusCode: 401,
        headers: { "WWW-Authenticate": 'Basic realm="AUKI Treasury"' },
        body: "Authentication required.",
      },
    };
  }

  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    decoded = "";
  }

  const sep = decoded.indexOf(":");
  const u = sep >= 0 ? decoded.slice(0, sep) : "";
  const p = sep >= 0 ? decoded.slice(sep + 1) : "";

  if (u !== user || p !== pass) {
    return {
      ok: false,
      response: {
        statusCode: 401,
        headers: { "WWW-Authenticate": 'Basic realm="AUKI Treasury"' },
        body: "Invalid credentials.",
      },
    };
  }

  return { ok: true };
}
