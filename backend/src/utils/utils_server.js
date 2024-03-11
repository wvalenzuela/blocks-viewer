import http from 'http';

export const CreateListenerServer = (app) => {
  return {
    httpServer: http.createServer(app),
    WEB_PROTOCOL: 'http',
    SOCKET_PROTOCOL: 'ws',
  };
};
