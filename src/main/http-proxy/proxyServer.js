import http from 'http';
import httpProxy from 'http-proxy';
import {
  init,
  getMockResponse,
  loadConfiguration
} from './setup.js';

// Load the endpoints from a JSON file
var config;

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

function startServer() {
  http.createServer(function (req, res) {
    const path = req.url.split('?')[0];
  
    const endpoint = config.endPoints.find((endpoint) => endpoint === path);
  
    if (endpoint) {
      const mockedResponse = getMockResponse(endpoint, req.method);
  
      if (mockedResponse) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockedResponse));
      } else {
        proxy.web(req, res, { target: endpoint });
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  }).listen(config.port, () => {
    console.log(`Http proxy server running on port ${config.port}`);
  }).on('error', (error) => {
    console.log(`Error starting http proxy server: ${error}`);
    throw error;
  });
}

function start() {
  try {
    init();
    config = loadConfiguration();
    startServer();
  } catch (error) {
    throw error;
  }
}

export default start;
