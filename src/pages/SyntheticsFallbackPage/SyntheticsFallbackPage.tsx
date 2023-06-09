import Footer from "components/Footer/Footer";
import { Trans } from "@lingui/macro";
import { useEffect, useState } from "react";
import { sleep } from "lib/sleep";
import { ARBITRUM_GOERLI, BASE_TESTNET, getChainName } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useWeb3React } from "@web3-react/core";

export function SyntheticsFallbackPage() {
  const { active } = useWeb3React();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for chainId to be loaded before rendering
    sleep(100).then(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="page-layout">
      <div className="page-not-found-container">
        <div className="page-not-found">
          <h2>
            <Trans>V2 doesn't currently support this network</Trans>
          </h2>

          <p className="go-back">
            <div>
              <Trans>
                <span>Switch to:</span>
              </Trans>
            </div>

            <br />
            <div className="clickable underline" onClick={() => switchNetwork(BASE_TESTNET, active)}>
              {getChainName(BASE_TESTNET)}
            </div>
            <div className="clickable underline" onClick={() => switchNetwork(ARBITRUM_GOERLI, active)}>
              {getChainName(ARBITRUM_GOERLI)}
            </div>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
