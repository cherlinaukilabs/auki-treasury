import { requireBasicAuth } from "./_auth.js";

export async function handler(event) {

  const auth = requireBasicAuth(event);
  if (!auth.ok) return auth.response;

  const params = event.queryStringParameters || {};
  const symbol = params.symbol || "AUKIUSDT";

  try {

    // ─── RECENT TRADES ENDPOINT ─────────────────────
    if (params.recentTrades) {

      const limit = params.limit || 50;

      const res = await fetch(
        `https://api.mexc.com/api/v3/trades?symbol=${encodeURIComponent(symbol)}&limit=${limit}`
      );

      const data = await res.json();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5"
        },
        body: JSON.stringify(data)
      };

    }

    // ─── TICKER (existing behaviour) ─────────────────
    const res = await fetch(
      `https://api.mexc.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`
    );

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30"
      },
      body: JSON.stringify(data)
    };

  } catch (e) {

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Server exception",
        detail: e?.message || String(e)
      })
    };

  }
}