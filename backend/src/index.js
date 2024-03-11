// server.js
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import path from 'path';

import models from 'models';
import { CreateListenerServer, ManageContext } from 'utils';
import { CreateServer } from 'apollo';

const { graphqlUploadExpress } = require('graphql-upload-minimal');
const cors = require('cors');
const app = express();
const LISTENER_PORT = 5002;

app.use(express.json());
// Enable CORS for all routes
app.use(cors());

app.use('/images', express.static(path.join(__dirname, './images')));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

const { httpServer, WEB_PROTOCOL, SOCKET_PROTOCOL } = CreateListenerServer(app);

const server = CreateServer(httpServer);

const ServerStart = async () => {
  return await server.start();
};

models.sequelize.sync({ force: false }).then(async () => {
  ServerStart().then((res) => {
    app.use(
      '/graphql',
      cors(),
      json(),
      graphqlUploadExpress({
        maxFileSize: 10 * 1024 * 1024 * 1024, //  file not larger 10GB
        maxFiles: 10,
      }),
      expressMiddleware(server, {
        context: async (ctx) => ManageContext(ctx, models),
      })
    );
    httpServer.listen({ port: LISTENER_PORT }, () => {
      console.log('===================================================');
      console.log('===================================================');
      console.log(
        `🚀 Server ready at ${WEB_PROTOCOL}://localhost:${LISTENER_PORT}/graphql`
      );
      console.log(
        `🚀 Subscriptions ready at ${SOCKET_PROTOCOL}://localhost:${LISTENER_PORT}/ws`
      );
      console.log('===================================================');
      console.log('===================================================');
    });
  });
});
