import { useWeb3React } from "@web3-react/core";
import connectWalletImg from "img/ic_wallet_24.svg";
import { useCallback, useEffect } from "react";
import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";

import { Trans } from "@lingui/macro";
import cx from "classnames";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, BASE_TESTNET, getChainName } from "config/chains";
import { isDevelopment } from "config/env";
import { getIcon } from "config/icons";
import { useChainId } from "lib/chains";
import { getAccountUrl, isHomeSite } from "lib/legacy";
import { switchNetwork } from "lib/wallets";
import { useHistory, useLocation } from "react-router-dom";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import "./Header.css";
import { HeaderLink } from "./HeaderLink";
import { getIsSyntheticsSupported } from "config/features";

type Props = {
  openSettings: () => void;
  small?: boolean;
  setWalletModalVisible: (visible: boolean) => void;
  disconnectAccountAndCloseSettings: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
  tradePageVersion: number;
};

  /*
  {
    label: getChainName(ARBITRUM),
    value: ARBITRUM,
    icon: getIcon(ARBITRUM, "network"),
    color: "#264f79",
  },
  {
    label: getChainName(AVALANCHE),
    value: AVALANCHE,
    icon: getIcon(AVALANCHE, "network"),
    color: "#E841424D",
  },
*/

const NETWORK_OPTIONS = [
  {
    label: getChainName(BASE_TESTNET),
    value: BASE_TESTNET,
    icon: getIcon(BASE_TESTNET, "network"),
    color: "#E841424D",
  },
];

/* NETWORK_OPTIONS.push({
    label: getChainName(ARBITRUM_GOERLI),
    value: ARBITRUM_GOERLI,
    icon: getIcon(ARBITRUM_GOERLI, "network"),
    color: "#264f79",
  });
  */

export function AppHeaderUser({
  openSettings,
  small,
  setWalletModalVisible,
  disconnectAccountAndCloseSettings,
  redirectPopupTimestamp,
  showRedirectModal,
  tradePageVersion,
}: Props) {
  const { chainId } = useChainId();
  const { active, account } = useWeb3React();
  const showConnectionOptions = !isHomeSite();
  const location = useLocation();
  const history = useHistory();

  const tradeLink = "/trade";

  useEffect(() => {
    if (active) {
      setWalletModalVisible(false);
    }
  }, [active, setWalletModalVisible]);

  const onNetworkSelect = useCallback(
    (option) => {
      if (option.value === chainId) {
        return;
      }
      return switchNetwork(option.value, active);
    },
    [chainId, active]
  );

  const selectorLabel = getChainName(chainId);

  if (!active || !account) {
    return (
      <div className="App-header-user">
        <div className={cx("App-header-trade-link", { "homepage-header": isHomeSite() })}>
          <HeaderLink
            className="default-btn"
            to={tradeLink!}
            redirectPopupTimestamp={redirectPopupTimestamp}
            showRedirectModal={showRedirectModal}
          >
            {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
          </HeaderLink>
        </div>

        {showConnectionOptions ? (
          <>
            <ConnectWalletButton onClick={() => setWalletModalVisible(true)} imgSrc={connectWalletImg}>
              {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectWalletButton>
            <NetworkDropdown
              small={small}
              networkOptions={NETWORK_OPTIONS}
              selectorLabel={selectorLabel}
              onNetworkSelect={onNetworkSelect}
              openSettings={openSettings}
            />
          </>
        ) : (
          <LanguagePopupHome />
        )}
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  return (
    <div className="App-header-user">
      <div className={cx("App-header-trade-link")}>
        <HeaderLink
          className="default-btn"
          to={tradeLink!}
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
        </HeaderLink>
      </div>

      {showConnectionOptions ? (
        <>
          <div className="App-header-user-address">
            <AddressDropdown
              account={account}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
          <NetworkDropdown
            small={small}
            networkOptions={NETWORK_OPTIONS}
            selectorLabel={selectorLabel}
            onNetworkSelect={onNetworkSelect}
            openSettings={openSettings}
          />
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
