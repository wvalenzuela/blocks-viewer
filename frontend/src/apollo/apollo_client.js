import {
  ApolloClient,
  ApolloLink,
  split,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { createClient } from 'graphql-ws';

import { HTTP_ADDRESS_GRAPHQL, WS_ADDRESS_GRAPHQL } from '../config';

const httpLink = new HttpLink({
  uri: HTTP_ADDRESS_GRAPHQL,
});

const AuthLink = (operation, next) => {
  return next(operation);
};

const httpLinkWithMiddleware = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        if (extensions.code === 'UNAUTHENTICATED') {
          console.log('UNAUTHENTICATED');
        }
      });
    }
  }),
  AuthLink,
  httpLink,
]);

const wsLink = new GraphQLWsLink(
  createClient({
    // lazy: true,
    url: WS_ADDRESS_GRAPHQL,
    connectionParams: () => {
      return {
        reconnect: true,
        reconnectInterval: 1000, // try to reconnect every 1 second
        reconnectTries: 10, // try to reconnect a maximum of 10 times
        ua: window.navigator.userAgent,
      };
    },
    credentials: 'omit', //include add cokies
  })
);
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLinkWithMiddleware
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
