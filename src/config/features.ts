import { ARBITRUM_GOERLI, BASE_TESTNET } from "./chains";
import { isDevelopment } from "./env";

export function getIsSyntheticsSupported(chainId: number) {
  return true;
  /*
  if (isDevelopment()) {
    return [BASE_TESTNET, ARBITRUM_GOERLI].includes(chainId);
  }

  return false;
  */
}
