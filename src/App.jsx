import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const AUKI_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABgCAYAAABlqZ4+AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAI8klEQVR42u2dbYxcZRmGr3vmbFtKPwRTJBAEok0sgpoQTI2lFBWqYNOIhoJgEwPBYpRG0x8o0UiiYGJIiCVKQ2xCIBJAQhOsYPkqpSZKIvzQH2pSUNNEaprQbj8o3Zm5/THPSw91Z2Z3ds58tOdNNpvszp7zvtec936e5z7PnJXts4HHgXlAHRDl6DQMVIG3gesyYBZwAbAQqJUQpwwxAw4CY1n84B3gSAlx2hDfAZzFD3XcVzk6j3dZVUoWMx8lxBJiCfGkhliJ6OQTMOK6GyaVLl5/MML7WCTnJ8Kox3rGgEPT5TKdFzeAOcBrwPWRrZ8aueUoj1qs4yhwI/CnWGe9CIhp+86R9CTwGeAfwAJgYoQBLgB2AZ+V9HgALFwTG7arkl4FLgW2RslYHyGddMx3AbANuFTSK7arseOKj86S6rYzSXuBVcA9wPw4XmPIATai0pgP/By4WtKeWE9XGj+TFKduu9Jkqg3ATWm7D7FO1oDZse51ktbn1tF1kJxRniipAdj2mKTNwJXA7tgmtSEEuAB4E/iCpE120zuIdQwu2ZZkSROxHXaGTr4YEx4GnXQO4M7Qv+0x35qkGc+vZxWLpFpMbDewEtgUuqMB6mQ67wJgM3CFpH8lgENZ9gXIClCTtA64LRLY2QNIzOs0Dec5wAZJN0k6YrvSS4CF1M5JXyIN2gh8EdgbV2W/dHIizrcPWC3pHttV25qp/vXNgAidTGnQttDJV3IBp0idrEXe+ipwmaStKX3phf713cWJ7V2VtCsqnIcDJAXoZCO+FgCPAZdL+luv9a/vEHOJeUXSIUlfA+4A5vbYwKiHKTIP+JGkNZLGi9C/gUBMOmlbcVXeBXw53JJ5Pai7k4HwDrBG0p22KwGwL1lBzyEGrEobnRwLA2MF8FeO3aqdSQL999i+j8XxG5MBDLgaeogBqzEZyPh9Ssz/AlwGbOkiMc8bCFuB5ZJei+NOtHhzKwHXQwsxvcO2L7J9QYDMOgSctyR9CfhpzsDopJONeN38MD5WSdobx6u1mFsW8/mI7Y/n5ztsV2I61mJgu+3LUxUz2YRTwIkr5HvA2gA4t832ruX8vpvD+FAco95CWrKYx3LgJWBJr9deRGA5CCwCttq+NV0dLXQyGRiZpIeAK4A3mNzoTfq3O8q3X4X/51b6l7vqvwE8DZwBHBiF6FzNadYvbG8EqrGdqi00tBYB4Y+RmD/LMaO3kQO4PQyEP8TrJ02gY2s3gIrte4H74zipEWkkUpxkOhwAvgU8bfvMVMW0CThVSW8CVwH3he5lAXATsFLS7g4BJIvzfAD4HbA+5pHM2JHKEyvxru8HPgfstP2pdNW1S8yBuqRvA98ExoHbJK2TdLRdAp3Tv0uAl8Pf3B/zUJELLXqMBYjzgGdtr42rrtJGJ1NK8kvgIkkbI0iohf6l4FKzfSPwAvChOO/YCVGxxJY8HOd70PbdKSFuo5ONAPPf+O42+pde/xPgobjyDsV5OVEgpoCTdPJ221tsn95BJxvt7KsAWLf9PttPAN+P7KBRRAAZBogp4CSdXA28ZPui2IZqVQG1Su4D4IXADuCa2L4V+txjOaiGpqSTHwWet309kLUqFVvkgJntNcDzwIXxxmSDWMwgu8Iyms7zIuD2qFTcqRyL3xs4Jf7ujDjO2KAWMiiIKRk/DXgCWCFpf7vte/z2ljQOXE7zkw+n5UzZkwJiPXRxPnCXpK9Ieis0bkoOiyTH6/dJuhb4cXiTGQPoVOs3xFrOYFgr6Y7k8bVIX5RuMLUCGenPD4AbaHZ2zaXPjQP9hDgR5dvrNDuwHkoWVQuAKTesB7BKm3wyk/RrmvdxdtHnTrVKH/VvIc0OrOXRgZW1Kd+SYTHL9i2257ZKzHNOTSbpz8By4Bn62KlWNMR8B9Z9NDuw3uwAMBkIZwG/DeNhq+0PdkjME8g9wNXAvfSpU61SsP7NjiByaxgKjVYGwnEG6tIwEK6I9GUFsMP2sg5Gby3nI34HuCXexEI71YqCmLbvHuDzku7vYKAKSAbCWuA54NxIyGfF97OBbbZvjjdBHYzeqqQHaPYF/SfSoPqoQEx1605gWa4Dq97BQKjbvht4MOZ1OFeBZDQ/ewjwgO17crV1KwMjdWDsAJbRNHSrRWhkERBPAR4FrowOrOoU9O/9trdEBXKghYFQyRkY3wWesr1oCjpZlfTvuCIfifkNJ8TcjaIXJV2X68CqdzBQP0bzBtLq2LbtDNS8gXEV8LLti5NOtppXzOOopK9GhkC3rcV9uRIl7c8l0K0M1Gos/JrYZksC4FQNhGRgLAZesH1dCiotAk4jZ+ruG/rtnOBNQf/uAH4TFUY3BmoWfzcLeMT2nem8bXTSI9MB0UH/TrX9cNS7h6Oy6NZArUbqchD4oe1HbS/soJMjEVgmAzgW2+3DNPu5b4jt2Is5JBN2HLiWZuPAknY3xEYKYk7/JmyvjAT6kpz+9WprKY43DnyCpmO+Kt2GLWIL9wVi7jMuddvrgaeA06cZQKY7skiBFgJP2t6QovBUXfOhgZjrQMhsb4o6diKsqqIt/Gqc5wjwM9ubgdntDIxhjM6VuPrOAX4f9esBuvws8QzXNQ58HXjO9rm55oDhhZh6AG0vo3kHbsUUEuiiRl4nP02zA2NFu97JgUOMidn2xVEVnFOw/k1HJ8eBM4FnbC/tNcheviPJ4j8r6tNDQwDw+MR8dsyPXu6MIjRqos/6N521mgJuG1QK0qJhfcpTIXMrH+lSQiwhlhDLUUIsIZYQS4jlKCGWEEuIJcRylBBLiCXEEmI5SoglxBJiCbEcJcQS4skEMX3K8z3Nkrke6FF4RPT/9Wzn1jPtJlDZPo/3PiBSbeBVaXalvt7mmPOB84cQZpr/PznWYDrZOD/WUO/AInVVLJ1Om0d61s084JNtXlen+Ri+YRtp/otp3958hGk+QyfrcjscHGGtfXsKsKfVJdFtw9EoB6TK0B+wjM7lKCEOamS5kH0i/t+pItOld3mlz5LM4dgHq8v/IDk1iOnJJ8oC3BuU/1W3m8T9MDCh+GzH3BJe1zAP/w9W4duyeyNN+QAAAABJRU5ErkJggg=="; // boxed rune mark, white on transparent, embedded (no external dependency)
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
  // MEXC v3 priceChangePercent is treated as a FRACTION (0.0345 = 3.45%) and scaled x100
  // for display. All three call sites in this file share that convention. TODO(dev):
  // confirm once against a live /api/v3/ticker/24hr response; if the API in fact returns
  // whole percent ("5.000" = 5%), remove the x100 at all three sites together.
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
                key={`${m.block_time}-${m.from}-${m.to}`}
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
                key={`${t.block_time}-${t.auki_amount}-${t.trade_type}`}
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
      <div key={d.day}
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
    </div>
  );
}

// ─── Monte Carlo Simulation ──────────────────────────────────────────────────
// 10 variables chosen by the AUKI team:
// 1. CEX Coverage Score (1–10)         — exchange reach, institutional access
// 2. DEX Daily Volume ($)              — organic on-chain trading baseline
// 3. Liquidity Depth ($)               — USD within ±2% of mid-price
// 4. Network Economic Activity ($)     — real ecosystem value → burn driver
// 5. Unlock Sell Pressure (%)          — % of vested tokens sold immediately
// 6. Network Usage Growth (%/mo)       — adoption / utility expansion
// 7. Active Wallet Growth (%/mo)       — ecosystem expansion proxy
// 8. Buy/Sell Imbalance (ratio)        — >1 = net accumulation, <1 = distribution
// 9. BTC Correlation (0–1)             — broader crypto market beta
// 10. 30-Day Volatility (%)            — rolling price uncertainty

const MC_DEFLATION_FLOOR = 5_000_000_000;
const MC_TGE_DATE = new Date("2024-08-28");

const MC_ALLOCATIONS = [
  { name: "Seed & Pre-Seed", tokens: 460_000_000, vestMonths: 48, cliffMonths: 0 },
  { name: "Early Bird", tokens: 438_000_000, vestMonths: 36, cliffMonths: 0 },
  { name: "Pre-sale 1", tokens: 818_000_000, vestMonths: 36, cliffMonths: 0 },
  { name: "Pre-sale 2", tokens: 273_000_000, vestMonths: 24, cliffMonths: 0 },
  { name: "KOL Pre-sale", tokens: 34_000_000, vestMonths: 12, cliffMonths: 0 },
  { name: "Community Pre-sale", tokens: 15_000_000, vestMonths: 12, cliffMonths: 0 },
  { name: "Advisors", tokens: 230_000_000, vestMonths: 24, cliffMonths: 0 },
  { name: "Accelerator", tokens: 600_000_000, vestMonths: 42, cliffMonths: 6 },
  { name: "Team", tokens: 1_558_000_000, vestMonths: 42, cliffMonths: 6 },
  { name: "Token Infrastructure", tokens: 700_000_000, vestMonths: 0, cliffMonths: 0 },
  { name: "Ecosystem Rewards", tokens: 3_000_000_000, vestMonths: 36, cliffMonths: 0 },
  { name: "Foundation", tokens: 1_874_000_000, vestMonths: 84, cliffMonths: 0 },
];

// ─── MC Design tokens ────────────────────────────────────────────────────────
const MC = {
  gold: "#C8A96E", green: "#7CC4A4", red: "#E07B5A", blue: "#7B9ECC",
  purple: "#C47AB5", text: "#F0ECE3", dim: "#444", muted: "#9AA4AF",
  veryDim: "#2E2E2E", subtle: "#B0BAC5", card: "#111", cardBorder: "#2A3440",
  border: "#1A1A1A",
};

