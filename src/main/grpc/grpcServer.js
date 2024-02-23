import  grpc from '@grpc/grpc-js';
import { 
  init,
  loadProtoFiles,
  loadConfigurationFile,
  getMockResponse } from './setup.js';

var host;
var port;
var requestCounter = [];

function loadConfiguration() {
  const {host: serverHost, port: serverPort} = loadConfigurationFile();
  host = serverHost;
  port = serverPort;
}

function startServer() {
  loadConfiguration();
  var server = new grpc.Server();
  let protos = loadProtoFiles();
  protos.forEach((proto) => {
    Object.entries(proto).forEach(([packageName, packageObj]) => {
      Object.entries(packageObj).forEach(([serviceOrMessageName, serviceOrMessage]) => {
        if ('service' in serviceOrMessage) {
          const servicesObj = Object.keys(serviceOrMessage.service).reduce((services, serviceName) => {
            services[serviceName] = (call, callback) => {
              var returnedValue = getMockResponse(packageName, serviceName, requestCounter);

              if(!returnedValue){
                return callback({
                  code: grpc.status.NOT_FOUND
                });
              }
              return callback(null, returnedValue);
            };
            return services;
          }, {});
          server.addService(serviceOrMessage.service, servicesObj);
        }
      });
    });
  });
  server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) {
      console.log(`Error starting grpc server: ${err}`)
      return;
    }

    console.log(`Grpc server running on port ${port}`);
  });
}

function start() {
  try {
    init();
    startServer(); 
  } catch (error) {
    throw (error);
  }
}

export default start;
