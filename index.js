#!/usr/bin/env node

import startGrpcServer from './src/main/grpc/grpcServer.js';
import startHttpProxy from './src/main/http-proxy/proxyServer.js';
import { init, loadConfigurationFile } from './src/main/init.js';

init(process.cwd());
const config = loadConfigurationFile(process.cwd());
startGrpcServer(process.cwd(), config);
startHttpProxy(process.cwd(), config);