// ─── MC Formatters ────────────────────────────────────────────────────────────
const mcFmtB = (n) => {
  if (n == null || Number.isNaN(n)) return "—";
  const x = Math.abs(Number(n)); const sign = n < 0 ? "-" : "";
  if (x >= 1e9) return `${sign}${(x / 1e9).toFixed(2)}B`;
  if (x >= 1e6) return `${sign}${(x / 1e6).toFixed(1)}M`;
  if (x >= 1e3) return `${sign}${(x / 1e3).toFixed(0)}K`;
  return `${sign}${x.toFixed(0)}`;
};
const mcFmtUsd = (n) => {
  if (!n || Number(n) === 0) return "—";
  const x = Math.abs(Number(n)); const sign = n < 0 ? "-" : "";
  if (x >= 1e9) return `${sign}$${(x / 1e9).toFixed(2)}B`;
  if (x >= 1e6) return `${sign}$${(x / 1e6).toFixed(2)}M`;
  if (x >= 1e3) return `${sign}$${(x / 1e3).toFixed(1)}K`;
  return `${sign}$${x.toFixed(2)}`;
};
const mcFmtPrice = (n) => (n ? `$${Number(n).toFixed(5)}` : "—");
const mcFmtPct = (n) => (n != null ? `${Number(n).toFixed(1)}%` : "—");
const mcFmtMo = (n) => {
  const y = Math.floor(n / 12); const m = Math.round(n % 12);
  if (y === 0) return `${m}mo`; if (m === 0) return `${y}y`; return `${y}y ${m}mo`;
};

// ─── PRNG ─────────────────────────────────────────────────────────────────────
function mcMulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mcRandNormal(rng) {
  let u, v, s;
  do { u = rng() * 2 - 1; v = rng() * 2 - 1; s = u * u + v * v; } while (s >= 1 || s === 0);
  return u * Math.sqrt((-2 * Math.log(s)) / s);
}

// ─── Vesting ──────────────────────────────────────────────────────────────────
function mcGetVestedAtMonth(month) {
  let total = 0;
  for (const a of MC_ALLOCATIONS) {
    if (a.vestMonths === 0) { total += a.tokens; continue; }
    if (month < a.cliffMonths) continue;
    total += (Math.min(month - a.cliffMonths, a.vestMonths) / a.vestMonths) * a.tokens;
  }
  return total;
}
function mcGetNewUnlocks(month) {
  return mcGetVestedAtMonth(month) - mcGetVestedAtMonth(month - 1);
}

// ─── Simulation (13-variable engine · Rev 2) ─────────────────────────────────
// Fixes applied from independent technical review:
//   #1 burnBoost coefficient → documented supplyElasticity parameter (Var 13)
//   #2 burn efficiency → explicit burnEfficiency parameter (Var 11)
//   #3 staking → price feedback via floatSignal
//   #4 logistic growth caps for network usage + wallet growth
//   #5 separate wallet elasticities for burns, liquidity, staking
//   #6 BTC return → user-adjustable btcAnnualReturn (Var 12)
//   #7 path count → 1000 (set in MonteCarloTab)
//   #8 probability labels → "scenario frequency" (set in mcSummary + UI)

// Carrying capacity constants for logistic growth (#4)
const MC_K_ACTIVITY = 10_000_000; // $10M/mo max network economic activity
const MC_K_WALLETS = 5_000_000;   // 5M max active wallets

// Wallet elasticity exponents (#5) — sub-linear scaling
const MC_BURN_WALLET_ELASTICITY = 0.80;      // burns grow slightly slower than wallets
const MC_LIQUIDITY_WALLET_ELASTICITY = 0.50;  // liquidity is capital-constrained
const MC_STAKING_WALLET_ELASTICITY = 0.60;    // staking is incentive-dependent

// ─── ASSUMED, NOT CALIBRATED ──────────────────────────────────────────────────
// Rev 3 exposes its assumptions instead of hiding them. NONE of these is fitted
// to AUKI price history (there isn't enough of it). The diagnostics panel renders
// this object so a knowledgeable viewer can see exactly what is being assumed.
const ASSUMED_COEFFS = {
  imbalanceDriftCoeff: 0.03,   // per unit of buy/sell ratio
  volumeSignalCoeff: 0.003,    // per log-unit of volume vs $50K baseline
  floatSignalCoeff: 0.02,      // scarcity premium per unit locked
  btcAnnualVol: 0.44,          // CALIBRATED: BTC realised vol from 500d AUKI-window data
  // — regime model —
  tDegreesFreedom: 6,          // CALIBRATED: AUKI kurtosis 4.15 milder than df5; df6 fits better
  stressEntryProb: 0.05,       // P(calm → stress) per month  (~1 spell / 20mo)
  stressExitProb: 0.40,        // P(stress → calm) per month  (mean stress ≈ 2.5mo)
  stressVolMult: 1.8,          // vol multiplier while in stress
  stressDriftBias: -0.02,      // additive monthly drift drag while in stress
  stressCorrFloor: 0.85,       // BTC correlation pulled toward this in stress
  stressSellMult: 1.5,         // sell-pressure multiplier during stress (capitulation)
  // ── v1.1 structural redesign — UNCALIBRATED, illustrative defaults ──
  // Structure (liquidity) is now a MULTIPLIER on dynamics+noise+slippage, not an
  // additive drift term (§3, §3a.1). These govern how hard moves land.
  refLiquidity: 580000,        // reference depth; S = refLiquidity / effLiq
  S_MAX: 8,                    // §3a.3 hard cap on structure multiplier (anti-detonation)
  betaAmp: 0.5,                // §3a.1 gentle directional amplification (g = 1 + betaAmp·(S−1))
  liqFloorFrac: 0.20,          // §3a.2 effLiq can thin to 20% of base, never zero
  liqPriceCoupling: 0.5,       // §3a.2 k<1: liquidity follows price sub-linearly
  // Maturity crossover (§4) — fundamentals weight rises as the network scales
  wFund0: 0.25,                // illustrative starting fundamentals weight (altcoin → dynamics-led)
  wFundMax: 0.75,              // max fundamentals weight at full maturity
  crossoverGain: 1.0,          // §5 belief dial — the surface axis; 1.0 = neutral
  fundLinkage: 1.0,            // §5 fundamentals-linkage strength — the other surface axis
};

// ─── Student-t shock (fat tails) ──────────────────────────────────────────────
// Variance-normalised so the vol sliders still mean "this sigma"; df controls
// only the tail thickness. df=5 keeps real crash risk without nuking the median.
function mcRandStudentT(rng, df) {
  const z = mcRandNormal(rng);
  let w = 0;
  for (let i = 0; i < df; i++) { const g = mcRandNormal(rng); w += g * g; }
  const t = z / Math.sqrt(w / df);
  return df > 2 ? t * Math.sqrt((df - 2) / df) : t;
}

// ─── Shared regime path (2-state Markov: calm / stress) ───────────────────────
// Drawn once from a dedicated stream and handed to every path, so the 1,000 runs
// CO-MOVE through one market instead of being 1,000 independent worlds.
function mcBuildRegimePath(months, seed = 999983) {
  const C = ASSUMED_COEFFS;
  const rng = mcMulberry32(seed);
  const path = [];
  let stressed = false;
  for (let mo = 0; mo <= months; mo++) {
    if (mo > 0) {
      const u = rng();
      stressed = stressed ? u > C.stressExitProb : u < C.stressEntryProb;
    }
    path.push(stressed);
  }
  return path;
}

// ════════════════════════════════════════════════════════════════════════════
// SIMULATION · Rev 3 ("structural")
// Same public signature as Rev 2 plus an optional shared regimePath (3rd arg).
// Changes vs Rev 2:
//   • FIXED slippage: Rev 2's sellUSD/(2·liq) produced ~39%/month impact and
//     collapsed the base case to a ~95% drawdown regardless of BTC. Now a
//     saturating impact k/(1+k) — concave, bounded, responsive to inputs.
//   • Student-t shocks (fat tails) on both BTC and idiosyncratic components.
//   • Regime switching: stress raises vol, pulls correlation→0.85, thins
//     liquidity, intensifies selling.
//   • Honest R4: AUKI's vesting cliffs are all in the past, so no fake forward
//     cliff spike — selling instead intensifies during stress regimes.
// Everything else (PRNG, normal draw, logistic caps, wallet elasticities,
// asymptotic 5B mint floor, USD-denominated burns) is preserved from Rev 2.
// ════════════════════════════════════════════════════════════════════════════
// ─── Ecosystem flows (Stage 1) — adoption inputs → monthly dollar flows ───────
// Paper-grounded; all inputs default to zero (today's reality) ⇒ all flows zero,
// so the price engine reduces exactly to the calibrated sell-side engine.
const MC_ECO = {
  servicePricePerDAU: 0.01, stakePerNodeUsd: 200, rewardPoolMintShare: 0.50,
  operatorCostPerDay: 0.86,
};
function mcEcosystemFlows(inp) {
  const monthlyRevenueUsd = inp.monthlyRevenueUsd || 0;
  const diversionPct = inp.diversionPct || 0;
  const dau = inp.dau || 0;
  const decentralizedNodes = inp.decentralizedNodes || 0;
  const tokensMintedThisMonth = inp.tokensMintedThisMonth || 0;
  const predictiveStakeUsd = inp.predictiveStakeUsd || 0;

  const buybackUsd = monthlyRevenueUsd * (diversionPct / 100);
  const creditBurnUsd = dau * MC_ECO.servicePricePerDAU * 30.44;
  const operatorStakeLockUsd = decentralizedNodes * MC_ECO.stakePerNodeUsd;
  const operatorRewardsUsd = tokensMintedThisMonth * MC_ECO.rewardPoolMintShare;
  const operatorCostUsd = decentralizedNodes * MC_ECO.operatorCostPerDay * 30.44;
  const operatorSellUsd = Math.min(Math.max(operatorCostUsd, 0), Math.max(operatorRewardsUsd, 0));
  return {
    buybackUsd, creditBurnUsd, operatorStakeLockUsd, operatorSellUsd,
    totalFloatLockUsd: operatorStakeLockUsd + predictiveStakeUsd,
  };
}

