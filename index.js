#!/usr/bin/env node

import startGrpcServer from './src/main/grpc/grpcServer.js';
import startHttpProxy from './src/main/http-proxy/proxyServer.js';
import { init, loadConfigurationFile } from './src/main/init.js';

const projectRoot = process.cwd();
var requestCounter = [];

init(projectRoot);
const config = loadConfigurationFile(projectRoot);

if (config?.grpc?.enabled) {
  startGrpcServer(projectRoot, config.grpc, requestCounter);
}

if (config?.http?.enabled) {
  startHttpProxy(projectRoot, config.http, requestCounter);
}