import startGrpcerver from './src/main/grpc/grpcServer.js';
import startHttpProxy from './src/main/http-proxy/proxyServer.js';

startGrpcerver();
startHttpProxy();