function mcRunSim(p, seed, regimePath) {
  const C = ASSUMED_COEFFS;
  const rng = mcMulberry32(seed);
  const mFromTGE = Math.round((Date.now() - MC_TGE_DATE.getTime()) / (30.44 * 864e5));
  const data = [];
  let price = p.startPrice;
  let totalSupply = 9_990_593_505;
  let cumulBurned = TOTAL_SUPPLY - 9_990_593_505;
  let rewardPool = 50_000_000;

  let liquidityDepth = p.liquidityDepth;
  let networkEconActivity = p.networkEconActivity;
  let dexDailyVolume = p.dexDailyVolume;
  let activeWallets = 12000;
  const monthlyVol30d = (p.volatility30d / 100);

  // private regime path if none injected (keeps the fn usable standalone)
  let localRegime = null;
  if (!regimePath) {
    localRegime = [];
    let st = false;
    for (let mo = 0; mo <= p.months; mo++) {
      if (mo > 0) { const u = rng(); st = st ? u > C.stressExitProb : u < C.stressEntryProb; }
      localRegime.push(st);
    }
  }
  const inStress = (mo) => (regimePath ? regimePath[mo] : localRegime[mo]);

  for (let mo = 0; mo <= p.months; mo++) {
    const gm = mFromTGE + mo;
    const newUnlocks = mo === 0 ? 0 : mcGetNewUnlocks(gm);
    const totalVested = mcGetVestedAtMonth(gm);
    const stressed = inStress(mo);

    if (mo > 0) {
      const logisticRate = (p.networkUsageGrowth / 100) * (1 - networkEconActivity / MC_K_ACTIVITY);
      networkEconActivity *= (1 + Math.max(0, logisticRate));
      const walletRate = (p.activeWalletGrowth / 100) * (1 - activeWallets / MC_K_WALLETS);
      activeWallets *= (1 + Math.max(0, walletRate));
    }

    const wRatio = activeWallets / 12000;
    const burnMult = Math.pow(wRatio, MC_BURN_WALLET_ELASTICITY);
    const liquidityMult = Math.pow(wRatio, MC_LIQUIDITY_WALLET_ELASTICITY);
    const stakingMult = Math.pow(wRatio, MC_STAKING_WALLET_ELASTICITY);

    const burnUsd = networkEconActivity * burnMult * p.burnEfficiency;
    const tokensBurned = price > 0 ? burnUsd / price : 0;

    const supplyRatio = Math.max(0, (totalSupply - MC_DEFLATION_FLOOR) / (TOTAL_SUPPLY - MC_DEFLATION_FLOOR));
    const mintRatio = 1 - supplyRatio;
    const tokensMinted = tokensBurned * mintRatio;
    if (mo > 0) {
      totalSupply = Math.max(MC_DEFLATION_FLOOR, totalSupply - tokensBurned + tokensMinted);
      cumulBurned += tokensBurned - tokensMinted;
    }

    const taxTokens = tokensMinted * 0.05;
    rewardPool += tokensMinted - taxTokens;
    const operatorClaims = rewardPool * 0.08;
    rewardPool = Math.max(0, rewardPool - operatorClaims);

    const foundAlloc = MC_ALLOCATIONS.find((a) => a.name === "Foundation");
    const foundVested = mcGetVestedAtMonth(gm) - mcGetVestedAtMonth(0);
    const treasuryBalance = (foundAlloc ? (foundAlloc.tokens / TOTAL_SUPPLY) * foundVested : 0) * price + taxTokens * price;

    const stakedTokens = totalVested * 0.12 * stakingMult * Math.min(2, 1 + mo * 0.01);

    // R4: base sell schedule × regime capitulation multiplier
    const regimeSellMult = stressed ? C.stressSellMult : 1.0;
    const sellTokens = newUnlocks * (p.unlockSellPressure / 100) * regimeSellMult;
    const sellImpactUsd = sellTokens * price;

    // ─── Open-market buyback + operator flows (fed by the ecosystem engine) ───
    // The buy-side flow comes from revenue diverted to open-market buys; operator
    // selling (to cover node costs) is a competing sell flow. Both are computed by
    // the ecosystem engine (Stage 1). IMPORTANT (spec §2.1): the buy-side IMPACT
    // MAGNITUDE is ASSUMED SYMMETRIC with the sell side and is NOT supported by
    // data — the backtest validates the sell-dominated downside only. The buy-side
    // multiplier is therefore an explicit belief input (buySideImpact), default 1.0,
    // destined for the belief surface (Stage 6), not a calibrated constant.
    // All ecosystem inputs default to zero ⇒ flows zero ⇒ engine reduces EXACTLY to
    // the calibrated sell-side engine (regression gate, spec §7.4).
    const eco = mcEcosystemFlows({
      monthlyRevenueUsd: p.monthlyRevenueUsd || 0,
      diversionPct: p.diversionPct || 0,
      dau: p.ecoDau || 0,
      decentralizedNodes: p.ecoNodes || 0,
      tokensMintedThisMonth: 0,   // wired to BME mint in a later stage; 0 keeps regression exact
      predictiveStakeUsd: p.predictiveStakeUsd || 0,
    });
    const buySideImpact = (p.buySideImpact == null ? 1.0 : p.buySideImpact); // ASSUMED axis (spec §2.1)
    // legacy direct lever still honoured (adds to ecosystem buyback)
    const buybackUsd = (eco.buybackUsd + (p.openMarketBuybackUsd || 0)) * buySideImpact;
    const operatorSellUsd = eco.operatorSellUsd;
    const buyTokens = price > 0 ? buybackUsd / price : 0;

    const cexVolMult = 1 + (p.cexCoverageScore - 1) * 0.4;
    const cexLiqBoost = 1 + (p.cexCoverageScore - 1) * 0.25;
    if (mo > 0) {
      const volLogistic = (p.networkUsageGrowth / 200) * (1 - networkEconActivity / MC_K_ACTIVITY);
      dexDailyVolume *= (1 + Math.max(0, volLogistic));
    }

    // ─── v1.1 §3a.2: effectiveLiquidity COUPLED to price + stress, damped & floored ───
    // Base depth grows with CEX coverage and wallet base (exogenous trend), then is
    // coupled to price sub-linearly (k<1) with a hard floor so the downside loop
    // (price↓ → liquidity↓ → amplification↑ → bigger↓) is realistic but can't spiral.
    const baseLiq = p.liquidityDepth * cexLiqBoost * liquidityMult;
    const priceCoupling = Math.max(
      C.liqFloorFrac,
      Math.pow(price / p.startPrice, C.liqPriceCoupling)
    );
    const stressLiqDrain = stressed ? 0.75 : 1.0;
    const effectiveLiquidity = baseLiq * priceCoupling * stressLiqDrain;

    // ─── v1.1 §3, §3a.3: Structure multiplier S — thin amplifies, deep dampens; BOUNDED ───
    const concentrationFactor = 1.0; // placeholder hook for §3a holder-concentration (not yet built)
    const S = Math.min(
      C.S_MAX,
      effectiveLiquidity > 0 ? (C.refLiquidity / effectiveLiquidity) * concentrationFactor : C.S_MAX
    );
    // Regime multiplier R: stress widens everything at once
    const R = stressed ? C.stressVolMult : 1.0;

    // ─── Net-flow price impact (§3a.1): buy pressure competes with sell pressure ───
    // against the SAME effective liquidity. Net sell → downward impact (slippage);
    // net buy → upward impact (buy-side lift). Symmetric, bounded, regime-amplified.
    const DEPTH_FACTOR = 18;  // CALIBRATED: monthly flow spreads ~3x wider than ±2% band; backtested to real AUKI 16mo drawdown
    const netFlowUsd = sellImpactUsd + operatorSellUsd - buybackUsd;   // >0 = net selling, <0 = net buying
    const rawNet = effectiveLiquidity > 0 ? netFlowUsd / (DEPTH_FACTOR * effectiveLiquidity) : 0;
    // saturating concave impact, applied symmetrically around zero
    const impactMag = Math.abs(rawNet) / (1 + Math.abs(rawNet));
    const netImpact = Math.sign(rawNet) * impactMag;   // + = price drag (sell), − = lift (buy)
    const slippage = Math.min(0.95, Math.max(-0.95, netImpact * R)); // R widens; bounded both sides

    // Ecosystem float locks (Stage 7b): node-operator stakes ($200/node) and
    // app-dev predictive stakes lock tokens out of circulation, tightening float
    // and lifting the scarcity premium — through the SAME floatSignal mechanism the
    // existing staking channel uses. Converted USD→tokens at current price.
    const ecoLockTokens = price > 0 ? (eco.totalFloatLockUsd || 0) / price : 0;
    const effCirc = Math.max(0, totalVested - stakedTokens - cumulBurned - ecoLockTokens);
    const floatRatio = totalSupply > 0 ? effCirc / totalSupply : 1;
    const floatSignal = (1 - floatRatio) * C.floatSignalCoeff;
    const imbalanceDrift = (p.buySellImbalance - 1) * C.imbalanceDriftCoeff;

    // regime-adjusted correlation
    const effCorr = stressed
      ? p.btcCorrelation + (C.stressCorrFloor - p.btcCorrelation) * 0.7
      : p.btcCorrelation;
    const driftBias = stressed ? C.stressDriftBias : 0;

    const btcMoReturn = p.btcAnnualReturn / 12;
    const btcMoVol = (C.btcAnnualVol / Math.sqrt(12));
    const btcShock = btcMoReturn + btcMoVol * mcRandStudentT(rng, C.tDegreesFreedom);
    const moVol = monthlyVol30d * Math.sqrt(30) / Math.sqrt(12);

    // ─── v1.1 §4: maturity-driven fundamentals weight (endogenous crossover) ───
    // maturity rises with network scale IN THIS PATH; fundamentals earn their weight.
    const maturity = Math.min(1, networkEconActivity / MC_K_ACTIVITY);
    const crossoverGain = (p.crossoverGain == null ? C.crossoverGain : p.crossoverGain); // belief axis
    const wFund = Math.min(1,
      C.wFund0 + crossoverGain * (C.wFundMax - C.wFund0) * maturity
    );
    const wDyn = 1 - wFund;

    if (mo > 0) {
      // ── FUNDAMENTALS channel (level driver) — NOT scaled by S (§3a.1) ──
      const burnBoost = tokensBurned > 0 ? (tokensBurned / totalSupply) * p.supplyElasticity : 0;
      const totalVolume = dexDailyVolume * 30 * cexVolMult;
      const volumeSignal = totalVolume > 0 ? Math.log(totalVolume / 50000) * C.volumeSignalCoeff : 0;
      // fundamentals = value creation, weighted by linkage strength (§5 axis) and maturity weight
      const fundLinkage = (p.fundLinkage == null ? C.fundLinkage : p.fundLinkage); // belief axis
      const fFund = (burnBoost + floatSignal + volumeSignal) * fundLinkage;

      // ── DYNAMICS channel (macro weather) — SCALED by structure via g(S) (§3a.1) ──
      const g = 1 + C.betaAmp * (S - 1);            // gentle directional amplification
      const btcComponent = effCorr * btcShock;
      const fDyn = (btcComponent + imbalanceDrift + driftBias) * g;

      // ── Idiosyncratic noise — full S·R amplification (§3a.1) ──
      const idioComponent = (1 - effCorr) * moVol * mcRandStudentT(rng, C.tDegreesFreedom) * S * R;

      // ── Combined: weighted drivers + scaled noise − amplified slippage ──
      const drift = wFund * fFund + wDyn * fDyn;
      price = price * Math.exp(drift + idioComponent - slippage);
      price = Math.max(price, 0.0001);
    }

    const rewardPerNode = operatorClaims > 0 ? (operatorClaims * price) / Math.max(1, stakedTokens / 1e6) : 0;

    data.push({
      month: mo, price, totalSupply, circulatingSupply: effCirc, totalVested, newUnlocks,
      cumulBurned, tokensBurned: mo === 0 ? 0 : tokensBurned, tokensMinted: mo === 0 ? 0 : tokensMinted,
      netDeflation: mo === 0 ? 0 : tokensBurned - tokensMinted, stakedTokens, rewardPool,
      treasuryBalance, sellPressureUsd: sellImpactUsd, slippage, effectiveLiquidity,
      marketCap: price * effCirc, fdv: price * totalSupply, mintRatio,
      dexDailyVolume, activeWallets, networkEconActivity,
      nodeROI: rewardPerNode > 0 ? ((rewardPerNode - 50) / 50) * 100 : -100,
      monthlyRewardPerNode: rewardPerNode,
      regimeStress: stressed ? 1 : 0,
      regimeSellMult,
      wFund, structureMult: S,
      maturity: Math.min(1, networkEconActivity / MC_K_ACTIVITY),
    });
  }
  return data;
}

