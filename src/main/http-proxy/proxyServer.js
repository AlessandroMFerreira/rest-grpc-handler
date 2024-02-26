import http from 'http';
import httpProxy from 'http-proxy';
import {
  init,
  getMockResponse,
  loadConfiguration
} from './setup.js';

var config;
var requestCounter = [];

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

function startServer() {
  http.createServer(function (req, res) {
    const path = req.url.split('?')[0];

    const mockedResponse = getMockResponse(path, req.method, requestCounter);

    if (mockedResponse) {
      let status = mockedResponse.status ? mockedResponse.status : 200;
      let headers = mockedResponse.headers ? mockedResponse.headers : { 'Content-Type': 'application/json' };
      let body = mockedResponse.body ? mockedResponse.body : {};
      
      res.writeHead(status, headers);
      res.end(JSON.stringify(body));
    } else {
      proxy.web(req, res, { target: path });
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
