import fs from 'fs';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import {
  GRPC_MOCK_FOLDER,
  PROTO_FOLDER,
  CASE_FILE
} from '../utils.js';

function getCaseName(projectRoot) {
  var caseName = '';
  try {
    if (fs.existsSync(`${projectRoot}/${CASE_FILE}`)) {
      let mockFile = JSON.parse(fs.readFileSync(CASE_FILE, 'utf8'));
      caseName = mockFile.case ? `${mockFile.case}/` : '';
    }
  } catch (error) {
    return '';
  }

  return caseName;
}

function reloadCounter(projectRoot) {
  try {
    let requestManagement = JSON.parse(fs.readFileSync(`${projectRoot}/${REQUEST_MANAGEMENT}`, 'utf8'));
    if (requestManagement.reloadCounter) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

function getRequestNumber(projectRoot, caseName, packageName, serviceName, requestCounter) {
  if (reloadCounter(projectRoot)) {
    requestCounter = [];
    return 0;
  } else {
    let requestElement = requestCounter.find(
      (element) => element.case === caseName && element.packageName === packageName && element.serviceName === serviceName);

    if (requestElement) {
      let position = requestCounter.indexOf(requestElement);
      return requestCounter[position].numberOfRequests;
    }

    requestCounter.push({
      case: caseName,
      packageName: packageName,
      serviceName: serviceName,
      numberOfRequests: 0
    });

    return 0;
  }
}

function increaseRequestNumber(caseName, packageName, serviceName, requestCounter) {
  let requestElement = requestCounter.find(
    (element) => element.case === caseName && element.packageName === packageName && element.serviceName === serviceName);
  if (requestElement) {
    let position = requestCounter.indexOf(requestElement);
    requestCounter[position].numberOfRequests++;
  }
}

function getMockResponse(projectRoot, packageName, serviceName, requestCounter) {

  try {
    let caseName = getCaseName(projectRoot);
    let mockFolderPath = `${projectRoot}/${GRPC_MOCK_FOLDER}/${caseName}${packageName}/${serviceName}`;
    let requestNumber = getRequestNumber(projectRoot, caseName, packageName, serviceName, requestCounter);

    // If there is no mock folder, create one
    if (!fs.existsSync(`${mockFolderPath}/${requestNumber}.json`)) {
      fs.mkdirSync(mockFolderPath, { recursive: true });

        fs.writeFileSync(`${mockFolderPath}/${requestNumber}.json`, JSON.stringify({}), 'utf8');

      return {};
    }

    increaseRequestNumber(caseName, packageName, serviceName, requestCounter);
    return JSON.parse(fs.readFileSync(`${mockFolderPath}/${requestNumber}.json`, 'utf8'));
  } catch (error) {
    return {};
  }
}

function loadProtoFiles(projectRoot) {
  try {
    let packageDefinition = fs.readdirSync(`${projectRoot}/${PROTO_FOLDER}`).map(el => {
      return protoLoader.loadSync(
        `${projectRoot}/${PROTO_FOLDER}/${el}`,
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

export {
  loadProtoFiles,
  getMockResponse
};