function mcRunAll(p, n) {
  const regimePath = mcBuildRegimePath(p.months);
  const results = [];
  for (let i = 0; i < n; i++) results.push(mcRunSim(p, i + 1, regimePath));
  return results;
}

function mcPercentiles(sims, field, idx) {
  const vals = sims.map((s) => s[idx]?.[field] ?? 0).sort((a, b) => a - b);
  const p = (pct) => vals[Math.floor(pct / 100 * (vals.length - 1))] ?? 0;
  return { p5: p(5), p10: p(10), p25: p(25), p50: p(50), p75: p(75), p90: p(90), p95: p(95) };
}

// Headline frequency WITH a 95% binomial confidence interval, so the "% of
// scenarios up" number stops looking like a calibrated market probability.
function mcFreqWithError(sims, months, startPrice, multiple = 1) {
  const N = sims.length;
  const k = sims.filter((s) => (s[months]?.price ?? 0) > startPrice * multiple).length;
  const phat = k / N;
  const se = Math.sqrt((phat * (1 - phat)) / N) * 100;
  return { pct: phat * 100, sePts: se, ciLow: phat * 100 - 1.96 * se, ciHigh: phat * 100 + 1.96 * se };
}

// ─── Across-calendar CI (Stage 3, spec §2.2) ─────────────────────────────────
// The shared single regime calendar means mcFreqWithError's binomial CI captures
// only WITHIN-calendar sampling noise. The TRUE uncertainty is the spread of the
// headline frequency ACROSS regime calendars. This resamples the regime seed K
// times and returns the empirical 2.5–97.5% band — materially wider (measured
// ~4.8x the within-calendar half-width). Use this for any honest headline.
function mcFreqAcrossCalendars(p, startPrice, multiple = 1, K = 120, nPer = 400) {
  const freqs = [];
  for (let kk = 0; kk < K; kk++) {
    const rp = mcBuildRegimePath(p.months, 1000 + kk * 7919);
    let up = 0;
    for (let i = 0; i < nPer; i++) {
      const sim = mcRunSim(p, i + 1, rp);
      if ((sim[p.months]?.price ?? 0) > startPrice * multiple) up++;
    }
    freqs.push((up / nPer) * 100);
  }
  freqs.sort((a, b) => a - b);
  const mean = freqs.reduce((a, b) => a + b, 0) / K;
  const lo = freqs[Math.floor(0.025 * K)];
  const hi = freqs[Math.floor(0.975 * K)];
  return { pct: mean, ciLow: lo, ciHigh: hi, acrossCalendar: true };
}

// ─── MC UI Components ─────────────────────────────────────────────────────────

// Confidence-interval bar for the headline frequency
function MCCIBar({ pct, ciLow, ciHigh }) {
  const clamp = (x) => Math.max(0, Math.min(100, x));
  const lo = clamp(ciLow), hi = clamp(ciHigh), mid = clamp(pct);
  return (
    <div style={{ position: "relative", height: 28, marginTop: 8 }}>
      <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 4, background: "#1E1E1E", borderRadius: 2 }} />
      <div style={{ position: "absolute", top: 12, left: `${lo}%`, width: `${Math.max(0.5, hi - lo)}%`, height: 4, background: `${MC.gold}55`, borderRadius: 2 }} />
      <div style={{ position: "absolute", top: 7, left: `calc(${mid}% - 1px)`, width: 2, height: 14, background: MC.gold }} />
      <div style={{ position: "absolute", top: 0, left: 0, fontSize: 9, color: MC.dim, ...M }}>0%</div>
      <div style={{ position: "absolute", top: 0, right: 0, fontSize: 9, color: MC.dim, ...M }}>100%</div>
    </div>
  );
}

// Model diagnostics + uncertainty — foregrounds the epistemics (Rev 3)
function MCDiagnostics({ sims, months, startPrice }) {
  if (!sims || !sims.length) return null;
  const up = mcFreqWithError(sims, months, startPrice, 1);
  const x2 = mcFreqWithError(sims, months, startPrice, 2);
  const half = mcFreqWithError(sims, months, startPrice * 0.5, 1);
  const horizonStressMonths = sims[0] ? sims[0].filter((d) => d.regimeStress === 1).length : 0;
  const stressPct = sims[0] && sims[0].length > 1 ? (horizonStressMonths / (sims[0].length - 1)) * 100 : 0;
  const C = ASSUMED_COEFFS;
  const coeffRows = [
    ["Imbalance drift", C.imbalanceDriftCoeff, "per unit buy/sell ratio"],
    ["Volume signal", C.volumeSignalCoeff, "per log-unit vs $50K"],
    ["Float signal", C.floatSignalCoeff, "scarcity premium per unit locked"],
    ["BTC annual vol", C.btcAnnualVol, "historical realised, not AUKI-specific"],
    ["Tail thickness (t df)", C.tDegreesFreedom, "df=5 → fat but finite kurtosis"],
    ["Stress entry / mo", C.stressEntryProb, "Markov calm→stress probability"],
    ["Stress vol mult", C.stressVolMult, "vol scaling inside stress regime"],
  ];
  return (
    <div style={{ background: MC.card, border: `1px solid ${MC.cardBorder}`, borderRadius: 10, padding: "18px 22px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: `1px solid ${MC.border}`, paddingBottom: 10 }}>
        <div style={{ fontSize: 14, color: MC.subtle, letterSpacing: "0.1em", fontWeight: 700, ...M }}>0 · MODEL DIAGNOSTICS & UNCERTAINTY</div>
        <span style={{ fontSize: 10, color: MC.gold, border: `1px solid ${MC.gold}55`, borderRadius: 4, padding: "2px 8px", ...M }}>REV 3 · STRUCTURAL</span>
      </div>

      <div style={{ background: "#0D1117", border: `1px solid ${MC.cardBorder}`, borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: MC.muted, ...M, lineHeight: 1.65 }}>
          <strong style={{ color: MC.text }}>{up.pct.toFixed(1)}%</strong> of {sims.length.toLocaleString()} modelled scenarios end above
          today's price — but that figure carries sampling error. The true value (given these assumptions)
          lies in <strong style={{ color: MC.gold }}>{up.ciLow.toFixed(1)}%–{up.ciHigh.toFixed(1)}%</strong> with
          95% confidence. This is a <em>scenario frequency under stated assumptions</em>, not a market probability.
        </div>
        <MCCIBar pct={up.pct} ciLow={up.ciLow} ciHigh={up.ciHigh} />
        <div style={{ display: "flex", gap: 22, marginTop: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: MC.muted, ...M }}>≥2x: <strong style={{ color: MC.green }}>{x2.pct.toFixed(1)}%</strong> <span style={{ color: MC.dim }}>±{(1.96 * x2.sePts).toFixed(1)}pts</span></span>
          <span style={{ fontSize: 11, color: MC.muted, ...M }}>≥50% drawdown: <strong style={{ color: MC.red }}>{(100 - half.pct).toFixed(1)}%</strong> <span style={{ color: MC.dim }}>±{(1.96 * half.sePts).toFixed(1)}pts</span></span>
          <span style={{ fontSize: 11, color: MC.muted, ...M }}>horizon in stress regime: <strong style={{ color: MC.gold }}>{stressPct.toFixed(0)}%</strong> <span style={{ color: MC.dim }}>({horizonStressMonths}mo)</span></span>
        </div>
      </div>

      <div style={{ background: "#0D1117", border: `1px solid ${MC.cardBorder}`, borderRadius: 8, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, color: MC.red, letterSpacing: "0.08em", ...M, marginBottom: 8, fontWeight: 700 }}>⚠ ASSUMED — NOT CALIBRATED TO AUKI DATA</div>
        <div style={{ fontSize: 13, color: MC.muted, ...M, lineHeight: 1.65, marginBottom: 10 }}>
          AUKI has &lt;2 years of thin price history — not enough to fit these. They are chosen for reasonable
          magnitude and directional logic. Treat the model as a transparent assumption engine, not a forecast.
          Move the sliders; watch how much the output depends on these choices.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 16px" }}>
          {coeffRows.map(([label, val, note]) => (
            <div key={label} style={{ display: "contents" }}>
              <div style={{ fontSize: 10.5, color: MC.subtle, ...M }}>{label} <span style={{ color: MC.dim }}>· {note}</span></div>
              <div style={{ fontSize: 10.5, color: MC.gold, ...M, textAlign: "right", fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MCFanChart({ sims, field, label, formatter, height = 140, color = MC.gold, showZero = false }) {
  if (!sims || !sims.length || !sims[0]) return null;
  const months = sims[0].length; const W = 800; const H = height;
  const bands = [];
  for (let i = 0; i < months; i++) bands.push(mcPercentiles(sims, field, i));
  const allV = bands.flatMap((b) => [b.p5, b.p95]);
  let maxV = Math.max(...allV); let minV = Math.min(...allV);
  if (showZero) minV = Math.min(minV, 0);
  if (maxV === minV) maxV = minV + 1;
  const range = maxV - minV;
  const x = (i) => (i / (months - 1)) * W;
  const y = (v) => 10 + (1 - (v - minV) / range) * (H - 15);
  const path = (key) => bands.map((b, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(b[key]).toFixed(1)}`).join(" ");
  const area = (top, bot) => {
    const t = bands.map((b, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(b[top]).toFixed(1)}`).join(" ");
    const b2 = [...bands].reverse().map((b, i) => `L${x(months - 1 - i).toFixed(1)},${y(b[bot]).toFixed(1)}`).join(" ");
    return `${t} ${b2} Z`;
  };
  const f = bands[bands.length - 1];
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 12, color: MC.subtle, letterSpacing: "0.1em", ...M, marginBottom: 8 }}>{label}</div>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <path d={area("p95", "p5")} fill={color} opacity={0.08} />
        <path d={area("p75", "p25")} fill={color} opacity={0.15} />
        <path d={path("p50")} fill="none" stroke={color} strokeWidth="2" />
        {showZero && minV < 0 && maxV > 0 && <line x1={0} y1={y(0)} x2={W} y2={y(0)} stroke="#333" strokeWidth="1" strokeDasharray="4,4" />}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: MC.dim, ...M }}>Now</span>
        <div style={{ display: "flex", gap: 14, fontSize: 11, ...M }}>
          <span style={{ color: `${color}88` }}>P5: {formatter(f?.p5)}</span>
          <span style={{ color, fontWeight: 600 }}>P50: {formatter(f?.p50)}</span>
          <span style={{ color: `${color}88` }}>P95: {formatter(f?.p95)}</span>
        </div>
        <span style={{ fontSize: 11, color: MC.dim, ...M }}>{months - 1}mo</span>
      </div>
    </div>
  );
}

function MCMetric({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#0D1117", border: `1px solid ${MC.cardBorder}`, borderRadius: 8, padding: "14px 16px" }}>
      <div style={{ color: MC.dim, fontSize: 11, letterSpacing: "0.12em", ...M, marginBottom: 5 }}>{label}</div>
      <div style={{ color: accent || MC.text, fontSize: 18, fontWeight: 700, ...M }}>{value}</div>
      {sub && <div style={{ color: MC.muted, fontSize: 11, marginTop: 3, ...M }}>{sub}</div>}
    </div>
  );
}

function MCSlider({ label, value, onChange, min, max, step, format, tip }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div style={{ marginBottom: 14 }} onMouseEnter={() => tip && setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: MC.muted, letterSpacing: "0.06em", ...M, cursor: tip ? "help" : "default" }}>
          {label} {tip && <span style={{ color: MC.veryDim }}>ⓘ</span>}
        </span>
        <span style={{ fontSize: 13, color: MC.gold, fontWeight: 600, ...M }}>{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: MC.gold, height: 5, cursor: "pointer" }} />
      {showTip && tip && (
        <div style={{ background: "#1A1E24", border: `1px solid ${MC.cardBorder}`, borderRadius: 6, padding: "8px 12px", fontSize: 11, color: MC.muted, ...M, lineHeight: 1.5, marginTop: 4 }}>
          💡 {tip}
        </div>
      )}
    </div>
  );
}

