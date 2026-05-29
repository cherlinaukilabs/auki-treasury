// mcWorker.js — Monte Carlo simulation Web Worker
// Runs simulation off the main thread to keep UI responsive

const TOTAL_SUPPLY = 10_000_000_000;
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

const MC_K_ACTIVITY = 10_000_000;
const MC_K_WALLETS = 5_000_000;
const MC_BURN_WALLET_ELASTICITY = 0.80;
const MC_LIQUIDITY_WALLET_ELASTICITY = 0.50;
const MC_STAKING_WALLET_ELASTICITY = 0.60;

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

function mcRunSim(p, seed) {
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

  for (let mo = 0; mo <= p.months; mo++) {
    const gm = mFromTGE + mo;
    const newUnlocks = mo === 0 ? 0 : mcGetNewUnlocks(gm);
    const totalVested = mcGetVestedAtMonth(gm);
    if (mo > 0) {
      const logisticRate = (p.networkUsageGrowth / 100) * (1 - networkEconActivity / MC_K_ACTIVITY);
      networkEconActivity *= (1 + Math.max(0, logisticRate));
    }
    if (mo > 0) {
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
    const stakingBase = 0.12;
    const stakedTokens = totalVested * stakingBase * stakingMult * Math.min(2, 1 + mo * 0.01);
    const sellTokens = newUnlocks * (p.unlockSellPressure / 100);
    const sellImpactUsd = sellTokens * price;
    const cexVolMult = 1 + (p.cexCoverageScore - 1) * 0.4;
    const cexLiqBoost = 1 + (p.cexCoverageScore - 1) * 0.25;
    if (mo > 0) {
      const volLogistic = (p.networkUsageGrowth / 200) * (1 - networkEconActivity / MC_K_ACTIVITY);
      dexDailyVolume *= (1 + Math.max(0, volLogistic));
      liquidityDepth = p.liquidityDepth * (price / p.startPrice) * cexLiqBoost * liquidityMult;
    }
    const effectiveLiquidity = liquidityDepth * cexLiqBoost;
    const slippage = sellImpactUsd > 0 && effectiveLiquidity > 0 ? sellImpactUsd / (effectiveLiquidity * 2) : 0;
    const effCirc = Math.max(0, totalVested - stakedTokens - cumulBurned);
    const floatRatio = totalSupply > 0 ? effCirc / totalSupply : 1;
    const floatSignal = (1 - floatRatio) * 0.02;
    const imbalanceDrift = (p.buySellImbalance - 1) * 0.03;
    const btcMoReturn = p.btcAnnualReturn / 12;
    const btcAnnualVol = 0.65;
    const btcMoVol = btcAnnualVol / Math.sqrt(12);
    const btcShock = btcMoReturn + btcMoVol * mcRandNormal(rng);
    const moVol = monthlyVol30d * Math.sqrt(30) / Math.sqrt(12);
    if (mo > 0) {
      const burnBoost = tokensBurned > 0 ? (tokensBurned / totalSupply) * p.supplyElasticity : 0;
      const totalVolume = (dexDailyVolume * 30 + dexDailyVolume * 30 * (cexVolMult - 1));
      const volumeSignal = totalVolume > 0 ? Math.log(totalVolume / 50000) * 0.003 : 0;
      const drift = imbalanceDrift + burnBoost + volumeSignal + floatSignal;
      const btcComponent = p.btcCorrelation * btcShock;
      const idioComponent = (1 - p.btcCorrelation) * moVol * mcRandNormal(rng);
      price = price * Math.exp(drift + btcComponent + idioComponent - slippage);
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
    });
  }
  return data;
}

function mcRunAll(p, n) {
  const results = [];
  for (let i = 0; i < n; i++) results.push(mcRunSim(p, i + 1));
  return results;
}

// Worker message handler
self.onmessage = function(e) {
  const { params, numSims } = e.data;
  const results = mcRunAll(params, numSims);
  self.postMessage(results);
};
