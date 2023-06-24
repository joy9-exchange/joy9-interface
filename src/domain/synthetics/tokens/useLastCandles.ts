import useSWR from "swr";
import { fetchLastOracleCandles } from "./requests";

export function useLastCandles(chainId: number, tokenSymbol?: string, period?: string, limit = 1000) {
  let { data: prices, mutate: updatePrices } = useSWR(tokenSymbol && period ? [chainId, "useLastCandles", tokenSymbol, period, limit] : null, {
    fetcher: () => fetchLastOracleCandles(chainId, tokenSymbol!, period!, limit),
    dedupingInterval: 60000,
    focusThrottleInterval: 60000 * 10,
  });

  return {
    candles: prices,
    updatePrices
  };
}
