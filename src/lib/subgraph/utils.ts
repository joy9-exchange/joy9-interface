import { ApolloClient, InMemoryCache, DefaultOptions } from "@apollo/client";
import { getSubgraphUrl } from "config/subgraph";

export function createClient(chainId: number, subgraph: string) {
  const url = getSubgraphUrl(chainId, subgraph);
  return new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  });
}

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

export function createClientNoCache(chainId: number, subgraph: string) {
  const url = getSubgraphUrl(chainId, subgraph);
  return new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  });
}