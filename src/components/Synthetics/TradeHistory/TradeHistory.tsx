import { Trans } from "@lingui/macro";
import { useTradeHistory } from "domain/synthetics/tradeHistory";
import { useChainId } from "lib/chains";
import { TradeHistoryRow } from "../TradeHistoryRow/TradeHistoryRow";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePositionsConstants } from "domain/synthetics/positions/usePositionsConstants";
import { MarketsInfoData } from "domain/synthetics/markets";
import { TokensData } from "domain/synthetics/tokens";

const PAGE_SIZE = 100;

type Props = {
  shouldShowPaginationButtons: boolean;
  marketsInfoData?: MarketsInfoData;
  tokensData?: TokensData;
};

export function TradeHistory(p: Props) {
  const { shouldShowPaginationButtons, marketsInfoData, tokensData } = p;
  const { chainId } = useChainId();
  const [pageIndex, setPageIndex] = useState(0);

  const { minCollateralUsd } = usePositionsConstants(chainId);
  const { tradeActions, isLoading: isHistoryLoading, updateTrades } = useTradeHistory(chainId, {
    marketsInfoData,
    tokensData,
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const isLoading = !minCollateralUsd || isHistoryLoading;

  const isEmpty = !isLoading && !tradeActions?.length;

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      updateTrades(undefined, true);
    }, 5 * 1000);
    console.log("useEffect running...");
    return () => clearInterval(interval);
  }, [updateTrades]);*/
  //console.log("history componet refreshing...", "pageIndex: ", pageIndex);
  //console.log("tradeActions: ", tradeActions);

  return (
    <div className="TradeHistory">
      {isLoading && (
        <div className="TradeHistoryRow App-box">
          <Trans>Loading...</Trans>
        </div>
      )}
      {isEmpty && (
        <div className="TradeHistoryRow App-box">
          <Trans>No trades yet</Trans>
        </div>
      )}
      {!isLoading &&
        tradeActions?.map((tradeAction) => (
          <TradeHistoryRow key={tradeAction.id} tradeAction={tradeAction} minCollateralUsd={minCollateralUsd!} />
        ))}
      {shouldShowPaginationButtons && (
        <div>
          {pageIndex > 0 && (
            <button className="App-button-option App-card-option" onClick={() => setPageIndex((old) => old - 1)}>
              <Trans>Prev</Trans>
            </button>
          )}
          {tradeActions && tradeActions.length >= PAGE_SIZE && (
            <button className="App-button-option App-card-option" onClick={() => setPageIndex((old) => old + 1)}>
              <Trans>Next</Trans>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
