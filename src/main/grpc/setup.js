import fs from 'fs';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import {
  GRPC_CONFIG_FOLDER,
  GRPC_PROTO_FOLDER,
  GRPC_MOCK_FOLDER,
  GRPC_CONFIG_FILE,
  CASE_FILE
} from '../util.js';

function createDefaultMockFolder() {
  if (!fs.existsSync(GRPC_MOCK_FOLDER)) {
    fs.mkdirSync(GRPC_MOCK_FOLDER, { recursive: true });
  }
}

function getCaseName() {
  var caseName = '/';
  try {
    if (fs.existsSync(CASE_FILE)) {
      let mockFile = JSON.parse(fs.readFileSync(CASE_FILE, 'utf8'));
      caseName = mockFile.case ? `${mockFile.case}/` : '';
    }
  } catch (error) {
    return '';
  }

  return caseName;
}

function getMockResponse(packageName, serviceName) {

  try {
    let caseName = getCaseName();

    // If there is no mock file, create one
    if (!fs.existsSync(`${GRPC_MOCK_FOLDER}/${caseName}${packageName}/${serviceName}/0.json`)) {
      fs.mkdirSync(`${GRPC_MOCK_FOLDER}/${caseName}${packageName}/${serviceName}`, { recursive: true })
      fs.writeFileSync(`${GRPC_MOCK_FOLDER}/${caseName}${packageName}/${serviceName}/0.json`, '');

      return {};
    }

    return JSON.parse(fs.readFileSync(`${GRPC_MOCK_FOLDER}/${caseName}${packageName}/${serviceName}/0.json`, 'utf8'));
  } catch (error) {
    return {};
  }
}

function createConfiguration() {
  // Creates the configuration folder if it does not exist
  if (!fs.existsSync(GRPC_CONFIG_FOLDER)) {
    fs.mkdirSync(GRPC_CONFIG_FOLDER, { recursive: true });
  }
  // Creates configuration file if it does not exist
  if (!fs.existsSync(GRPC_CONFIG_FILE)) {
    let data = {
      host: 'localhost',
      port: 50051
    }
    fs.writeFileSync(GRPC_CONFIG_FILE, JSON.stringify(data), 'utf8');
  }

  // Creates proto folder if it does not exist
  if (!fs.existsSync(GRPC_PROTO_FOLDER)) {
    fs.mkdirSync(GRPC_PROTO_FOLDER, { recursive: true });
  }
}

function loadProtoFiles() {
  try {
    let packageDefinition = fs.readdirSync(GRPC_PROTO_FOLDER).map(el => {
      return protoLoader.loadSync(
        `${GRPC_PROTO_FOLDER}/${el}`,
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true
        }
      );
    });

    return packageDefinition.map((el) => grpc.loadPackageDefinition(el));
  } catch (error) {
    throw new Error('Error loading proto files');
  }
}

function loadConfigurationFile() {
  try {
    return JSON.parse(fs.readFileSync(GRPC_CONFIG_FILE, 'utf8'));
  } catch (error) {
    throw new Error('Error loading configuration file');
  }

}

function init() {
  if (!process.env.ROOT_DIR) {
    throw new Error('ROOT_DIR environment variable is required');
  }

  createConfiguration();
  createDefaultMockFolder();
}

export {
  init,
  loadProtoFiles,
  loadConfigurationFile,
  getMockResponse
};
