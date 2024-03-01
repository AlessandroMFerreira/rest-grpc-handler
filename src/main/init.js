import fs from 'fs';
import {
  CONFIG_FOLDER,
  CONFIG_FLIE,
  MOCK_FOLDER,
  GRPC_MOCK_FOLDER,
  HTTP_PROXY_MOCK_FOLDER,
  PROTO_FOLDER,
  CASE_FILE,
  WS_MOCK_FOLDER
} from './utils.js';

function createConfiguration(projectRoot) {
  if (!fs.existsSync(`${projectRoot}/${CONFIG_FOLDER}`)) {
    fs.mkdirSync(`${projectRoot}/${CONFIG_FOLDER}`, { recursive: true });
  }

  if (!fs.existsSync(`${projectRoot}/${CONFIG_FLIE}`)) {
    let obj = {
      grpc:{
        port:50051,
        enabled: true
      },
      http: {
        port: 50052,
        enabled: true
      },
      ws: {
        port: 50053,
        enabled: true
      }
    }
    fs.writeFileSync(`${projectRoot}/${CONFIG_FLIE}`, JSON.stringify(obj));
  }

  if (!fs.existsSync(`${projectRoot}/${PROTO_FOLDER}`)) {
    fs.mkdirSync(`${projectRoot}/${PROTO_FOLDER}`, { recursive: true });
  }

  if(!fs.existsSync(`${projectRoot}/${CASE_FILE}`)){
    fs.writeFileSync(`${projectRoot}/${CASE_FILE}`, JSON.stringify({case: 'default'}) , 'utf8');
  }
}

function createDefaultMockFolder(projectRoot) {
  if (!fs.existsSync(`${projectRoot}/${MOCK_FOLDER}`)) {
    fs.mkdirSync(`${projectRoot}/${MOCK_FOLDER}`, { recursive: true });
  }

  if (!fs.existsSync(`${projectRoot}/${GRPC_MOCK_FOLDER}`)) {
    fs.mkdirSync(`${projectRoot}/${GRPC_MOCK_FOLDER}`, { recursive: true });
  }

  if (!fs.existsSync(`${projectRoot}/${HTTP_PROXY_MOCK_FOLDER}`)) {
    fs.mkdirSync(`${projectRoot}/${HTTP_PROXY_MOCK_FOLDER}`, { recursive: true });
  }

  if(!fs.existsSync(`${projectRoot}/${WS_MOCK_FOLDER}`)){
    fs.mkdirSync(`${projectRoot}/${WS_MOCK_FOLDER}`, { recursive: true });
  }
}

function loadConfigurationFile(projectRoot) {
  try {
    return JSON.parse(fs.readFileSync(`${projectRoot}/${CONFIG_FLIE}`, 'utf8'));
  } catch (error) {
    throw new Error('Error loading configuration file');
  }

}

function init(projectRoot) {
  createConfiguration(projectRoot);
  createDefaultMockFolder(projectRoot);
}

export {
  init,
  loadConfigurationFile
}
