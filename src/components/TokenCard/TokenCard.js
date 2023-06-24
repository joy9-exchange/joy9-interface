import { Trans } from "@lingui/macro";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import { isHomeSite } from "lib/legacy";

import { useWeb3React } from "@web3-react/core";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, BASE_TESTNET } from "config/chains";
import { getIcon } from "config/icons";
import { useChainId } from "lib/chains";
import { switchNetwork } from "lib/wallets";
import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";
import { useMarketTokensAPR } from "domain/synthetics/markets/useMarketTokensAPR";
import { isDevelopment } from "config/env";
import { formatAmount } from "lib/numbers";
import { useMarketTokensData, useMarketsInfo } from "domain/synthetics/markets";

import logoImg from "img/logo_GMX.png";
const glpIcon = getIcon("common", "glp");
const gmxIcon = getIcon("common", "gmx");
const gmIcon = getIcon("common", "gm");

export default function TokenCard({ showRedirectModal, redirectPopupTimestamp }) {
  const isHome = isHomeSite();
  const { chainId } = useChainId();
  const { active } = useWeb3React();

  const { marketsInfoData } = useMarketsInfo(chainId);
  const { marketTokensData } = useMarketTokensData(chainId, { isDeposit: false });

  const { avgMarketsAPR: fujiAvgMarketsAPR } = useMarketTokensAPR(BASE_TESTNET, {
    marketsInfoData,
    marketTokensData,
  });
  const { avgMarketsAPR: goerliAvgMarketsAPR } = useMarketTokensAPR(ARBITRUM_GOERLI, {
    marketsInfoData,
    marketTokensData,
  });
  const { avgMarketsAPR: arbitrumAvgMarketsAPR } = useMarketTokensAPR(ARBITRUM, { marketsInfoData, marketTokensData });
  const { avgMarketsAPR: avalancheAvgMarketsAPR } = useMarketTokensAPR(AVALANCHE, {
    marketsInfoData,
    marketTokensData,
  });

  const changeNetwork = useCallback(
    (network) => {
      if (network === chainId) {
        return;
      }
      if (!active) {
        setTimeout(() => {
          return switchNetwork(network, active);
        }, 500);
      } else {
        return switchNetwork(network, active);
      }
    },
    [chainId, active]
  );

  const BuyLink = ({ className, to, children, network }) => {
    if (isHome && showRedirectModal) {
      return (
        <HeaderLink
          to={to}
          className={className}
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          {children}
        </HeaderLink>
      );
    }

    return (
      <Link to={to} className={className} onClick={() => changeNetwork(network)}>
        {children}
      </Link>
    );
  };

  return (
    <div className="Home-token-card-options">
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={logoImg} width="40" alt="JOY9 Icons" /> JOY9
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>JOY9 is the utility and governance token. Accrues 30% of the platform's generated fees.</Trans>
          </div>
          <div className="Home-token-card-option-apr">
            <Trans>Base APR:</Trans> <APRLabel chainId={ARBITRUM} label="gmxAprTotal" />
          </div>
          <div className="Home-token-card-option-action">
            <div className="buy">
              <BuyLink to="/buy_joy9" className="default-btn" network={ARBITRUM}>
                <Trans>Buy on Base</Trans>
              </BuyLink>
            </div>
            <ExternalLink href="https://doc.joy9.io/general/tokenomics" className="default-btn read-more">
              <Trans>Read more</Trans>
            </ExternalLink>
          </div>
        </div>
      </div>

      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={gmIcon} alt="gmxBigIcon" /> JLP
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>
            JLP is the liquidity provider token for joy9 markets. Accrues 70% of the joy9 markets generated fees.
            </Trans>
          </div>

          <div className="Home-token-card-option-apr">
            <span>
              <Trans>Base APR:</Trans> {formatAmount(arbitrumAvgMarketsAPR, 2, 2)}%
            </span>
          </div>

          <div className="Home-token-card-option-action">
            <div className="buy">
              <BuyLink to="/pools" className="default-btn" network={BASE_TESTNET}>
                <Trans>Buy on Base</Trans>
              </BuyLink>
            </div>
            {/* <a
                href="https://gmxio.gitbook.io/gmx/glp"
                target="_blank"
                rel="noreferrer"
                className="default-btn read-more"
              >
                <Trans>Read more</Trans>
              </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
