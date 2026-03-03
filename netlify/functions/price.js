import { requireBasicAuth } from "./_auth.js";

export async function handler(event) {
  const auth = requireBasicAuth(event);
  if (!auth.ok) return auth.response;

  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=auki-labs&vs_currencies=usd&include_last_updated_at=true";

  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `CoinGecko error ${res.status}`, detail: text.slice(0, 800) }),
      };
    }

    const data = await res.json();
    const obj = data?.["auki-labs"];
    const price = obj?.usd;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify({
        price,
        source: "CoinGecko",
        asOf: obj?.last_updated_at ? new Date(obj.last_updated_at * 1000).toISOString() : new Date().toISOString(),
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server exception", detail: e?.message || String(e) }),
    };
  }
}
