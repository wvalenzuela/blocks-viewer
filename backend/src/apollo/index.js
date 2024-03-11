import fs from 'fs';
import { ApolloServer } from '@apollo/server';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';

import models from '../models';
import resolver_schema from '../graphql';
import { directiveResolvers } from 'utils';

const { typeDefs, resolvers } = resolver_schema;
const { SERVER_PLAYGROUND } = process.env;
const playground_on = SERVER_PLAYGROUND === 'false' ? false : true;
const { NODE_ENV } = process.env;
console.log({ NODE_ENV, playground_on, SERVER_PLAYGROUND });
let plugins = ApolloServerPluginLandingPageLocalDefault({ footer: false });

if (!playground_on) {
  plugins = {
    async serverWillStart() {
      return {
        async renderLandingPage() {
          const html = fs.readFileSync(
            path.join(__dirname, './landing_page.html'),
            'utf8'
          );
          return { html };
        },
      };
    },
  };
}
const schema = makeExecutableSchema({ typeDefs, resolvers });

export const CreateServer = (httpServer) => {
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  });
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        // You can define your own function for setting a dynamic context
        const { connectionParams } = ctx;
        return {
          models,
        };
      },
    },
    wsServer
  );
  const server = new ApolloServer({
    schema: schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      // Install a landing page plugin based on NODE_ENV
      plugins,
    ],
    directiveResolvers,
    formatError: (formattedError, error) => {
      // Don't give the specific errors to the client.
      if (error.message.startsWith('Database Error: ')) {
        return new Error('Internal server error');
      }
      // Strip `Validation: ` prefix and use `extensions.code` instead
      if (formattedError.message.startsWith('Validation:')) {
        return {
          ...formattedError,
          message: formattedError.message.replace(/^Validation: /, ''),
          extensions: { ...formattedError?.extensions, code: 'VALIDATION' },
        };
      }
      // Otherwise, return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return formattedError;
    },
    csrfPrevention: false,
  });
  return server;
};
