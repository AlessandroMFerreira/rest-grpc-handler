import  grpc from '@grpc/grpc-js';
import { 
  loadProtoFiles,
  getMockResponse } from './setup.js';

var requestCounter = [];

function startServer(projectRoot, config) {
  var server = new grpc.Server();
  let protos = loadProtoFiles(projectRoot);
  protos.forEach((proto) => {
    Object.entries(proto).forEach(([packageName, packageObj]) => {
      Object.entries(packageObj).forEach(([serviceOrMessageName, serviceOrMessage]) => {
        if ('service' in serviceOrMessage) {
          const servicesObj = Object.keys(serviceOrMessage.service).reduce((services, serviceName) => {
            services[serviceName] = (call, callback) => {
              var returnedValue = getMockResponse(projectRoot, packageName, serviceName, requestCounter);

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
  server.bindAsync(`localhost:${config.grpc.port}`, grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) {
      console.log(`Error starting grpc server: ${err}`)
      return;
    }

    console.log(`Grpc server running on port ${config.grpc.port}`);
  });
}

function start(projectRoot, config) {
  try {
    startServer(projectRoot, config); 
  } catch (error) {
    throw (error);
  }
}

export default start;