function MCSection({ title, explanation, children }) {
  const [showExp, setShowExp] = useState(false);
  return (
    <div style={{ background: MC.card, border: `1px solid ${MC.cardBorder}`, borderRadius: 10, padding: "18px 22px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: `1px solid ${MC.border}`, paddingBottom: 10 }}>
        <div style={{ fontSize: 14, color: MC.subtle, letterSpacing: "0.1em", fontWeight: 700, ...M }}>{title}</div>
        {explanation && (
          <button onClick={() => setShowExp(!showExp)}
            style={{ background: showExp ? "#1A1E24" : "none", border: `1px solid ${showExp ? MC.gold : "#222"}`, borderRadius: 4, color: showExp ? MC.gold : MC.dim, fontSize: 11, padding: "3px 10px", cursor: "pointer", ...M }}>
            {showExp ? "HIDE" : "WHAT IS THIS?"}
          </button>
        )}
      </div>
      {showExp && explanation && (
        <div style={{ background: "#0D1117", border: `1px solid ${MC.cardBorder}`, borderRadius: 6, padding: "12px 16px", marginBottom: 14, fontSize: 12, color: MC.muted, ...M, lineHeight: 1.7 }}>
          💡 {explanation}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Executive Summary Generator (Fix #8: scenario frequency, not probability) ─
function mcSummary(sims, months, startPrice) {
  const fp = mcPercentiles(sims, "price", months);
  const fs = mcPercentiles(sims, "totalSupply", months);
  const fc = mcPercentiles(sims, "circulatingSupply", months);
  const fm = mcPercentiles(sims, "marketCap", months);
  const freqAbove = sims.filter((s) => s[months]?.price > startPrice).length / sims.length * 100;
  const freq2x = sims.filter((s) => s[months]?.price > startPrice * 2).length / sims.length * 100;
  const freq50drop = sims.filter((s) => s[months]?.price < startPrice * 0.5).length / sims.length * 100;
  const priceMult = (fp.p50 / startPrice).toFixed(1);
  const deflated = ((TOTAL_SUPPLY - fs.p50) / TOTAL_SUPPLY * 100).toFixed(1);
  const outlook = freqAbove > 60 ? "optimistic" : freqAbove < 40 ? "cautious" : "neutral";
  return {
    text: `Over ${mcFmtMo(months)}, ${freqAbove.toFixed(0)}% of modelled scenarios show AUKI above today's ${mcFmtPrice(startPrice)}. Median price: ${mcFmtPrice(fp.p50)} (${priceMult}x). Range: ${mcFmtPrice(fp.p10)} to ${mcFmtPrice(fp.p90)} (P10–P90). Supply deflates ${deflated}% to ${mcFmtB(fs.p50)}. Median market cap: ${mcFmtUsd(fm.p50)}.`,
    bullets: [
      `${freq2x.toFixed(0)}% of scenarios reach 2x or higher`,
      `${freq50drop.toFixed(0)}% of scenarios show 50%+ drawdown`,
      `Circulating supply: ${mcFmtB(fc.p50)} (P50)`,
    ],
    outlook, freqAbove, freq2x, freq50drop, fp, fs, fc, fm,
  };
}

// ─── Simulation hook (main-thread, no Web Worker) ─────────────────────────────
// The engine runs 1,000 paths in well under a second, so it executes directly on
// the main thread. This deliberately avoids Web Workers entirely: bundling a
// worker (whether as a separate file or an inline Blob) is the fragile part under
// a production build, and it is not worth the risk for a sub-second computation.
// A short deferral via requestAnimationFrame lets the loading state paint first
// so the UI never appears frozen.
function useMCWorker(params, numSims) {
  const [sims, setSims] = useState(null);
  const [running, setRunning] = useState(false);
  const paramKey = JSON.stringify(params);
  useEffect(() => {
    let cancelled = false;
    setRunning(true);
    setSims(null);
    // Defer to the next frame(s) so the "RUNNING SIMULATION…" loader can render
    // before the synchronous compute blocks the thread briefly.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        let result;
        try {
          result = mcRunAll(params, numSims);
        } catch (err) {
          result = [];
        }
        if (!cancelled) { setSims(result); setRunning(false); }
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(id); };
  }, [paramKey, numSims]);
  return { sims, running };
}

// ─── Belief Surface (Stage 6, spec §6 + §4.1) ───────────────────────────────
// The honest headline: median price across the grid of two UN-CALIBRATABLE belief
// axes (fundamentals-linkage × buy-side impact), crossover-gain held at a stated
// value. Shows how much of any result is authored by belief vs. forced by the
// calibrated mechanics. Computes ON DEMAND (button) — a 5×5 grid × N paths is
// heavy and must not fire on every slider move. The triple-optimistic corner
// (both axes maxed) is greyed + labelled as the least-supported region (§4.1).
const MC_SURFACE_LINKAGE = [0.25, 0.5, 1.0, 1.5, 2.0];
const MC_SURFACE_BUY = [0.25, 0.5, 1.0, 1.5, 2.0];

function mcSurfaceColor(m) {
  const t = Math.max(0, Math.min(1, (m - 0.5) / (2.2 - 0.5)));
  let r, g, b;
  if (t < 0.5) { r = 200; g = Math.round(60 + t * 2 * 150); b = 40; }
  else { r = Math.round(200 - (t - 0.5) * 2 * 150); g = 210; b = Math.round(40 + (t - 0.5) * 2 * 60); }
  return `rgb(${r},${g},${b})`;
}

function MCBeliefSurface({ baseParams, numSimsPerCell = 600, crossoverGain = 1.0 }) {
  const [grid, setGrid] = useState(null);
  const [running, setRunning] = useState(false);
  const [computedAt, setComputedAt] = useState(null);

  const compute = useCallback(() => {
    setRunning(true);
    setGrid(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const startP = baseParams.startPrice;
          const out = [];
          for (const b of MC_SURFACE_BUY) {
            const row = [];
            for (const l of MC_SURFACE_LINKAGE) {
              const sims = mcRunAll(
                { ...baseParams, fundLinkage: l, buySideImpact: b, crossoverGain },
                numSimsPerCell
              );
              const p = mcPercentiles(sims, "price", baseParams.months);
              row.push(p.p50 / startP);
            }
            out.push(row);
          }
          setGrid(out);
          setComputedAt(Date.now());
        } catch (e) {
          setGrid(null);
        }
        setRunning(false);
      });
    });
  }, [baseParams, numSimsPerCell, crossoverGain]);

  const nrow = MC_SURFACE_BUY.length, ncol = MC_SURFACE_LINKAGE.length;
  const cell = 64, padL = 66, padB = 52, padT = 16, padR = 8;
  const W = padL + ncol * cell + padR, H = padT + nrow * cell + padB;

  return (
    <div style={{ background: MC.card, border: `1px solid ${MC.cardBorder}`, borderRadius: 10, padding: 18, marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ color: MC.text, fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" }}>BELIEF SURFACE — MEDIAN PRICE (×START)</div>
          <div style={{ color: MC.muted, fontSize: 13, marginTop: 5, lineHeight: 1.6 }}>
            How the median outcome moves across the two assumptions no data can pin:
            fundamentals-linkage strength and buy-side impact. Crossover gain held at {crossoverGain.toFixed(2)}.
            The spread across this grid is the honest message — much of any result is
            authored by belief, not forced by the calibrated mechanics.
          </div>
        </div>
        <button
          onClick={compute}
          disabled={running}
          style={{
            background: running ? MC.veryDim : MC.gold, color: running ? MC.muted : "#111",
            border: "none", borderRadius: 6, padding: "9px 16px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.05em", cursor: running ? "default" : "pointer", whiteSpace: "nowrap",
          }}
        >
          {running ? "COMPUTING…" : grid ? "RECOMPUTE SURFACE" : "COMPUTE SURFACE"}
        </button>
      </div>

      {!grid && !running && (
        <div style={{ color: MC.dim, fontSize: 12, padding: "28px 0", textAlign: "center" }}>
          Surface is computed on demand (25 cells × {numSimsPerCell} paths). Press “Compute Surface”.
        </div>
      )}
      {running && (
        <div style={{ color: MC.gold, fontSize: 12, padding: "28px 0", textAlign: "center", letterSpacing: "0.08em" }}>
          COMPUTING SURFACE — 25 CELLS…
        </div>
      )}

      {grid && (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 520, marginTop: 12 }} fontFamily="inherit">
          {grid.map((row, ri) => {
            const yrow = nrow - 1 - ri;
            return row.map((m, ci) => {
              const x = padL + ci * cell, y = padT + yrow * cell;
              const isCorner = ri === nrow - 1 && ci === ncol - 1;
              return (
                <g key={`${ri}-${ci}`}>
                  <rect x={x} y={y} width={cell - 3} height={cell - 3} rx={4} fill={mcSurfaceColor(m)} />
                  {isCorner && (
                    <>
                      <rect x={x} y={y} width={cell - 3} height={cell - 3} rx={4} fill="#0d0d0f" opacity={0.62} />
                      <rect x={x} y={y} width={cell - 3} height={cell - 3} rx={4} fill="none" stroke="#888" strokeDasharray="4 3" />
                    </>
                  )}
                  <text x={x + (cell - 3) / 2} y={y + (cell - 3) / 2 + 4} fill={isCorner ? "#bbb" : "#111"}
                    fontSize={13} fontWeight={700} textAnchor="middle">{m.toFixed(2)}×</text>
                </g>
              );
            });
          })}
          {/* x axis */}
          {MC_SURFACE_LINKAGE.map((l, ci) => (
            <text key={`x${ci}`} x={padL + ci * cell + (cell - 3) / 2} y={padT + nrow * cell + 16}
              fill={MC.muted} fontSize={10} textAnchor="middle">{l.toFixed(2)}</text>
          ))}
          <text x={padL + ncol * cell / 2} y={padT + nrow * cell + 36} fill={MC.subtle} fontSize={11}
            textAnchor="middle" fontWeight={600}>Fundamentals-linkage (assumed)</text>
          {/* y axis */}
          {MC_SURFACE_BUY.map((b, ri) => {
            const yrow = nrow - 1 - ri;
            return (
              <text key={`y${ri}`} x={padL - 10} y={padT + yrow * cell + (cell - 3) / 2 + 4}
                fill={MC.muted} fontSize={10} textAnchor="end">{b.toFixed(2)}</text>
            );
          })}
          <text x={16} y={padT + nrow * cell / 2} fill={MC.subtle} fontSize={11} fontWeight={600}
            textAnchor="middle" transform={`rotate(-90 16 ${padT + nrow * cell / 2})`}>Buy-side impact (assumed)</text>
        </svg>
      )}

      {grid && (
        <div style={{ color: MC.muted, fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
          Dashed top-right cell = the triple-optimistic corner (both axes maxed): the
          most spectacular number and the <b>least-supported</b> — three hopeful
          assumptions at once. It is shown, not hidden, but greyed so it cannot be
          mistaken for the headline.
        </div>
      )}
    </div>
  );
}

// ─── Monte Carlo Tab (13 variables · Rev 3 · structural) ─────────────────────
function MonteCarloTab({ price: livePrice }) {
  const FALLBACK_PRICE = 0.00929; // keep in sync with fetchAukiPrice fallback
  const startPrice = livePrice || FALLBACK_PRICE;
  const usingFallbackPrice = !livePrice;
  const NUM_SIMS = 1000; // Fix #7: increased from 500 for stable tail estimates
  const [months, setMonths] = useState(36);

  // === THE 10 CORE VARIABLES ===
  // Market Structure
  const [cexCoverageScore, setCexCoverageScore] = useState(2);
  const [dexDailyVolume, setDexDailyVolume] = useState(20000);
  const [liquidityDepth, setLiquidityDepth] = useState(580000);
  // Fundamentals
  // networkEconActivity retained as FIXED internal baseline (slider removed; the
  // Application Revenue → buyback lever supersedes it). Feeds maturity at today's level.
  const [networkEconActivity] = useState(25000);
  const [unlockSellPressure, setUnlockSellPressure] = useState(35);
  const [openMarketBuybackUsd, setOpenMarketBuybackUsd] = useState(0);  // $/mo revenue-funded open-market buys; 0 = today's reality
  const [networkUsageGrowth, setNetworkUsageGrowth] = useState(8);
  const [activeWalletGrowth, setActiveWalletGrowth] = useState(5);
  // Market Dynamics
  const [buySellImbalance, setBuySellImbalance] = useState(1.0);
  const [btcCorrelation, setBtcCorrelation] = useState(0.48);  // CALIBRATED: AUKI–BTC return corr from data
  const [volatility30d, setVolatility30d] = useState(30);  // CALIBRATED: AUKI realized ~47%/mo = slider max

  // === 3 NEW REVIEW VARIABLES (Fixes #1, #2, #6) ===
  const [burnEfficiency, setBurnEfficiency] = useState(0.5);        // Var 11 (Fix #2)
  const [btcAnnualReturn, setBtcAnnualReturn] = useState(0.15);     // Var 12 (Fix #6)
  const [supplyElasticity, setSupplyElasticity] = useState(0.30);   // Var 13 (Fix #1)

  // ── Ecosystem inputs (Stage 7a) — FUTURE-STATE / ASSUMED. Default 0 = today's
  // reality (only Auki's own apps use the protocol; no live buyback, no operators).
  const [monthlyRevenueUsd, setMonthlyRevenueUsd] = useState(0);  // application revenue, fiat $/mo
  const [diversionPct, setDiversionPct] = useState(30);           // POLICY: % of revenue → open-market buyback
  const [ecoDau, setEcoDau] = useState(0);                        // external daily active users
  const [ecoNodes, setEcoNodes] = useState(0);                    // decentralized operator nodes
  const [predictiveStakeUsd, setPredictiveStakeUsd] = useState(0); // app-dev predictive stake locked $

  // Run simulation (deferred main-thread compute; see useMCWorker header note)
  const { sims, running: simRunning } = useMCWorker({
    months, startPrice,
    cexCoverageScore, dexDailyVolume, liquidityDepth,
    networkEconActivity, unlockSellPressure, openMarketBuybackUsd, networkUsageGrowth,
    activeWalletGrowth, buySellImbalance, btcCorrelation, volatility30d,
    burnEfficiency, btcAnnualReturn, supplyElasticity,
    monthlyRevenueUsd, diversionPct, ecoDau, ecoNodes, predictiveStakeUsd,
  }, NUM_SIMS);

  const summary = useMemo(() => sims ? mcSummary(sims, months, startPrice) : null, [sims, months, startPrice]);

  // Params snapshot for the belief surface (mirrors the live scenario; the surface
  // overrides the three belief axes itself). Ecosystem inputs default to today (0).
  const surfaceBaseParams = useMemo(() => ({
    months, startPrice,
    cexCoverageScore, dexDailyVolume, liquidityDepth,
    networkEconActivity, unlockSellPressure, openMarketBuybackUsd, networkUsageGrowth,
    activeWalletGrowth, buySellImbalance, btcCorrelation, volatility30d,
    burnEfficiency, btcAnnualReturn, supplyElasticity,
    monthlyRevenueUsd, diversionPct, ecoDau, ecoNodes, predictiveStakeUsd,
  }), [months, startPrice, cexCoverageScore, dexDailyVolume, liquidityDepth,
    networkEconActivity, unlockSellPressure, openMarketBuybackUsd, networkUsageGrowth,
    activeWalletGrowth, buySellImbalance, btcCorrelation, volatility30d,
    burnEfficiency, btcAnnualReturn, supplyElasticity,
    monthlyRevenueUsd, diversionPct, ecoDau, ecoNodes, predictiveStakeUsd]);
  const medianSim = useMemo(() => {
    if (!sims || !sims.length) return null;
    const p50price = mcPercentiles(sims, "price", months).p50;
    return sims.reduce((best, sim) => {
      const termPrice = sim[months]?.price ?? 0;
      const bestPrice = best[months]?.price ?? 0;
      return Math.abs(termPrice - p50price) < Math.abs(bestPrice - p50price) ? sim : best;
    });
  }, [sims, months]);

  // Deflation timeline
  const deflationTimeline = useMemo(() => {
    if (!sims || !sims.length) return [];
    return [9e9, 8e9, 7.5e9, 7e9, 6e9, 5.5e9, 5e9].map((target) => {
      const arr = sims.map((s) => { const i = s.findIndex((d) => d.totalSupply <= target); return i >= 0 ? i : Infinity; }).sort((a, b) => a - b);
      const med = arr[Math.floor(arr.length / 2)];
      return { target, months: med === Infinity ? null : med, label: mcFmtB(target) };
    });
  }, [sims]);

  // Liquidity stress — uses the user's liquidity depth setting
  const liqStress = [10000, 25000, 50000, 100000, 250000, 500000].map((sz) => ({
    size: sz, slippage: (sz / (liquidityDepth * 2)) * 100,
  }));

  // Unlock bar data
  const unlockData = useMemo(() => {
    const mFromTGE = Math.round((Date.now() - MC_TGE_DATE.getTime()) / (30.44 * 864e5));
    const step = Math.max(1, Math.floor(months / 12));
    const bars = [];
    for (let m = 0; m <= months; m += step) {
      bars.push({ unlocks: mcGetNewUnlocks(mFromTGE + m) * step, label: `+${m}mo` });
    }
    return bars;
  }, [months]);

  if (!sims || !summary) return <Loader msg="RUNNING SIMULATION…" />;

  const outlookColor = summary.outlook === "optimistic" ? MC.green : summary.outlook === "cautious" ? MC.red : MC.gold;

  return (
    <div>
      {/* ─── Recalculating indicator ───────────────────────────────── */}
      {simRunning && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#1A1400", border: `1px solid ${MC.gold}`, borderRadius: 6, padding: "6px 14px", color: MC.gold, fontSize: 12, ...M, zIndex: 20 }}>
          ⟳ RECALCULATING…
        </div>
      )}
      {/* ─── Fallback price warning ────────────────────────────────── */}
      {usingFallbackPrice && (
        <div style={{ background: "#2A1A00", border: "1px solid #E67E22", borderRadius: 8, padding: "10px 16px", marginBottom: 12, color: "#E67E22", fontSize: 13, ...M }}>
          ⚠ LIVE PRICE UNAVAILABLE — simulation using estimated price ${FALLBACK_PRICE}. Outputs may not reflect current market conditions.
        </div>
      )}
      {/* ─── Executive Summary ─────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #0D1117 0%, #111820 100%)", border: `1px solid ${MC.cardBorder}`, borderRadius: 12, padding: "24px 28px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>📊</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: MC.text, ...M, letterSpacing: "0.08em" }}>EXECUTIVE SUMMARY</div>
              <div style={{ fontSize: 12, color: MC.muted, ...M }}>{NUM_SIMS} simulations · {mcFmtMo(months)} horizon</div>
            </div>
          </div>
          <div style={{ background: `${outlookColor}20`, border: `1px solid ${outlookColor}40`, borderRadius: 6, padding: "6px 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: outlookColor, ...M }}>{summary.outlook.toUpperCase()}</span>
          </div>
        </div>
        <div style={{ fontSize: 14, color: "#c0c0c0", ...M, lineHeight: 1.8, marginBottom: 16 }}>{summary.text}</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
          {summary.bullets.map((b, i) => <div key={i} style={{ fontSize: 12, color: MC.muted, ...M }}>{b}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          <MCMetric label="CURRENT PRICE" value={mcFmtPrice(startPrice)} sub="Live" accent={MC.gold} />
          <MCMetric label={`P50 PRICE (${mcFmtMo(months)})`} value={mcFmtPrice(summary.fp.p50)} sub={`P10: ${mcFmtPrice(summary.fp.p10)} · P90: ${mcFmtPrice(summary.fp.p90)}`} accent={summary.fp.p50 >= startPrice ? MC.green : MC.red} />
          <MCMetric label="SCENARIOS ABOVE CURRENT" value={mcFmtPct(summary.freqAbove)} accent={summary.freqAbove > 50 ? MC.green : MC.red} />
          <MCMetric label="SCENARIOS 2X+" value={mcFmtPct(summary.freq2x)} accent={MC.green} />
          <MCMetric label="SCENARIOS 50%+ DROP" value={mcFmtPct(summary.freq50drop)} accent={MC.red} />
        </div>
      </div>

      {/* ─── Variables Panel ───────────────────────────────────────── */}
      <div style={{ background: MC.card, border: `1px solid ${MC.cardBorder}`, borderRadius: 10, padding: "18px 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: MC.subtle, letterSpacing: "0.1em", fontWeight: 700, ...M }}>⚙️ 12 SIMULATION VARIABLES</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: MC.dim, ...M }}>HORIZON</span>
            <select value={months} onChange={(e) => setMonths(Number(e.target.value))}
              style={{ background: "#0D0D0D", border: `1px solid ${MC.cardBorder}`, borderRadius: 4, color: MC.muted, ...M, fontSize: 12, padding: "4px 8px", cursor: "pointer" }}>
              {[12, 24, 36, 48, 60, 84].map((n) => <option key={n} value={n}>{mcFmtMo(n)}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24 }}>
          {/* Column 1: Market Structure */}
          <div>
            <div style={{ fontSize: 11, color: MC.subtle, letterSpacing: "0.1em", ...M, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${MC.border}` }}>MARKET STRUCTURE</div>
            <MCSlider label="1 · CEX COVERAGE SCORE" value={cexCoverageScore} onChange={setCexCoverageScore}
              min={1} max={10} step={1} format={(v) => `${v}/10`}
              tip="Number, quality, and liquidity of exchanges listing AUKI. 1 = MEXC only. 5 = several mid-tier CEXes. 10 = Binance + Coinbase. Higher = more accessibility, institutional reach, and liquidity." />
            <MCSlider label="2 · DEX DAILY VOLUME" value={dexDailyVolume} onChange={setDexDailyVolume}
              min={1000} max={500000} step={1000} format={mcFmtUsd}
              tip="On-chain $AUKI trading activity across DEXes (Uniswap, PancakeSwap, Aerodrome). Strongest signal of organic market participation. Current: ~$15–25K/day." />
            <MCSlider label="3 · LIQUIDITY DEPTH (±2%)" value={liquidityDepth} onChange={setLiquidityDepth}
              min={50000} max={5000000} step={10000} format={mcFmtUsd}
              tip="USD liquidity available within a tight ±2% price range. Determines slippage, volatility resistance, and market stability. Current: ~$580K total DEX TVL." />
          </div>

          {/* Column 2: Fundamentals */}
          <div>
            <div style={{ fontSize: 11, color: MC.subtle, letterSpacing: "0.1em", ...M, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${MC.border}` }}>FUNDAMENTALS</div>
            <MCSlider label="4 · UNLOCK SELL PRESSURE" value={unlockSellPressure} onChange={setUnlockSellPressure}
              min={0} max={100} step={5} format={(v) => `${v}%`}
              tip="Estimated % of unlocked/vested tokens sold into the market. Models real supply shock and market absorption risk. 20% = holders hold. 60% = heavy dumping." />
            <MCSlider label="5 · NETWORK USAGE GROWTH" value={networkUsageGrowth} onChange={setNetworkUsageGrowth}
              min={0} max={30} step={1} format={(v) => `${v}%/mo`}
              tip="Growth in protocol usage. Logistic curve — rate decays as activity approaches $10M/mo carrying capacity. 8%/mo doubles activity in ~9 months." />
            <MCSlider label="6 · ACTIVE WALLET GROWTH" value={activeWalletGrowth} onChange={setActiveWalletGrowth}
              min={0} max={30} step={1} format={(v) => `${v}%/mo`}
              tip="Growth in unique wallets. Logistic curve — rate decays as wallets approach 5M ceiling. Sub-linear elasticities: burns (0.8), liquidity (0.5), staking (0.6)." />
          </div>

          {/* Column 3: Market Dynamics */}
          <div>
            <div style={{ fontSize: 11, color: MC.subtle, letterSpacing: "0.1em", ...M, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${MC.border}` }}>MARKET DYNAMICS</div>
            <MCSlider label="7 · BUY/SELL IMBALANCE" value={buySellImbalance} onChange={setBuySellImbalance}
              min={0.5} max={1.5} step={0.05} format={(v) => v.toFixed(2)}
              tip="Ratio of buying pressure to selling pressure. >1 = net accumulation (bullish). <1 = net distribution (bearish). 1.0 = balanced. Reveals market sentiment." />
            <MCSlider label="8 · BTC CORRELATION" value={btcCorrelation} onChange={setBtcCorrelation}
              min={0} max={1} step={0.05} format={(v) => v.toFixed(2)}
              tip="Degree to which AUKI price follows Bitcoin. 0 = fully independent. 1 = moves 1:1 with BTC. Higher = more dependence on broader crypto market cycles." />
            <MCSlider label="9 · 30-DAY VOLATILITY" value={volatility30d} onChange={setVolatility30d}
              min={1} max={30} step={1} format={(v) => `${v}%`}
              tip="Rolling 30-day price volatility. Core risk metric for stress testing and uncertainty modelling. 5% = stable. 15% = volatile. 25% = extreme." />
          </div>

          {/* Column 4: Model Calibration (Review fixes #1, #2, #6) */}
          <div>
            <div style={{ fontSize: 11, color: MC.subtle, letterSpacing: "0.1em", ...M, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${MC.border}` }}>MODEL CALIBRATION</div>
            <MCSlider label="10 · BURN EFFICIENCY" value={burnEfficiency} onChange={setBurnEfficiency}
              min={0.1} max={1.0} step={0.05} format={(v) => `${(v * 100).toFixed(0)}%`}
              tip="Fraction of network economic activity that actually reaches the burn mechanism after protocol fees, conversion delays, and failed transactions. 40% = conservative. 80% = optimistic. 100% = theoretical maximum." />
            <MCSlider label="11 · BTC EXPECTED RETURN" value={btcAnnualReturn} onChange={setBtcAnnualReturn}
              min={-0.50} max={0.80} step={0.05} format={(v) => `${(v * 100).toFixed(0)}%/yr`}
              tip="Expected annual BTC return assumption. Bear: -30% to -50%. Base: +15%. Bull: +50% to +80%. This drift is embedded in every path — it's the market regime assumption." />
            <MCSlider label="12 · SUPPLY ELASTICITY" value={supplyElasticity} onChange={setSupplyElasticity}
              min={0.05} max={0.50} step={0.05} format={(v) => v.toFixed(2)}
              tip="How much price responds to supply burns. 0.30 = markets price 30% of supply shock immediately (conservative). 0.50 = half priced in. Higher = stronger burn→price feedback." />
          </div>
        </div>

        {/* ─── Ecosystem inputs — ASSUMED / FUTURE-STATE (Stage 7a/7c) ──── */}
        {/* Visually separated from the calibrated inputs above to keep the seam */}
        {/* visible: these are projections of a network that has not yet scaled. */}
        <div style={{ marginTop: 22, padding: 16, border: `1px solid ${MC.purple}`, borderRadius: 10, background: "rgba(196,122,181,0.05)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: MC.purple, letterSpacing: "0.12em", ...M, fontWeight: 700 }}>APPLICATION REVENUE · ASSUMED / FORWARD-LOOKING</div>
            <div style={{ fontSize: 12, color: MC.muted, ...M }}>default 0 = today (only Auki's apps use the protocol)</div>
          </div>
          <div style={{ fontSize: 13, color: MC.muted, lineHeight: 1.6, marginBottom: 14, maxWidth: 760 }}>
            These inputs are <b>not calibrated</b> — they project a network that has not yet scaled. They drive the
            price only through the open-market buyback (revenue × diversion) and supply locks (stake), via the same
            calibrated liquidity mechanism. At 0 the model reproduces today's reality exactly.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <MCSlider label="APPLICATION REVENUE (PROJECTION)" value={monthlyRevenueUsd} onChange={setMonthlyRevenueUsd}
              min={0} max={5000000} step={50000} format={(v) => v === 0 ? "$0 (today)" : mcFmtUsd(v) + "/mo"}
              tip="External revenue today is $0. Any value above zero is YOUR assumption — the model shows what that revenue would do, not whether it will happen. This is the model's most powerful upward lever and it works regardless of network adoption, so own the number you choose. (One large client or many small ones is irrelevant; only the dollar total matters.)" />
            <MCSlider label="DIVERSION → BUYBACK (POLICY)" value={diversionPct} onChange={setDiversionPct}
              min={0} max={100} step={5} format={(v) => `${v}%`}
              tip="POLICY CHOICE (not a market outcome): the % of revenue routed to buying $AUKI on the OPEN MARKET and burning it. Open-market buys move price; treasury-sourced burns would not. This dial is the single most important policy lever — shown here as policy, set by Auki, not derived." />
            <MCSlider label="OPEN-MARKET BUYBACK $/MO" value={Math.round(monthlyRevenueUsd * diversionPct / 100)} onChange={() => {}}
              min={0} max={5000000} step={1} format={(v) => mcFmtUsd(v) + "/mo"}
              tip="Computed = revenue × diversion%. This is the actual monthly open-market buy pressure the engine applies (read-only; set the two sliders to the left)." />
            <MCSlider label="DECENTRALIZED NODES" value={ecoNodes} onChange={setEcoNodes}
              min={0} max={100000} step={500} format={(v) => v === 0 ? "0 (today, AWS-run)" : mcFmtB(v)}
              tip="Independent Hagall operator nodes. Each stakes $200 of AUKI (paper), locking tokens out of float. In this build nodes act through that stake lock ONLY: operator reward-selling is staged for a later release (mint is not yet wired), so no offsetting sell pressure is simulated. Grounded in the token paper, not calibrated. Today ~0 (Auki runs centralized AWS nodes)." />
            <MCSlider label="PREDICTIVE STAKE LOCKED ($)" value={predictiveStakeUsd} onChange={setPredictiveStakeUsd}
              min={0} max={10000000} step={100000} format={(v) => v === 0 ? "$0 (today)" : mcFmtUsd(v)}
              tip="AUKI locked by app developers via predictive staking for credit-burn discounts (paper §8). Locks float out of circulation, lifting the scarcity premium through the same mechanism as protocol staking. Today ~0." />
          </div>
        </div>
      </div>

      {/* ─── 0. Model Diagnostics & Uncertainty (Rev 3) ─────────────── */}
      <MCDiagnostics sims={sims} months={months} startPrice={startPrice} />

      {/* ─── 1. Price Trajectories ──────────────────────────────────── */}
      <MCSection title="1 · PRICE TRAJECTORIES" explanation="Range of possible AUKI prices over time. Solid line = median (50th percentile). Shaded bands = 25th–75th and 5th–95th percentile ranges. Wider bands = more uncertainty.">
        <MCFanChart sims={sims} field="price" label="TOKEN PRICE (USD)" formatter={mcFmtPrice} height={180} color={MC.gold} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 10 }}>
          <MCMetric label="P5 (WORST 5%)" value={mcFmtPrice(summary.fp.p5)} accent={MC.red} />
          <MCMetric label="P25" value={mcFmtPrice(summary.fp.p25)} accent={MC.red} />
          <MCMetric label="P75" value={mcFmtPrice(summary.fp.p75)} accent={MC.green} />
          <MCMetric label="P95 (BEST 5%)" value={mcFmtPrice(summary.fp.p95)} accent={MC.green} />
        </div>
      </MCSection>

      {/* ─── Belief Surface (Stage 6) — honest headline beside the fan ──── */}
      <MCBeliefSurface baseParams={surfaceBaseParams} numSimsPerCell={600} crossoverGain={1.0} />

      {/* ─── 2. Supply Deflation ───────────────────────────────────── */}
      <MCSection title="2 · SUPPLY DEFLATION" explanation="The burn-credit-mint mechanism destroys tokens when services are used, while minting fewer as rewards. Supply approaches an asymptotic floor of 5B — the closer it gets, the slower deflation becomes.">
        <MCFanChart sims={sims} field="totalSupply" label="TOTAL SUPPLY — TOWARD 5B FLOOR" formatter={mcFmtB} height={160} color={MC.blue} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 10 }}>
          <MCMetric label="CURRENT SUPPLY" value={mcFmtB(9_990_593_505)} sub={`${mcFmtB(TOTAL_SUPPLY - 9_990_593_505)} burned`} accent={MC.blue} />
          <MCMetric label="BURN/MO (MO 12)" value={mcFmtB(mcPercentiles(sims, "tokensBurned", Math.min(12, months)).p50)} accent={MC.red} />
          <MCMetric label="NET DEFLATION/MO" value={mcFmtB(mcPercentiles(sims, "netDeflation", Math.min(12, months)).p50)} accent={MC.green} />
          <MCMetric label={`SUPPLY AT ${mcFmtMo(months)}`} value={mcFmtB(summary.fs.p50)} accent={MC.blue} />
        </div>
      </MCSection>

      {/* ─── 3. Treasury Runway ────────────────────────────────────── */}
      {/* ─── 3. Treasury Runway — HIDDEN from dashboard per design (code retained) ───
      <MCSection title="TREASURY RUNWAY" explanation="Foundation treasury funded by 18.74% allocation (7-year vesting) plus protocol tax on every mint. Used for operations, grants, and node participation rewards.">
        <MCFanChart sims={sims} field="treasuryBalance" label="TREASURY VALUE (USD)" formatter={mcFmtUsd} height={140} color={MC.gold} />
      </MCSection>
      ─────────────────────────────────────────────────────────────────────────── */}

      {/* ─── 3. Circulating Supply ─────────────────────────────────── */}
      <MCSection title="3 · CIRCULATING SUPPLY" explanation="Effective circulating supply = vested tokens minus staked minus burned. This is the actual free-floating supply available for trading.">
        <MCFanChart sims={sims} field="circulatingSupply" label="EFFECTIVE CIRCULATING SUPPLY" formatter={mcFmtB} height={140} color={MC.purple} />
      </MCSection>

      {/* ─── 5. Unlock Sell Pressure ───────────────────────────────── */}
      <MCSection title="4 · VESTING UNLOCK SELL PRESSURE" explanation="When tokens vest, holders can sell. Pre-sale 2 and Advisors fully unlock ~Aug 2026. Team tokens have a 6-month cliff then 42 months linear vesting.">
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 100, marginBottom: 12 }}>
          {unlockData.map((d, i) => {
            const max = Math.max(...unlockData.map((x) => x.unlocks), 1);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, color: MC.dim, ...M }}>{mcFmtB(d.unlocks)}</div>
                <div style={{ width: "100%", height: `${(d.unlocks / max) * 70}px`, background: MC.red, borderRadius: "3px 3px 0 0", minHeight: 2 }} />
                <div style={{ fontSize: 9, color: MC.veryDim, ...M }}>{d.label}</div>
              </div>
            );
          })}
        </div>
        <MCFanChart sims={sims} field="sellPressureUsd" label="SELL PRESSURE FROM UNLOCKS (USD)" formatter={mcFmtUsd} height={120} color={MC.red} />
      </MCSection>

      {/* ─── 6. Liquidity Stress ───────────────────────────────────── */}
      <MCSection title="5 · LIQUIDITY STRESS TEST" explanation={`With ~${mcFmtUsd(liquidityDepth)} liquidity depth, large sells cause slippage. Estimated price impact for different sell sizes at current depth.`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {liqStress.map((l) => (
            <div key={l.size} style={{ textAlign: "center", background: "#0D1117", borderRadius: 6, padding: "10px 6px" }}>
              <div style={{ fontSize: 14, color: l.slippage > 10 ? MC.red : l.slippage > 5 ? MC.gold : MC.green, fontWeight: 700, ...M }}>{mcFmtPct(l.slippage)}</div>
              <div style={{ fontSize: 10, color: MC.dim, ...M, marginTop: 4 }}>{mcFmtUsd(l.size)} sell</div>
            </div>
          ))}
        </div>
      </MCSection>

      {/* ─── 7. Burn Feedback Loop ─────────────────────────────────── */}
      <MCSection title="6 · BURN → DEFLATION LOOP" explanation="More network usage → more burns → less supply → value accrual. The mint side creates fewer tokens than burned, approaching 1:1 as supply nears 5B.">
        <MCFanChart sims={sims} field="tokensBurned" label="MONTHLY TOKENS BURNED" formatter={mcFmtB} height={130} color={MC.green} />
        <MCFanChart sims={sims} field="tokensMinted" label="MONTHLY TOKENS MINTED (REWARDS)" formatter={mcFmtB} height={130} color={MC.purple} />
      </MCSection>

      {/* ─── 8. Staking vs Float ───────────────────────────────────── */}
      <MCSection title="7 · STAKING vs FLOAT" explanation="Tokens staked in node contracts are locked and removed from circulation. Staking participation grows with active wallet growth.">
        <MCFanChart sims={sims} field="stakedTokens" label="STAKED TOKENS" formatter={mcFmtB} height={130} color={MC.green} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          <MCMetric label="STAKED NOW" value={mcFmtB(mcPercentiles(sims, "stakedTokens", 0).p50)} accent={MC.green} />
          <MCMetric label={`STAKED AT ${mcFmtMo(months)}`} value={mcFmtB(mcPercentiles(sims, "stakedTokens", months).p50)} accent={MC.green} />
          <MCMetric label="EFFECTIVE FLOAT" value={mcFmtB(summary.fc.p50)} sub="Circ − Staked − Burned" accent={MC.purple} />
        </div>
      </MCSection>

      {/* ─── 9. Reward Pool ────────────────────────────────────────── */}
      <MCSection title="8 · REWARD POOL HEALTH" explanation="Pays node operators. Replenished by deflationary mints, drained by operator claims. If depleted, Foundation must step in.">
        <MCFanChart sims={sims} field="rewardPool" label="REWARD POOL (TOKENS)" formatter={mcFmtB} height={130} color={MC.gold} />
      </MCSection>

      {/* ─── 10. Node Break-Even ───────────────────────────────────── */}
      <MCSection title="9 · NODE OPERATOR BREAK-EVEN" explanation="Can you profitably run a posemesh node? Models monthly USD reward per node vs ~$50/month operating cost.">
        <MCFanChart sims={sims} field="nodeROI" label="MONTHLY NODE ROI (%)" formatter={mcFmtPct} height={120} color={MC.green} showZero />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          <MCMetric label="NODE COST (EST)" value="$50/mo" accent={MC.muted} />
          <MCMetric label={`ROI AT ${mcFmtMo(months)}`} value={mcFmtPct(mcPercentiles(sims, "nodeROI", months).p50)} accent={mcPercentiles(sims, "nodeROI", months).p50 > 0 ? MC.green : MC.red} />
          <MCMetric label="BREAK-EVEN" value={(() => { const i = medianSim?.findIndex((d) => d.nodeROI > 0); return i >= 0 ? `Month ${i}` : `>${mcFmtMo(months)}`; })()} accent={MC.gold} />
        </div>
      </MCSection>

      {/* ─── 11. Deflation Timeline ────────────────────────────────── */}
      <MCSection title="10 · DEFLATION TIMELINE" explanation="Estimated time to reach each supply milestone. Deflation is asymptotic — approaching 5B gets exponentially harder.">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${deflationTimeline.length}, 1fr)`, gap: 8 }}>
          {deflationTimeline.map((t) => (
            <div key={t.target} style={{ background: "#0D1117", border: `1px solid ${MC.cardBorder}`, borderRadius: 8, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: MC.text, ...M }}>{t.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.months != null ? MC.gold : MC.veryDim, ...M, marginTop: 8 }}>
                {t.months != null ? mcFmtMo(t.months) : `>${mcFmtMo(months)}`}
              </div>
            </div>
          ))}
        </div>
      </MCSection>

      {/* ─── 12. Market Cap ────────────────────────────────────────── */}
      <MCSection title="11 · MARKET CAP PROJECTION" explanation="Market cap = price × circulating supply. FDV = price × total supply.">
        <MCFanChart sims={sims} field="marketCap" label="MARKET CAP (USD)" formatter={mcFmtUsd} height={140} color={MC.gold} />
        <MCFanChart sims={sims} field="fdv" label="FULLY DILUTED VALUATION (USD)" formatter={mcFmtUsd} height={140} color={MC.purple} />
      </MCSection>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", padding: "20px 0", color: MC.veryDim, fontSize: 11, ...M, letterSpacing: "0.1em" }}>
        PRICE SENSITIVITY · {NUM_SIMS} PATHS · {mcFmtMo(months)} · 12 VARIABLES · SCENARIO SIMULATION · NOT FINANCIAL ADVICE
      </div>
    </div>
  );
}



// ─── Password protection (server-side via Netlify function) ───────────────────

function LoginScreen({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const attempt = async () => {
    setChecking(true);
    setError(false);
    try {
      const res = await fetch("/.netlify/functions/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem("auki_auth", token);
        onAuth();
      } else {
        setError(true);
        setPw("");
      }
    } catch {
      setError(true);
      setPw("");
    }
    setChecking(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace" }}>
      <div style={{ width: 320, padding: "40px 36px", background: "#111", border: "1px solid #2A3440", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <img src={AUKI_LOGO} alt="Auki" style={{ height: 28, width: "auto", display: "block" }} />
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
  const [mcMounted, setMcMounted] = useState(false); // keep MC tab alive once visited

  // Track first visit to Monte Carlo tab
  useEffect(() => {
    if (activeTab === "montecarlo") setMcMounted(true);
  }, [activeTab]);

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
            <img src={AUKI_LOGO} alt="Auki" style={{ height: 22, width: "auto", display: "block" }} />
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
    {(() => { const totalMktVol = dexVol24hUsd + mexcVol24hUsd; return (<>
    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <span style={{ color:"#9AA4AF" }}>DEX SHARE</span>
      <span style={{ color:"#7CC4A4", fontWeight:600 }}>
        {totalMktVol > 0 ? ((dexVol24hUsd / totalMktVol) * 100).toFixed(1) + "%" : "—"}
      </span>
    </div>

    <div style={{ display:"flex", justifyContent:"space-between" }}>
      <span style={{ color:"#9AA4AF" }}>CEX SHARE</span>
      <span style={{ color:"#C8A96E", fontWeight:600 }}>
        {totalMktVol > 0 ? ((mexcVol24hUsd / totalMktVol) * 100).toFixed(1) + "%" : "—"}
      </span>
    </div>
    </>); })()}

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
            ["montecarlo", "PRICE SENSITIVITY"],
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
        {(activeTab === "montecarlo" || mcMounted) && (
          <div style={{ display: activeTab === "montecarlo" ? "block" : "none" }}>
            <MonteCarloTab price={dp} />
          </div>
        )}
      </div>
    </div>
  );
}