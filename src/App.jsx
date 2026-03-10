import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const QUERY_BALANCES = 6752291;
const QUERY_MOVEMENTS = 6752302;
const QUERY_TRADES = 6752309;
const QUERY_DAILY = 6763898;

const TOTAL_SUPPLY = 10_000_000_000;
const MEXC_SYMBOL = "AUKIUSDT";

// ─── Address → Vault name ─────────────────────────────────────────────────────
const ADDR_TO_VAULT = {
  "0x1a7ede4cc85aa3c1092f6c4fd70cdd08626a7d1b": "Backer wallet unvested",
  "0x355549bab6e92e22c8ae5de7d66c9198f7ea8ebb": "Backer wallet vested",
  "0xb8e4755e35941d8803f24db28e118e2a3618b2eb": "Ecosystem Rewards Unvested",
  "0x9eacd08ced27b96ef6e6bec438da967d433af73b": "Ecosystem Rewards Vested",
  "0x53a94a5bc5fd57ff9f89f4e7418112fa0b0c07da": "Foundation fund",
  "0x159b0ac1856802946854317ff63f26d9a114e026": "Foundation unvested",
  "0x307f6bc835400877268555e8af4e4e47329027b4": "Foundation vested",
  "0x8cc76bc5e6b4deb4738b074db0ff68d697315572": "Manual Burner",
  "0x0b21395535471a957442b0cb29f0356d47407bf4": "OTC",
  "0xdfe40928dfa513b75408e5ec6218a69caa11a3a5": "Team wallet unvested",
  "0x2292dd84154463da8e6c704dd1f1775efe3c7b94": "Team wallet vested",
  "0xdbf12324322adcc9fac535946070a2e5ef0cb4ab": "Token Infrastructure",
  "0xe55ae5d0384c78e8f6f54b36543c4da988258f34": "Web3 Bootstrap",
  "0x9190e145d405165ee3b762478dc326576549e42a": "Gas Station BASE ETH",
  "0x8910ac8ce4a7740c795f1b0e33b37ae3f3443178": "Gas Station ETH",
  "0x4ab96bfb9ff1026ee45bef119f10c34d0f33142b": "Deployer Dev",
  "0x4b5058a27f28257484a4b2cdeabdf6b6a0c7481b": "Deployer Production",
  "0x24a225423c0e0b8734fa3d188ff66463f565d717": "Deployer Staging",
  "0x13a17d2764c94eb84de3bb1488624d24d99837cd": "Config operator Dev",
  "0x2b410245978799f23240d81a126697c5bb6e9daa": "Config operator Production",
  "0xef13db4f946e729666ba9f3480ef45dae168ea5e": "Config operator Staging",
  "0xe4c5178ad7a0eb558d717c924cc64a06efae94a4": "Pauser Dev",
  "0x7a837297521d5a25491fc667bacee820742c24c4": "Pauser Production",
  "0xbfb135e67140166a62e46fa413351781c4a19c1c": "Pauser Staging",
  "0x1f99bdab216ec2735b3dd0a3b1f58463d54ee412": "Reward Operator Dev",
  "0x5d080841fa45667797f1ba8f24808e630b0db5d3": "Reward Operator Production",
  "0xde85c3c706e0775b659ce1fe2fbb3a026dc08a3f": "Reward Operator Staging",
  "0xc98f5fa657cef84d18674eecd230953d704f0d7a": "Slasher Dev",
  "0x7fecb61ac917bb40e3cc2171e545bea28188145e": "Slasher Production",
  "0x5b003df1681ce44d0385367ba501fb0eb6b0bca1": "Slasher Staging",
  "0x5bb33bb5d8d47c2142d4f779587f4efb2c74cce5": "ESOP",
  "0xddeac2cac5c32264f361c379a6d99772011af53f": "HEX Safe Global",
  "0x731c77a003c521a2eb84d0b2994a63a49e93d683": "HEX Safe Plus Global",
  "0xb24cecae11fd1294578d27a78641081a9556f4e2": "Team Resources",
};

