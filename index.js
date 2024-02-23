import startGrpcServer from './src/main/grpc/grpcServer.js';
import startHttpProxy from './src/main/http-proxy/proxyServer.js';

startGrpcServer();
startHttpProxy();
