import { requireBasicAuth } from "./_auth.js";

export async function handler(event) {
  const auth = requireBasicAuth(event);
  if (!auth.ok) return auth.response;

  const symbol = event.queryStringParameters?.symbol || "AUKIUSDT";
  const url = `https://api.mexc.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`;

  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `MEXC error ${res.status}`, detail: text.slice(0, 800) }),
      };
    }
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server exception", detail: e?.message || String(e) }),
    };
  }
}
