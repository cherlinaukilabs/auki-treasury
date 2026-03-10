import { requireBasicAuth } from "./_auth.js";

export async function handler(event) {
  const auth = requireBasicAuth(event);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.Dune_Secret_API || "";
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "DUNE_API_KEY is not set." }),
    };
  }

  const queryId = event.queryStringParameters?.queryId;
  if (!queryId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing queryId" }),
    };
  }

  const limit = 50000;
  const url = `https://api.dune.com/api/v1/query/${encodeURIComponent(queryId)}/results?limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Dune-Api-Key": apiKey,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Dune error ${res.status}`, detail: text.slice(0, 800) }),
      };
    }

    const data = await res.json();
    const rows = data?.result?.rows ?? [];
    const executed_at = data?.result?.metadata?.executed_at ?? null;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify({ rows, executed_at }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server exception", detail: e?.message || String(e) }),
    };
  }
}
