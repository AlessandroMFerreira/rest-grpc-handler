import http from 'http';
import httpProxy from 'http-proxy';
import {
  getMockResponse,
  resetRequestCounter,
  sendResponse
} from './handleRequest.js';


// Create a proxy server
const proxy = httpProxy.createProxyServer({});

function startServer(projectRoot, config, requestCounter) {
  http.createServer(function (req, res) {
    const path = req.url.split('?')[0];

    if (path.includes('/reset')) {
      resetRequestCounter(requestCounter, res);
    } else {
      const mockedResponse = getMockResponse(projectRoot, path, req.method, requestCounter);

      if (mockedResponse) {
        sendResponse(mockedResponse, res);
      } else {
        proxy.web(req, res, { target: path });
      }
    }
  }).listen(config.port, () => {
    console.log(`Http proxy server running on port ${config.port}`);
  }).on('error', (error) => {
    console.log(`Error starting http proxy server: ${error}`);
    throw error;
  });
}

function start(projectRoot, config, requestCounter) {
  try {
    startServer(projectRoot, config, requestCounter);
  } catch (error) {
    throw error;
  }
}

export default start;
