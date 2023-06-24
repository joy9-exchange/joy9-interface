import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, MAINNET, BASE_TESTNET, DEFAULT_CHAIN_ID } from "./chains";

export const GMX_STATS_API_URL = "https://stats.gmx.io/api";
export const JOY9_STATS_API_URL = {
  [ARBITRUM_GOERLI]: "https://arbgoerli.api.uniperp.io",
  [BASE_TESTNET]: "https://api.joy9.io",
}

const BACKEND_URLS = {
  default: "https://gmx-server-mainnet.uw.r.appspot.com",

  [MAINNET]: "https://gambit-server-staging.uc.r.appspot.com",
  [ARBITRUM_GOERLI]: "https://gambit-server-devnet.uc.r.appspot.com",
  [ARBITRUM]: "https://gmx-server-mainnet.uw.r.appspot.com",
  [AVALANCHE]: "https://gmx-avax-server.uc.r.appspot.com",
};

export function getServerBaseUrl(chainId: number) {
  if (!chainId) {
    throw new Error("chainId is not provided");
  }

  if (document.location.hostname.includes("deploy-preview")) {
    const fromLocalStorage = localStorage.getItem("SERVER_BASE_URL");
    if (fromLocalStorage) {
      return fromLocalStorage;
    }
  }

  return BACKEND_URLS[chainId] || BACKEND_URLS.default;
}

export function getServerUrl(chainId: number, path: string) {
  return `${getServerBaseUrl(chainId)}${path}`;
}

export function getServerUrlNew(chainId: number, path: string) {
  if (chainId && JOY9_STATS_API_URL.hasOwnProperty(chainId)){
    return `${JOY9_STATS_API_URL[chainId]}${path}`;
  }
  return `${JOY9_STATS_API_URL[DEFAULT_CHAIN_ID]}${path}`;
}
