import http from 'http';
import httpProxy from 'http-proxy';
import {
  getMockResponse,
  resetRequestCounter
} from './setup.js';


// Create a proxy server
const proxy = httpProxy.createProxyServer({});

function startServer(projectRoot, config, requestCounter) {
  http.createServer(function (req, res) {
    const path = req.url.split('?')[0];

    if(path.includes('/reset')){
      resetRequestCounter(requestCounter, res);
    }

    const mockedResponse = getMockResponse(projectRoot, path, req.method, requestCounter);

    if (mockedResponse) {
      let status = mockedResponse.status ? mockedResponse.status : 200;
      let headers = mockedResponse.headers ? mockedResponse.headers : { 'Content-Type': 'application/json' };
      let body = mockedResponse.body ? mockedResponse.body : {};
      
      res.writeHead(status, headers);
      res.end(JSON.stringify(body));
    } else {
      proxy.web(req, res, { target: path });
    }
  }).listen(config.http.port, () => {
    console.log(`Http proxy server running on port ${config.http.port}`);
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
