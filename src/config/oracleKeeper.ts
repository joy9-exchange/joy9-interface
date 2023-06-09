import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, BASE_TESTNET } from "./chains";
import queryString from "query-string";

const ORACLE_KEEPER_URLS = {
  [ARBITRUM]: "https://seashell-app-zdvwo.ondigitalocean.app",

  [AVALANCHE]: "https://seashell-app-zdvwo.ondigitalocean.app",

  [ARBITRUM_GOERLI]: "https://oracle-api-arb-goerli-xyguy.ondigitalocean.app",

  [BASE_TESTNET]: "https://oracle-keeper-base-goerli.joy9.io",

  default: "https://gmx-oracle-keeper-ro-avax-fuji-d4il9.ondigitalocean.app",
};

export function getOracleKeeperBaseUrl(chainId: number) {
  const url = ORACLE_KEEPER_URLS[chainId] || ORACLE_KEEPER_URLS.default;

  return url;
}

export function getOracleKeeperUrl(chainId: number, path: string, query?: any) {
  const qs = query ? `?${queryString.stringify(query)}` : "";

  return `${getOracleKeeperBaseUrl(chainId)}${path}${qs}`;
}

export function getOracleKeeperUrlTmp(chainId: number, path: string, query?: any) {
  const qs = query ? `?${queryString.stringify(query)}` : "";

  return `https://api.joy9.io/${path}${qs}`;
}