const VAULT_GROUPS = [
  { id: "team", label: "Team", color: "#7B9ECC", vaults: ["Team wallet unvested", "Team wallet vested", "Token Infrastructure", "ESOP", "Team Resources"] },
  { id: "foundation", label: "Foundation", color: "#C8A96E", vaults: ["Foundation unvested", "Foundation vested", "Foundation fund", "HEX Safe Global", "HEX Safe Plus Global"] },
  { id: "ecosystem", label: "Ecosystem", color: "#7CC4A4", vaults: ["Ecosystem Rewards Unvested", "Ecosystem Rewards Vested"] },
  { id: "investors", label: "Investors & Backers", color: "#C47AB5", vaults: ["Backer wallet unvested", "Backer wallet vested", "OTC"] },
  { id: "infrastructure", label: "Token Infrastructure", color: "#E07B5A", vaults: ["Manual Burner", "Web3 Bootstrap", "Gas Station BASE ETH", "Gas Station ETH"] },
  { id: "ops", label: "Operational", color: "#c0c0c0", vaults: ["Config operator Dev", "Config operator Production", "Config operator Staging", "Deployer Dev", "Deployer Production", "Deployer Staging", "Pauser Dev", "Pauser Production", "Pauser Staging", "Reward Operator Dev", "Reward Operator Production", "Reward Operator Staging", "Slasher Dev", "Slasher Production", "Slasher Staging"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const M = { fontFamily: "'JetBrains Mono',monospace" };

const fmtTokens = (n) => {
  if (!n || Number(n) === 0) return "—";
  const x = Number(n);
  if (x >= 1e9) return `${(x / 1e9).toFixed(3)}B`;
  if (x >= 1e6) return `${(x / 1e6).toFixed(2)}M`;
  if (x >= 1e3) return `${(x / 1e3).toFixed(1)}K`;
  return x.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

const fmtUsd = (n) => {
  if (!n || Number(n) === 0) return "—";
  const x = Number(n);
  if (x >= 1e6) return `$${(x / 1e6).toFixed(2)}M`;
  if (x >= 1e3) return `$${(x / 1e3).toFixed(1)}K`;
  return `$${x.toFixed(2)}`;
};

const fmtPrice = (n) => (n ? `$${Number(n).toFixed(5)}` : "—");

const fmtDate = (s) => {
  try {
    return new Date(s).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
};

const fmtDateShort = (s) => {
  try {
    return new Date(s).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return s;
  }
};

const fmtTimeOnly = (s) => {
  try {
    return new Date(s).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return s;
  }
};

const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");
const vaultName = (a) => (a ? ADDR_TO_VAULT[a.toLowerCase()] || shortAddr(a) : "—");
const isVault = (a) => a && !!ADDR_TO_VAULT[a.toLowerCase()];

const parseDuneTime = (s) => {
  if (!s) return null;
  try {
    const iso = s.includes("UTC") ? s.replace(" UTC", "Z").replace(" ", "T") : `${s.replace(" ", "T")}Z`;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

const getTradeSizeIcon = (usd) => {
  const x = Number(usd || 0);
  if (x >= 1000) return "🐋";
  if (x >= 100) return "🐟";
  return "🍤";
};

// ─── Data fetchers ────────────────────────────────────────────────────────────
async function fetchDune(queryId) {
  try {
    const res = await fetch(`/.netlify/functions/dune?queryId=${queryId}`);
    const data = await res.json();
    return data?.rows || [];
  } catch (e) {
    console.error("Dune fetch error:", e);
    return [];
  }
}

async function fetchAukiPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=auki-labs&vs_currencies=usd");
    const data = await res.json();
    const p = data?.["auki-labs"]?.usd;
    if (p > 0) return { price: p, source: "live" };
    return { price: 0.00929, source: "est" };
  } catch {
    return { price: 0.00929, source: "est" };
  }
}

async function fetchMexcTicker() {
  try {
    const r = await fetch("/.netlify/functions/mexc");
    const j = await r.json();
    if (j?.lastPrice) return { data: j, error: null };
  } catch {}

  try {
    const res = await fetch(`https://api.mexc.com/api/v3/ticker/24hr?symbol=${MEXC_SYMBOL}`);
    const data = await res.json();
    if (data?.lastPrice) return { data, error: null };
    return { data: null, error: "No data" };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

async function fetchMexcRecentTrades(limit = 50) {
  // 1) Preferred: Netlify function proxy
  try {
    const r = await fetch(`/.netlify/functions/mexc?recentTrades=1&limit=${limit}`);
    const j = await r.json();
    if (Array.isArray(j)) return { data: j, error: null };
  } catch {}

  // 2) Fallback: direct
  try {
    const res = await fetch(`https://api.mexc.com/api/v3/trades?symbol=${MEXC_SYMBOL}&limit=${limit}`);
    const data = await res.json();
    if (Array.isArray(data)) return { data, error: null };
    return { data: [], error: "No trade data" };
  } catch (e) {
    return { data: [], error: e.message };
  }
}

async function fetchMexcDaily(limit = 365) {
  try {
    const r = await fetch(`/.netlify/functions/mexc?daily=1&limit=${limit}`);
    const j = await r.json();
    if (Array.isArray(j)) return { data: j, error: null };
    return { data: [], error: "No daily CEX data" };
  } catch (e) {
    return { data: [], error: e.message };
  }
}

// ─── UI Components ────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <div style={{ display: "inline-flex", background: "#0D0D0D", border: "1px solid #2A2A2A", borderRadius: 6, padding: 3, gap: 2 }}>
      {[["tokens", "TOKENS"], ["usd", "USD"]].map(([v, l]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: "5px 14px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            ...M,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.08em",
            background: value === v ? "#C8A96E" : "transparent",
            color: value === v ? "#0D0D0D" : "#555",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function PeriodToggle({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", background: "#0D0D0D", border: "1px solid #2A3440", borderRadius: 6, padding: 2, gap: 1 }}>
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          style={{
            padding: "4px 10px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            ...M,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            background: value === o.v ? "#1E1E1E" : "transparent",
            color: value === o.v ? "#C8A96E" : "#444",
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, accent, loading }) {
  return (
    <div style={{ background: "#121820", border: "1px solid #2A3440", borderRadius: 8, padding: "22px 26px", flex: 1, minWidth: 0 }}>
      <div style={{ color: "#B0BAC5", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", ...M, marginBottom: 8 }}>{label}</div>
      <div style={{ color: accent || "#F0ECE3", fontSize: 24, fontWeight: 700, ...M, letterSpacing: "-0.02em" }}>
        {loading ? <span style={{ color: "#B0BAC5" }}>···</span> : value}
      </div>
      {sub && <div style={{ color: "#c0c0c0", fontSize: 13, marginTop: 4, ...M }}>{sub}</div>}
    </div>
  );
}

function Loader({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#B0BAC5", ...M, fontSize: 14, letterSpacing: "0.1em" }}>
      <div style={{ marginBottom: 12, fontSize: 24 }}>⟳</div>
      {msg || "LOADING…"}
    </div>
  );
}

function SupplyAllocationPie({ totalsByGroup }) {
  const size = 260;
  const r = 105;
  const cx = size / 2;
  const cy = size / 2;

  const segments = totalsByGroup.filter((s) => s.pct > 0.0001);

  let a0 = -Math.PI / 2;
  const paths = segments.map((s, idx) => {
    const a1 = a0 + (s.pct / 100) * 2 * Math.PI;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = [`M ${cx} ${cy}`, `L ${x0} ${y0}`, `A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`, "Z"].join(" ");
    a0 = a1;
    return <path key={idx} d={d} fill={s.color} />;
  });

  return (
    <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="#1b1b1b" />
        {paths}
        <circle cx={cx} cy={cy} r={r * 0.56} fill="#121212" />
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 240 }}>
        {totalsByGroup.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, color: "#cfcfcf", fontSize: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: s.color, display: "inline-block" }} />
            <span style={{ flex: 1, opacity: 0.95 }}>{s.label}</span>
            <span style={{ opacity: 0.85 }}>{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MEXC Components ──────────────────────────────────────────────────────────
function MexcSection({ ticker, loading, error, onRefresh, ts }) {
  const pctChange = ticker?.priceChangePercent != null ? parseFloat(ticker.priceChangePercent) * 100 : null;
  const pctColor = pctChange > 0 ? "#7CC4A4" : pctChange < 0 ? "#E07B5A" : "#555";

  return (
    <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #1A1A1A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: loading ? "#333" : error ? "#E07B5A" : "#7CC4A4" }} />
          <span style={{ ...M, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: "#CCC" }}>MEXC · {MEXC_SYMBOL}</span>
          <span style={{ ...M, fontSize: 12, color: "#B0BAC5" }}>CENTRALISED EXCHANGE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {ts && <span style={{ ...M, fontSize: 12, color: "#2E2E2E" }}>{ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          <button onClick={onRefresh} style={{ background: "none", border: "1px solid #222", borderRadius: 4, color: "#444", fontSize: 12, padding: "2px 6px", cursor: "pointer", ...M }}>↻</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "#B0BAC5", ...M, fontSize: 14 }}>FETCHING MEXC DATA…</div>
      ) : error ? (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "#E07B5A", ...M, fontSize: 14 }}>MEXC API unavailable — {error}</div>
      ) : ticker ? (
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
            <span style={{ ...M, fontSize: 32, fontWeight: 700, color: "#F0ECE3", letterSpacing: "-0.02em" }}>${parseFloat(ticker.lastPrice).toFixed(6)}</span>
            {pctChange != null && (
              <span style={{ ...M, fontSize: 15, fontWeight: 600, color: pctColor }}>
                {pctChange > 0 ? "▲" : pctChange < 0 ? "▼" : ""} {Math.abs(pctChange).toFixed(2)}% (24h)
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
            {[
              { l: "24H HIGH", v: `$${parseFloat(ticker.highPrice).toFixed(6)}`, c: "#7CC4A4" },
              { l: "24H LOW", v: `$${parseFloat(ticker.lowPrice).toFixed(6)}`, c: "#E07B5A" },
              { l: "24H VOLUME (AUKI)", v: fmtTokens(parseFloat(ticker.volume)), c: "#F0ECE3" },
              { l: "24H VOLUME (USDT)", v: fmtUsd(parseFloat(ticker.quoteVolume)), c: "#F0ECE3" },
            ].map((s) => (
              <div key={s.l} style={{ background: "#141414", borderRadius: 6, padding: "10px 14px" }}>
                <div style={{ ...M, fontSize: 11, color: "#444", letterSpacing: "0.1em", marginBottom: 5 }}>{s.l}</div>
                <div style={{ ...M, fontSize: 19, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "#0D1A12", border: "1px solid #1A2E1A", borderRadius: 6, padding: "10px 14px" }}>
              <div style={{ ...M, fontSize: 11, color: "#444", letterSpacing: "0.1em", marginBottom: 5 }}>BID</div>
              <div style={{ ...M, fontSize: 14, fontWeight: 700, color: "#7CC4A4" }}>${parseFloat(ticker.bidPrice).toFixed(6)}</div>
              <div style={{ ...M, fontSize: 12, color: "#9AA4AF", marginTop: 3 }}>{fmtTokens(parseFloat(ticker.bidQty))} AUKI</div>
            </div>
            <div style={{ background: "#1A0D0D", border: "1px solid #2E1A1A", borderRadius: 6, padding: "10px 14px" }}>
              <div style={{ ...M, fontSize: 11, color: "#444", letterSpacing: "0.1em", marginBottom: 5 }}>ASK</div>
              <div style={{ ...M, fontSize: 14, fontWeight: 700, color: "#E07B5A" }}>${parseFloat(ticker.askPrice).toFixed(6)}</div>
              <div style={{ ...M, fontSize: 12, color: "#9AA4AF", marginTop: 3 }}>{fmtTokens(parseFloat(ticker.askQty))} AUKI</div>
            </div>
          </div>

          <div style={{ marginTop: 10, ...M, fontSize: 12, color: "#444" }}>
            SPREAD: ${(parseFloat(ticker.askPrice) - parseFloat(ticker.bidPrice)).toFixed(6)} ·{" "}
            {(((parseFloat(ticker.askPrice) - parseFloat(ticker.bidPrice)) / parseFloat(ticker.bidPrice)) * 100).toFixed(3)}%
          </div>
        </div>
      ) : (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "#E07B5A", ...M, fontSize: 14 }}>MEXC returned no data</div>
      )}
    </div>
  );
}

function MexcTradesPanel({ trades, loading, error, ts }) {
  return (
    <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 12, color: "#B0BAC5", letterSpacing: "0.1em", ...M }}>RECENT MEXC TRADES · AUTO REFRESH 30S</div>
        <div style={{ fontSize: 12, color: "#9AA4AF", ...M }}>{ts ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "70px 80px 80px 90px 110px 80px", gap: 12, padding: "14px 20px", borderBottom: "1px solid #1A1A1A" }}>
        {["ICON", "TIME", "TYPE", "PRICE", "AUKI", "USD"].map((h) => (
          <div key={h} style={{ fontSize: 11, color: "#B0BAC5", letterSpacing: "0.1em", ...M }}>
            {h}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "#B0BAC5", ...M, fontSize: 14 }}>FETCHING RECENT MEXC TRADES…</div>
      ) : error ? (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "#E07B5A", ...M, fontSize: 14 }}>MEXC trades unavailable — {error}</div>
      ) : trades.length === 0 ? (
        <div style={{ padding: "30px 20px", textAlign: "center", color: "#B0BAC5", ...M, fontSize: 14 }}>No recent trades</div>
      ) : (
        trades.map((t, i) => {
          const sell = !!t.isBuyerMaker;
          const color = sell ? "#E07B5A" : "#7CC4A4";
          const usd = Number(t.quoteQty || 0);
          const icon = getTradeSizeIcon(usd);
          return (
            <div
              key={`${t.time}-${i}`}
              style={{ display: "grid", gridTemplateColumns: "70px 80px 80px 90px 110px 80px", gap: 12, padding: "12px 20px", borderBottom: i < trades.length - 1 ? "1px solid #141414" : "none", ...M, fontSize: 14 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#131313")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ fontSize: 18 }}>{icon}</div>
              <div style={{ color: "#c0c0c0" }}>{fmtTimeOnly(t.time)}</div>
              <div>
                <span style={{ color, fontSize: 12, fontWeight: 700, padding: "2px 6px", background: `${color}18`, borderRadius: 3 }}>
                  {sell ? "SELL" : "BUY"}
                </span>
              </div>
              <div style={{ color: "#F0ECE3" }}>${Number(t.price).toFixed(6)}</div>
              <div style={{ color, fontWeight: 700 }}>{fmtTokens(t.qty)}</div>
              <div style={{ color: "#C8A96E" }}>{fmtUsd(usd)}</div>
            </div>
          );
        })
      )}

      <div style={{ padding: "10px 20px", borderTop: "1px solid #1A1A1A", color: "#9AA4AF", fontSize: 12, ...M }}>
        🍤 under $100 · 🐟 $100–$999 · 🐋 $1,000+
      </div>
    </div>
  );
}

// ─── Vault Balances ───────────────────────────────────────────────────────────
function VaultBalancesTab({ balances, mode, price }) {
  const [expanded, setExpanded] = useState({ team: true, foundation: true, ecosystem: true, investors: false, infrastructure: true, ops: false });
  const disp = (n) => (!n || n === 0 ? "—" : mode === "tokens" ? fmtTokens(n) : fmtUsd(n * (price || 0)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 80px", gap: 12, padding: "0 20px 6px 36px" }}>
        {["VAULT", "BALANCE", "% SUPPLY"].map((h, i) => (
          <div key={h} style={{ fontSize: 11, color: "#B0BAC5", letterSpacing: "0.1em", ...M, textAlign: i === 0 ? "left" : "right" }}>
            {h}
          </div>
        ))}
      </div>

      {VAULT_GROUPS.map((g) => {
        const gvaults = g.vaults.map((n) => ({ name: n, balance: balances[n] || 0 }));
        const gTotal = gvaults.reduce((s, v) => s + v.balance, 0);
        const pct = ((gTotal / TOTAL_SUPPLY) * 100).toFixed(1);
        const activeCount = gvaults.filter((v) => v.balance > 0).length;
        const isExp = !!expanded[g.id];

        return (
          <div key={g.id} style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, overflow: "hidden" }}>
            <div
              onClick={() => setExpanded((p) => ({ ...p, [g.id]: !p[g.id] }))}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", userSelect: "none", borderBottom: isExp ? "1px solid #1A1A1A" : "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#131313")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.color }} />
                <span style={{ color: "#CCC", ...M, fontSize: 15, fontWeight: 600, letterSpacing: "0.06em" }}>{g.label.toUpperCase()}</span>
                <span style={{ color: "#2E2E2E", ...M, fontSize: 13 }}>
                  {activeCount}/{g.vaults.length} active
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#F0ECE3", ...M, fontSize: 19, fontWeight: 700 }}>{disp(gTotal)}</div>
                  <div style={{ color: "#9AA4AF", ...M, fontSize: 13 }}>{pct}% of supply</div>
                </div>
                <span style={{ color: "#2E2E2E", fontSize: 12 }}>{isExp ? "▲" : "▼"}</span>
              </div>
            </div>

            <div style={{ height: 2, background: "#1A1A1A" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: g.color, opacity: 0.5 }} />
            </div>

            {isExp &&
              gvaults.map((v, i) => {
                const empty = v.balance === 0;
                return (
                  <div
                    key={v.name}
                    style={{ display: "grid", gridTemplateColumns: "1fr 140px 80px", alignItems: "center", gap: 12, padding: "12px 20px 12px 40px", borderBottom: i < gvaults.length - 1 ? "1px solid #141414" : "none", opacity: empty ? 0.3 : 1 }}
                    onMouseEnter={(e) => {
                      if (!empty) e.currentTarget.style.background = "#131313";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 1, height: 13, background: "#252525" }} />
                      <span style={{ color: empty ? "#9AA4AF" : "#888", ...M, fontSize: 14 }}>{v.name}</span>
                    </div>
                    <div style={{ color: empty ? "#2E2E2E" : "#CCC", ...M, fontSize: 15, fontWeight: 600, textAlign: "right" }}>{disp(v.balance)}</div>
                    <div style={{ color: "#2E2E2E", ...M, fontSize: 13, textAlign: "right" }}>{v.balance > 0 ? `${((v.balance / TOTAL_SUPPLY) * 100).toFixed(2)}%` : ""}</div>
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Movement Log ─────────────────────────────────────────────────────────────
function MovementLogTab({ movements, mode, price }) {
  const [period, setPeriod] = useState("30d");
  const [vaultFilter, setVaultFilter] = useState("all");

  const now = new Date();
  const msOf = { "1d": 864e5, "7d": 7 * 864e5, "30d": 30 * 864e5, "90d": 90 * 864e5, all: Infinity };

  const filtered = movements.filter((m) => {
    const d = parseDuneTime(m.block_time);
    if (!d) return false;
    if (now - d > msOf[period]) return false;
    if (vaultFilter !== "all" && vaultName(m.from) !== vaultFilter && vaultName(m.to) !== vaultFilter) return false;
    return true;
  });

  const disp = (n) => (mode === "tokens" ? fmtTokens(n) : fmtUsd(n * (price || 0)));
  const typeOf = (m) => (!isVault(m.from) ? "deposit" : !isVault(m.to) ? "withdrawal" : "internal");
  const TC = { deposit: "#7CC4A4", withdrawal: "#E07B5A", internal: "#7B9ECC" };
  const TL = { deposit: "DEPOSIT", withdrawal: "WITHDRAWAL", internal: "INTERNAL" };

  const vaultNames = [...new Set(movements.flatMap((m) => [vaultName(m.from), vaultName(m.to)]).filter((n) => n && !n.includes("…")))].sort();

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <PeriodToggle value={period} onChange={setPeriod} options={[{ v: "1d", l: "24H" }, { v: "7d", l: "7D" }, { v: "30d", l: "30D" }, { v: "90d", l: "90D" }, { v: "all", l: "ALL" }]} />
        <select value={vaultFilter} onChange={(e) => setVaultFilter(e.target.value)} style={{ background: "#0D0D0D", border: "1px solid #2A3440", borderRadius: 6, color: "#888", ...M, fontSize: 13, padding: "5px 10px", cursor: "pointer" }}>
          <option value="all">All vaults</option>
          {vaultNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span style={{ marginLeft: "auto", color: "#2E2E2E", fontSize: 13, ...M }}>{filtered.length} transactions</span>
      </div>

      <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "150px 110px 1fr 1fr 130px", gap: 12, padding: "14px 20px", borderBottom: "1px solid #1A1A1A" }}>
          {["DATE", "TYPE", "FROM", "TO", "AMOUNT"].map((h) => (
            <div key={h} style={{ fontSize: 11, color: "#B0BAC5", letterSpacing: "0.1em", ...M }}>
              {h}
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#B0BAC5", ...M, fontSize: 14 }}>No movements in this period</div>
        ) : (
          filtered.map((m, i) => {
            const type = typeOf(m);
            const color = TC[type];
            return (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "150px 110px 1fr 1fr 130px", gap: 12, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #141414" : "none", ...M, fontSize: 14 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#131313")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ color: "#c0c0c0" }}>{fmtDate(m.block_time)}</div>
                <div>
                  <span style={{ color, fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", padding: "2px 6px", background: `${color}18`, borderRadius: 3 }}>{TL[type]}</span>
                </div>
                <div style={{ color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vaultName(m.from)}</div>
                <div style={{ color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vaultName(m.to)}</div>
                <div style={{ color, fontWeight: 700, textAlign: "right" }}>{disp(m.amount)}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── DEX Market Activity ──────────────────────────────────────────────────────
function DexMarketActivityTab({ daily, recentTrades }) {
  const [period, setPeriod] = useState("30d");

  const now = new Date();
  const msOf = { "7d": 7 * 864e5, "30d": 30 * 864e5, "90d": 90 * 864e5, "1y": 365 * 864e5, all: Infinity };

  const filteredDaily = daily.filter((d) => {
    const dt = parseDuneTime(d.day);
    return dt && now - dt <= msOf[period];
  });

  const totalVolUsd = filteredDaily.reduce((s, d) => s + Number(d.volume_usd || 0), 0);
  const totalBuyVol = filteredDaily.reduce((s, d) => s + Number(d.buy_volume || 0), 0);
  const totalSellVol = filteredDaily.reduce((s, d) => s + Number(d.sell_volume || 0), 0);

  const dexChange24h = (() => {
    const s = [...filteredDaily]
      .map((d) => ({
        t: parseDuneTime(d.day),
        px: Number(d.vwap || d.high || 0),
      }))
      .filter((x) => x.t && x.px > 0)
      .sort((a, b) => a.t - b.t);

    if (s.length < 2) return null;
    const last = s[s.length - 1].px;
    const prev = s[s.length - 2].px;
    if (prev <= 0) return null;
    return ((last / prev) - 1) * 100;
  })();

  const avgPrice = (() => {
    const rows = filteredDaily.filter((d) => Number(d.vwap || 0) > 0);
    if (rows.length === 0) return 0;
    const totalUsd = rows.reduce((s, d) => s + Number(d.volume_usd || 0), 0);
    const totalAuki = rows.reduce((s, d) => s + Number(d.buy_volume || 0) + Number(d.sell_volume || 0), 0);
    return totalAuki > 0 ? totalUsd / totalAuki : 0;
  })();

  const chart = [...filteredDaily]
    .map((d) => ({ ...d, _t: parseDuneTime(d.day) }))
    .filter((d) => d._t)
    .sort((a, b) => a._t - b._t);

  const prices = chart.map((d) => Number(d.vwap || d.high || 0)).filter((p) => p > 0);
  const maxP = Math.max(...prices, 0.001);
  const minP = Math.min(...prices, maxP);
  const range = maxP - minP || maxP * 0.1 || 0.001;
  const H = 110;

  const filteredTrades = recentTrades.filter((t) => {
    const d = parseDuneTime(t.block_time);
    return d && now - d <= msOf[period];
  });

  return (
    <div>
      <div style={{ fontSize: 12, color: "#B0BAC5", letterSpacing: "0.12em", ...M, marginBottom: 10 }}>DECENTRALISED EXCHANGE (ON-CHAIN · BASE)</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <PeriodToggle value={period} onChange={setPeriod} options={[{ v: "7d", l: "7D" }, { v: "30d", l: "30D" }, { v: "90d", l: "90D" }, { v: "1y", l: "1Y" }, { v: "all", l: "ALL" }]} />
        <span style={{ marginLeft: "auto", color: "#2E2E2E", fontSize: 13, ...M }}>{filteredDaily.length} days · Uniswap · Aerodrome · PancakeSwap</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
        {[
          { l: "24H PRICE CHANGE", v: dexChange24h == null ? "—" : `${dexChange24h.toFixed(2)}%`, a: dexChange24h == null ? "#F0ECE3" : dexChange24h >= 0 ? "#7CC4A4" : "#E07B5A" },
          { l: "AVG PRICE", v: avgPrice ? fmtPrice(avgPrice) : "—", a: "#C8A96E" },
          { l: "VOLUME (USD)", v: fmtUsd(totalVolUsd), a: "#F0ECE3" },
          { l: "BUY VOLUME", v: fmtTokens(totalBuyVol), a: "#7CC4A4" },
          { l: "SELL VOLUME", v: fmtTokens(totalSellVol), a: "#E07B5A" },
        ].map((c) => (
          <div key={c.l} style={{ background: "#111", border: "1px solid #2A3440", borderRadius: 8, padding: "18px 20px" }}>
            <div style={{ color: "#444", fontSize: 12, letterSpacing: "0.12em", ...M, marginBottom: 6 }}>{c.l}</div>
            <div style={{ color: c.a, fontSize: 19, fontWeight: 700, ...M }}>{c.v}</div>
          </div>
        ))}
      </div>

      {chart.length > 1 && (
        <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#B0BAC5", letterSpacing: "0.1em", ...M, marginBottom: 12 }}>PRICE (AUKI / USD) — DAILY VWAP</div>
          <div style={{ position: "relative" }}>
            <svg width="100%" height={H} viewBox={`0 0 800 ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8A96E" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const validChart = chart.filter((d) => Number(d.vwap || 0) > 0);
                if (validChart.length < 2) return null;
                const pts = validChart.map((d, i) => ({
                  x: (i / (validChart.length - 1)) * 800,
                  y: H - (((Number(d.vwap) - minP) / range) * (H - 15)) - 5,
                }));
                const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
                return (
                  <>
                    <path d={`${line} L800,${H} L0,${H} Z`} fill="url(#pg)" />
                    <path d={line} fill="none" stroke="#C8A96E" strokeWidth="1.5" />
                  </>
                );
              })()}
            </svg>
            <div style={{ position: "absolute", right: 0, top: 0, fontSize: 12, color: "#c0c0c0", ...M }}>{fmtPrice(maxP)}</div>
            <div style={{ position: "absolute", right: 0, bottom: 0, fontSize: 12, color: "#c0c0c0", ...M }}>{fmtPrice(minP)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {[chart[0], chart[Math.floor(chart.length / 2)], chart[chart.length - 1]].filter(Boolean).map((d, i) => (
              <div key={i} style={{ fontSize: 12, color: "#444", ...M }}>{fmtDateShort(d.day)}</div>
            ))}
          </div>
        </div>
      )}

      {(totalBuyVol + totalSellVol) > 0 && (
        <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, padding: "14px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#B0BAC5", letterSpacing: "0.1em", ...M, marginBottom: 10 }}>BUY / SELL PRESSURE</div>
          <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(totalBuyVol / (totalBuyVol + totalSellVol)) * 100}%`, background: "#7CC4A4" }} />
            <div style={{ flex: 1, background: "#E07B5A" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ ...M, fontSize: 12, color: "#7CC4A4" }}>▲ BUY {((totalBuyVol / (totalBuyVol + totalSellVol)) * 100).toFixed(1)}% · {fmtTokens(totalBuyVol)}</span>
            <span style={{ ...M, fontSize: 12, color: "#E07B5A" }}>SELL {((totalSellVol / (totalBuyVol + totalSellVol)) * 100).toFixed(1)}% · {fmtTokens(totalSellVol)} ▼</span>
          </div>
        </div>
      )}

      <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 110px 110px 120px 120px 80px 120px", gap: 12, padding: "14px 20px", borderBottom: "1px solid #1A1A1A" }}>
          {["DATE", "LOW", "HIGH", "BUY VOL", "SELL VOL", "TRADES", "VOLUME (USD)"].map((h) => (
            <div key={h} style={{ fontSize: 11, color: "#B0BAC5", letterSpacing: "0.1em", ...M }}>
              {h}
            </div>
          ))}
        </div>
        {[...filteredDaily].reverse().slice(0, 1000).map((d, i, arr) => (
          <div
            key={i}
            style={{ display: "grid", gridTemplateColumns: "120px 110px 110px 120px 120px 80px 120px", gap: 12, padding: "12px 20px", borderBottom: i < arr.length - 1 ? "1px solid #141414" : "none", ...M, fontSize: 14 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#131313")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ color: "#c0c0c0" }}>{fmtDateShort(d.day)}</div>
            <div style={{ color: "#E07B5A" }}>{fmtPrice(d.low)}</div>
            <div style={{ color: "#7CC4A4" }}>{fmtPrice(d.high)}</div>
            <div style={{ color: "#7CC4A4" }}>{fmtTokens(d.buy_volume)}</div>
            <div style={{ color: "#E07B5A" }}>{fmtTokens(d.sell_volume)}</div>
            <div style={{ color: "#444" }}>{d.trade_count}</div>
            <div style={{ color: "#C8A96E" }}>{fmtUsd(d.volume_usd)}</div>
          </div>
        ))}
      </div>

      {filteredTrades.length > 0 && (
        <div style={{ background: "#0F0F0F", border: "1px solid #2A3440", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #1A1A1A", fontSize: 12, color: "#B0BAC5", letterSpacing: "0.1em", ...M }}>RECENT INDIVIDUAL DEX TRADES</div>
          <div style={{ display: "grid", gridTemplateColumns: "70px 150px 70px 140px 120px 110px", gap: 12, padding: "14px 20px", borderBottom: "1px solid #1A1A1A" }}>
            {["ICON", "DATE", "TYPE", "AUKI AMOUNT", "USD VALUE", "PRICE / AUKI"].map((h) => (
              <div key={h} style={{ fontSize: 11, color: "#B0BAC5", letterSpacing: "0.1em", ...M }}>
                {h}
              </div>
            ))}
          </div>
          {filteredTrades.slice(0, 100).map((t, i) => {
            const buy = t.trade_type === "buy";
            const color = buy ? "#7CC4A4" : "#E07B5A";
            return (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "70px 150px 70px 140px 120px 110px", gap: 12, padding: "12px 20px", borderBottom: i < Math.min(filteredTrades.length, 100) - 1 ? "1px solid #141414" : "none", ...M, fontSize: 14 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#131313")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>{getTradeSizeIcon(t.amount_usd)}</div>
                <div style={{ color: "#c0c0c0" }}>{fmtDate(t.block_time)}</div>
                <div>
                  <span style={{ color, fontSize: 12, fontWeight: 700, padding: "2px 6px", background: `${color}18`, borderRadius: 3 }}>{buy ? "BUY" : "SELL"}</span>
                </div>
                <div style={{ color, fontWeight: 700 }}>{fmtTokens(t.auki_amount)}</div>
                <div style={{ color: "#666" }}>{fmtUsd(t.amount_usd)}</div>
                <div style={{ color: "#c0c0c0" }}>{fmtPrice(t.price_per_auki)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── CEX Market Activity ──────────────────────────────────────────────────────
function CexMarketActivityTab({ ticker, tickerLoading, tickerError, tickerRefresh, tickerTs, recentTrades, tradesLoading, tradesError, tradesTs, daily, dailyLoading, dailyError }) {
  const priceChange24h = ticker?.priceChangePercent != null ? parseFloat(ticker.priceChangePercent) * 100 : null;
  const cexVol24hUsd = ticker?.quoteVolume ? parseFloat(ticker.quoteVolume) : 0;

  return (
    <div>
      <div style={{ fontSize: 12, color: "#B0BAC5", letterSpacing: "0.12em", ...M, marginBottom: 10 }}>CENTRALISED EXCHANGE</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
        <div style={{ background: "#111", border: "1px solid #2A3440", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ color: "#444", fontSize: 12, letterSpacing: "0.12em", ...M, marginBottom: 6 }}>24H PRICE CHANGE</div>
          <div style={{ color: priceChange24h == null ? "#F0ECE3" : priceChange24h >= 0 ? "#7CC4A4" : "#E07B5A", fontSize: 19, fontWeight: 700, ...M }}>
            {priceChange24h == null ? "—" : `${priceChange24h.toFixed(2)}%`}
          </div>
        </div>

        <div style={{ background: "#111", border: "1px solid #2A3440", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ color: "#444", fontSize: 12, letterSpacing: "0.12em", ...M, marginBottom: 6 }}>24H VOLUME (USDT)</div>
          <div style={{ color: "#F0ECE3", fontSize: 19, fontWeight: 700, ...M }}>{fmtUsd(cexVol24hUsd)}</div>
        </div>

        <div style={{ background: "#111", border: "1px solid #2A3440", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ color: "#444", fontSize: 12, letterSpacing: "0.12em", ...M, marginBottom: 6 }}>MARKET</div>
          <div style={{ color: "#C8A96E", fontSize: 19, fontWeight: 700, ...M }}>{MEXC_SYMBOL}</div>
        </div>
      </div>

      <MexcSection ticker={ticker} loading={tickerLoading} error={tickerError} onRefresh={tickerRefresh} ts={tickerTs} />

{/* CEX DAILY SUMMARY */}

{daily && daily.length > 0 && (
  <div style={{ marginTop:18, marginBottom:18 }}>
    <div style={{ fontSize:12, color:"#B0BAC5", letterSpacing:"0.12em", marginBottom:10 }}>
      CEX DAILY SUMMARY (MEXC)
    </div>

    <div style={{
      display:"grid",
      gridTemplateColumns:"120px 110px 110px 120px 140px",
      gap:12,
      padding:"14px 20px",
      borderBottom:"1px solid #1A1A1A"
    }}>
      {["DATE","LOW","HIGH","CLOSE","VOLUME (USD)"].map(h=>(
        <div key={h} style={{ fontSize:11, color:"#B0BAC5", letterSpacing:"0.1em", ...M }}>{h}</div>
      ))}
    </div>

    {daily.slice(-100).reverse().map((d,i)=>(
      <div key={i}
        style={{
          display:"grid",
          gridTemplateColumns:"120px 110px 110px 120px 140px",
          gap:12,
          padding:"12px 20px",
          borderBottom:"1px solid #141414",
          ...M,
          fontSize:14
        }}
      >
        <div style={{ color:"#c0c0c0" }}>{fmtDateShort(d.day)}</div>
        <div style={{ color:"#E07B5A" }}>{fmtPrice(d.low)}</div>
        <div style={{ color:"#7CC4A4" }}>{fmtPrice(d.high)}</div>
        <div style={{ color:"#F0ECE3" }}>{fmtPrice(d.close)}</div>
        <div style={{ color:"#C8A96E" }}>{fmtUsd(d.volume_usd)}</div>
      </div>
    ))}
  </div>
)}

<MexcTradesPanel trades={recentTrades} loading={tradesLoading} error={tradesError} ts={tradesTs} />
      <MexcTradesPanel trades={recentTrades} loading={tradesLoading} error={tradesError} ts={tradesTs} />
    </div>
  );
}

// ─── Password protection ──────────────────────────────────────────────────────
const PASS_HASH = "c31f17e44c846952aa7a6a97b78bdab5739192a2a5c1baff95d24f7c95cdea7b";

async function hashPassword(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function LoginScreen({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const attempt = async () => {
    setChecking(true);
    setError(false);
    const hash = await hashPassword(pw);
    if (hash === PASS_HASH) {
      sessionStorage.setItem("auki_auth", "1");
      onAuth();
    } else {
      setError(true);
      setPw("");
    }
    setChecking(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace" }}>
      <div style={{ width: 320, padding: "40px 36px", background: "#111", border: "1px solid #2A3440", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#C8A96E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#0D0D0D", fontSize: 19, fontWeight: 900 }}>A</span>
          </div>
          <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "0.1em", color: "#CCC" }}>AUKI TREASURY</span>
        </div>
        <div style={{ fontSize: 12, color: "#444", letterSpacing: "0.12em", marginBottom: 10 }}>ACCESS CODE</div>
        <input
          type="password"
          value={pw}
          autoFocus
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && pw && attempt()}
          placeholder="Enter password"
          style={{ width: "100%", background: "#0D0D0D", border: `1px solid ${error ? "#E07B5A" : "#2A2A2A"}`, borderRadius: 6, padding: "10px 14px", color: "#F0ECE3", fontFamily: "'JetBrains Mono',monospace", fontSize: 15, outline: "none", marginBottom: 8, boxSizing: "border-box" }}
        />
        {error && <div style={{ color: "#E07B5A", fontSize: 13, marginBottom: 8 }}>Incorrect password</div>}
        <button
          onClick={attempt}
          disabled={checking || !pw}
          style={{ width: "100%", background: "#C8A96E", border: "none", borderRadius: 6, padding: "10px", color: "#0D0D0D", fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", cursor: pw ? "pointer" : "not-allowed", opacity: pw ? 1 : 0.5, marginTop: 4 }}
        >
          {checking ? "CHECKING..." : "ENTER"}
        </button>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AukiTreasury() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("auki_auth"));

  const [mode, setMode] = useState("tokens");
  const [activeTab, setActiveTab] = useState("balances");

  const [price, setPrice] = useState(null);
  const [priceTs, setPriceTs] = useState(null);
  const [priceState, setPriceState] = useState("loading");

  const [balances, setBalances] = useState({});
  const [movements, setMovements] = useState([]);
  const [trades, setTrades] = useState([]);
  const [daily, setDaily] = useState([]);

  const [mexcTicker, setMexcTicker] = useState(null);
  const [mexcDaily, setMexcDaily] = useState([]);
  const [mexcDailyTs, setMexcDailyTs] = useState(null);
  const [mexcDailyError, setMexcDailyError] = useState("");
  const [mexcDailyLoading, setMexcDailyLoading] = useState(true); 
  const [mexcTs, setMexcTs] = useState(null);
  const [mexcError, setMexcError] = useState("");

  const [mexcRecentTrades, setMexcRecentTrades] = useState([]);
  const [mexcRecentTradesTs, setMexcRecentTradesTs] = useState(null);
  const [mexcRecentTradesError, setMexcRecentTradesError] = useState("");

  const [loading, setLoading] = useState({
    balances: true,
    movements: true,
    trades: true,
    daily: true,
    mexc: true,
    mexcTrades: true,
  });

  const [lastRefresh, setLastRefresh] = useState(null);

  const doFetchPrice = useCallback(async () => {
    setPriceState("loading");
    const result = await fetchAukiPrice();
    setPrice(result.price);
    setPriceTs(new Date());
    setPriceState(result.source);
  }, []);

  const doFetchMexc = useCallback(async () => {
    setLoading((p) => ({ ...p, mexc: true }));
    const result = await fetchMexcTicker();
    if (result.data) {
      setMexcTicker(result.data);
      setMexcTs(new Date());
      setMexcError("");
    } else {
      setMexcTicker(null);
      setMexcError(result.error || "MEXC fetch failed");
    }
    setLoading((p) => ({ ...p, mexc: false }));
  }, []);

  const doFetchMexcRecentTrades = useCallback(async () => {
    setLoading((p) => ({ ...p, mexcTrades: true }));
    const result = await fetchMexcRecentTrades(60);
    if (result.data) {
      setMexcRecentTrades(result.data);
      setMexcRecentTradesTs(new Date());
      setMexcRecentTradesError("");
    } else {
      setMexcRecentTrades([]);
      setMexcRecentTradesError(result.error || "MEXC recent trades fetch failed");
    }
    setLoading((p) => ({ ...p, mexcTrades: false }));
  }, []);

  const refreshAll = useCallback(() => {
    doFetchPrice();
    doFetchMexc();
    doFetchMexcRecentTrades();

    setMexcDailyLoading(true);

    fetchMexcDaily().then(result => {
      if (result.data) {
        setMexcDaily(result.data);
        setMexcDailyTs(new Date());
        setMexcDailyError("");
      } else {
        setMexcDaily([]);
        setMexcDailyError(result.error || "CEX daily fetch failed");
      }
      setMexcDailyLoading(false);
    });

    fetchDune(QUERY_BALANCES)
      .then((rows) => {
        const map = {};
        rows.forEach((r) => {
          const n = ADDR_TO_VAULT[r.address?.toLowerCase()];
          if (n) map[n] = r.balance;
        });
        setBalances(map);
        setLoading((p) => ({ ...p, balances: false }));
      })
      .catch(() => setLoading((p) => ({ ...p, balances: false })));

    fetchDune(QUERY_MOVEMENTS)
      .then((rows) => {
        setMovements(rows);
        setLoading((p) => ({ ...p, movements: false }));
      })
      .catch(() => setLoading((p) => ({ ...p, movements: false })));

    fetchDune(QUERY_TRADES)
      .then((rows) => {
        setTrades(rows);
        setLoading((p) => ({ ...p, trades: false }));
      })
      .catch(() => setLoading((p) => ({ ...p, trades: false })));

    fetchDune(QUERY_DAILY)
      .then((rows) => {
        setDaily(rows);
        setLoading((p) => ({ ...p, daily: false }));
        setLastRefresh(new Date());
      })
      .catch(() => setLoading((p) => ({ ...p, daily: false })));
  }, [doFetchPrice, doFetchMexc, doFetchMexcRecentTrades]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    const id = setInterval(() => {
      doFetchMexc();
      doFetchMexcRecentTrades();
    }, 30000);
    return () => clearInterval(id);
  }, [doFetchMexc, doFetchMexcRecentTrades]);

  const totalHeld = useMemo(() => Object.values(balances).reduce((s, v) => s + Number(v || 0), 0), [balances]);
  const activeCount = useMemo(() => Object.values(balances).filter((v) => Number(v || 0) > 0).length, [balances]);

  const dp = price || 0;

  const trades24h = useMemo(() => {
    return trades.filter((t) => {
      const d = parseDuneTime(t.block_time);
      return d && Date.now() - d.getTime() < 864e5;
    });
  }, [trades]);

  const dexVol24hUsd = useMemo(() => trades24h.reduce((s, t) => s + Number(t.amount_usd || 0), 0), [trades24h]);

  const mexcVol24hUsd = useMemo(() => {
    if (!mexcTicker?.quoteVolume) return 0;
    const q = parseFloat(mexcTicker.quoteVolume);
    return Number.isFinite(q) ? q : 0;
  }, [mexcTicker]);

  const priceChange24h = useMemo(() => {
    if (!mexcTicker?.priceChangePercent) return null;
    const p = parseFloat(mexcTicker.priceChangePercent);
    return Number.isFinite(p) ? p * 100 : null;
  }, [mexcTicker]);

  const supplyPieData = useMemo(() => {
    const vaultSegments = VAULT_GROUPS.map((g) => {
      const tot = g.vaults.reduce((s, n) => s + Number(balances[n] || 0), 0);
      const pct = (tot / TOTAL_SUPPLY) * 100;
      return { label: g.label, pct, color: g.color };
    });

    const vaultPct = vaultSegments.reduce((s, x) => s + (x.pct || 0), 0);
    const distributedPct = Math.max(0, 100 - vaultPct);

    return [...vaultSegments, { label: "Distributed", pct: distributedPct, color: "#2f2f2f" }].map((x) => ({
      ...x,
      pct: Number.isFinite(x.pct) ? x.pct : 0,
    }));
  }, [balances]);

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F14", color: "#F0ECE3", ...M }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} *{box-sizing:border-box}`}</style>

      <div style={{ borderBottom: "1px solid #161616", padding: "13px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#080808", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: "#C8A96E", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#0D0D0D", fontSize: 14, fontWeight: 900 }}>A</span>
            </div>
            <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "0.1em", color: "#CCC" }}>AUKI TREASURY</span>
          </div>
          <span style={{ color: "#222" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7CC4A4", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, color: "#9AA4AF", letterSpacing: "0.08em" }}>LIVE · BASE BLOCKCHAIN</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {priceState === "loading" ? (
            <span style={{ color: "#444", fontSize: 13 }}>FETCHING…</span>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {priceState === "est" && <span style={{ color: "#FF6B6B", fontSize: 12, ...M }}>EST</span>}
              <span style={{ fontSize: 15, color: "#C8A96E", fontWeight: 700, ...M }}>${price?.toFixed(5)}</span>
              {priceTs && <span style={{ color: "#9FB0C3", fontSize: 12, ...M }}>{priceTs.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
              <button onClick={doFetchPrice} title="Refresh price" style={{ background: "none", border: "1px solid #222", borderRadius: 4, color: "#444", fontSize: 12, padding: "2px 6px", cursor: "pointer", ...M }}>↻</button>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#B0BAC5", fontSize: 12, ...M }}>
              LAST UPDATED: {lastRefresh ? lastRefresh.toLocaleString("en-GB") : "—"}
            </div>

            <button
              onClick={refreshAll}
              style={{
                background: "none",
                border: "1px solid #222",
                borderRadius: 6,
                color: "#C0C0C0",
                fontSize: 12,
                padding: "6px 10px",
                cursor: "pointer",
                ...M,
              }}
            >
              REFRESH
            </button>
          </div>

          <Toggle value={mode} onChange={setMode} />
        </div>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "1700px",
        margin: "0 auto",
        padding: "26px 40px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          marginBottom: 22
        }}>
          <StatCard label="Total Supply" value="10.000B" sub="Max supply · minted Aug 2024" loading={false} />
          <StatCard label="Held in Vaults" value={mode === "tokens" ? fmtTokens(totalHeld) : fmtUsd(totalHeld * dp)} sub={`${((totalHeld / TOTAL_SUPPLY) * 100).toFixed(2)}% · ${activeCount} active vaults`} accent="#C8A96E" loading={loading.balances} />
          <StatCard label="24H DEX Volume" value={fmtUsd(dexVol24hUsd)} sub={`${trades24h.length} on-chain trades`} loading={loading.trades} />
          <StatCard label="24H CEX Volume" value={loading.mexc ? "…" : fmtUsd(mexcVol24hUsd)} sub={mexcError ? `MEXC: ${mexcError}` : mexcTicker ? `MEXC ${MEXC_SYMBOL} · quote vol` : "MEXC unavailable"} accent="#C8A96E" loading={false} />
          <StatCard
            label="24H PRICE CHANGE"
            value={priceChange24h === null ? "—" : `${priceChange24h.toFixed(2)}%`}
            sub={`MEXC ${MEXC_SYMBOL}`}
            accent={priceChange24h === null ? "#F0ECE3" : priceChange24h >= 0 ? "#7CC4A4" : "#E07B5A"}
          />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 18
        }}>

          <div style={{ background: "#111", border: "1px solid #2A3440", borderRadius: 12, padding: "18px 22px" }}>
            <div style={{ fontSize: 16, color: "#B0BAC5", letterSpacing: "0.1em", marginBottom: 10 }}>
              AUKI SUPPLY ALLOCATION
            </div>
            <SupplyAllocationPie totalsByGroup={supplyPieData} />
          </div>

<div style={{ background: "#111", border: "1px solid #2A3440", borderRadius: 12, padding: "18px 22px" }}>
  <div style={{ fontSize: 16, color: "#B0BAC5", letterSpacing: "0.1em", marginBottom: 14 }}>
    MARKET SNAPSHOT
  </div>

  <div style={{ display: "flex", flexDirection: "column", gap: 12, ...M }}>

    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <span style={{ color:"#9AA4AF" }}>DEX SHARE</span>
      <span style={{ color:"#7CC4A4", fontWeight:600 }}>
        {((dexVol24hUsd / (dexVol24hUsd + mexcVol24hUsd)) * 100).toFixed(1)}%
      </span>
    </div>

    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <span style={{ color:"#9AA4AF" }}>CEX SHARE</span>
      <span style={{ color:"#C8A96E", fontWeight:600 }}>
        {((mexcVol24hUsd / (dexVol24hUsd + mexcVol24hUsd)) * 100).toFixed(1)}%
      </span>
    </div>

    <div style={{ borderTop:"1px solid #1E1E1E", margin:"6px 0" }} />

    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <span style={{ color:"#9AA4AF" }}>24H TOTAL VOLUME</span>
      <span style={{ color:"#F0ECE3", fontWeight:600 }}>
        {fmtUsd(dexVol24hUsd + mexcVol24hUsd)}
      </span>
    </div>

  </div>
</div>
        </div>

        <div style={{ display: "flex", marginBottom: 16, borderBottom: "1px solid #161616" }}>
          {[
            ["balances", "VAULT BALANCES"],
            ["movements", "MOVEMENT LOG"],
            ["dex", "DEX MARKET ACTIVITY"],
            ["cex", "CEX MARKET ACTIVITY"],
          ].map(([id, lbl]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === id ? "2px solid #C8A96E" : "2px solid transparent",
                color: activeTab === id ? "#C8A96E" : "#9AA4AF",
                ...M,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
                padding: "9px 20px 9px 0",
                marginRight: 18,
                cursor: "pointer",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        {activeTab === "balances" && (loading.balances ? <Loader msg="FETCHING VAULT BALANCES…" /> : <VaultBalancesTab balances={balances} mode={mode} price={dp} />)}
        {activeTab === "movements" && (loading.movements ? <Loader msg="FETCHING MOVEMENT LOG…" /> : <MovementLogTab movements={movements} mode={mode} price={dp} />)}
        {activeTab === "dex" && (loading.daily ? <Loader msg="FETCHING DEX MARKET DATA…" /> : <DexMarketActivityTab daily={daily} recentTrades={trades} />)}
        {activeTab === "cex" && (
          <CexMarketActivityTab
            ticker={mexcTicker}
            tickerLoading={loading.mexc}
            tickerError={mexcError}
            tickerRefresh={doFetchMexc}
            tickerTs={mexcTs}
            recentTrades={mexcRecentTrades}
            tradesLoading={loading.mexcTrades}
            tradesError={mexcRecentTradesError}
            tradesTs={mexcRecentTradesTs}
            daily={mexcDaily}
            dailyLoading={mexcDailyLoading}
            dailyError={mexcDailyError}
          />
        )}
      </div>
    </div>
  );
}