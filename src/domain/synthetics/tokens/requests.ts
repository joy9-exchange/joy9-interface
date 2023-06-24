import { getOracleKeeperUrl, getOracleKeeperUrlTmp } from "config/oracleKeeper";
import { getNormalizedTokenSymbol, getTokenBySymbol } from "config/tokens";
import { Bar } from "domain/tradingview/types";
import { CHART_PERIODS } from "lib/legacy";
import { parseOraclePrice } from "./utils";
import { timezoneOffset } from "domain/prices";
import { TokenPrices } from "./types";
import { getServerUrlNew, GMX_STATS_API_URL } from "config/backend";

export async function fetchOracleRecentPrice(chainId: number, tokenSymbol: string): Promise<TokenPrices> {
  const url = getOracleKeeperUrl(chainId, "/prices/tickers");

  tokenSymbol = getNormalizedTokenSymbol(tokenSymbol);

  const token = getTokenBySymbol(chainId, tokenSymbol);

  const res = await fetch(url).then((res) => res.json());

  const priceItem = res.find((item) => item.tokenSymbol === tokenSymbol);

  if (!priceItem) {
    throw new Error(`no price for ${tokenSymbol} found`);
  }

  const minPrice = parseOraclePrice(priceItem.minPrice, token.decimals, priceItem.oracleDecimals);
  const maxPrice = parseOraclePrice(priceItem.maxPrice, token.decimals, priceItem.oracleDecimals);

  return { minPrice, maxPrice };
}

export async function fetchLastOracleCandles(
  chainId: number,
  tokenSymbol: string,
  period: string,
  limit: number
): Promise<Bar[]> {
  tokenSymbol = getNormalizedTokenSymbol(tokenSymbol);

  //TODO gmx v2
  //const timeDiff = CHART_PERIODS[period] * (limit + 1);

  const timeDiff = CHART_PERIODS[period] * (limit + 1);
  const from = Math.floor(Date.now() / 1000 - timeDiff);

  //const url = getOracleKeeperUrl(chainId, "/prices/candles", { tokenSymbol, limit, period });
  //const url = getOracleKeeperUrlTmp(chainId, "/prices/candles", { tokenSymbol, limit, period });
  const url = `${getServerUrlNew(chainId, '/candleprices')}?symbol=${tokenSymbol}&period=${period}&source=fast&from=${from}&chainId=42161&limit=${limit}`;

  const res = await fetch(url).then((res) => res.json());
  let prices = res?.prices;
  if (!prices || prices.length < 1) {
    //throw new Error(`not enough prices data: ${prices?.length}`);
    return [];
  }
  //const result = res.candles.map(parseOracleCandle);
  const result = prices.map(formatBarInfo);

  return result;
}

export async function fetchOracleCandles(chainId: number, tokenSymbol: string, period: string): Promise<Bar[]> {
  tokenSymbol = getNormalizedTokenSymbol(tokenSymbol);

  const limit = 5000;

  const timeDiff = CHART_PERIODS[period] * limit;
  const after = Math.floor(Date.now() / 1000 - timeDiff);

  //const url = getOracleKeeperUrl(chainId, "/prices/candles", { tokenSymbol, period, asc: true, after, limit });
  const url = `${getServerUrlNew(chainId, '/candleprices')}?symbol=${tokenSymbol}&period=${period}&source=fast&from=${after}&chainId=42161&limit=${limit}`;

  const res = await fetch(url).then((res) => res.json());

  let prices = res?.prices;
  if (!prices || prices.length < 1) {
    throw new Error(`not enough prices data: ${prices?.length}`);
  }

  //const result = res.candles.map(parseOracleCandle);
  const result = prices.map(formatBarInfo);

  return result;
}

function parseOracleCandle(rawCandle: number[]): Bar {
  const [timestamp, open, high, low, close] = rawCandle;

  return {
    time: timestamp + timezoneOffset,
    open,
    high,
    low,
    close,
  };
}

function formatBarInfo(bar) {
  const { t, o: open, c: close, h: high, l: low } = bar;
  return {
    time: t + timezoneOffset,
    open,
    close,
    high,
    low,
  };
}
