import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('ws');
import { getMockResponse } from './handleRequest.js';

function startWebSocketServer(projectRoot, config, requestCounter) {
  const wss = new WebSocket.Server({ port: config.port});

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);

      // Here you can define your mocked response
      const mockedResponse = getMockResponse(projectRoot,requestCounter);

      ws.send(mockedResponse, () => {
        ws.close();
      });
    });
  });

  console.log(`WebSocket server running on port ${config.port}`);
}

function start(projectRoot, config, requestCounter) {
  try {
    startWebSocketServer(projectRoot, config, requestCounter);
  } catch (error) {
    throw error;
  }
}

export default start;