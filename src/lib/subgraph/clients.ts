import { createClient, createClientNoCache } from "./utils";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, BASE_TESTNET, ETH_MAINNET } from "config/chains";

export const chainlinkClient = createClient(ETH_MAINNET, "chainLink");

export const arbitrumGraphClient = createClient(ARBITRUM, "stats");
export const arbitrumReferralsGraphClient = createClient(ARBITRUM, "referrals");
export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");

export const avalancheGraphClient = createClient(AVALANCHE, "stats");
export const avalancheReferralsGraphClient = createClient(AVALANCHE, "referrals");
export const avalancheFujiReferralsGraphClient = createClient(BASE_TESTNET, "referrals");

export const avalancheFujiSyntheticsStatsClient = createClientNoCache(BASE_TESTNET, "syntheticsStats");

export function getSyntheticsGraphClient(chainId: number) {
  if (chainId === BASE_TESTNET) {
    return avalancheFujiSyntheticsStatsClient;
  }

  return null;
}

export function getGmxGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheGraphClient;
  } else if (chainId === ARBITRUM_GOERLI) {
    return null;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getReferralsGraphClient(chainId) {
  if (chainId === ARBITRUM) {
    return arbitrumReferralsGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheReferralsGraphClient;
  } else if (chainId === BASE_TESTNET) {
    return avalancheFujiReferralsGraphClient;
  }
  throw new Error(`Unsupported chain ${chainId}`);
}
