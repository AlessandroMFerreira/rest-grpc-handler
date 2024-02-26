import fs from 'fs';
import {
  HTTP_PROXY_CONFIG_FOLDER,
  HTTP_PROXY_CONFIG_FILE,
  HTTP_PROXY_MOCK_FOLDER,
  CASE_FILE
} from '../util.js';

function createConfiguration() {
  // Creates the configuration folder if it does not exist
  if (!fs.existsSync(HTTP_PROXY_CONFIG_FOLDER)) {
    fs.mkdirSync(HTTP_PROXY_CONFIG_FOLDER, { recursive: true });
  }

  if (!fs.existsSync(HTTP_PROXY_CONFIG_FILE)) {
    let data = {
      port: 50052
    }
    fs.writeFileSync(HTTP_PROXY_CONFIG_FILE, JSON.stringify(data), 'utf8');
  }
}

function createDefaultMockFolder() {
  if (!fs.existsSync(HTTP_PROXY_MOCK_FOLDER)) {
    fs.mkdirSync(HTTP_PROXY_MOCK_FOLDER, { recursive: true });
  }
}

function getCaseName() {
  var caseName = '';
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

function getEndPointFolderName(endPoint) {
  let endPointFolderName = endPoint.replaceAll('/', '_').replaceAll('-', '_');
  if (endPointFolderName.startsWith('_')) {
    endPointFolderName = endPointFolderName.substring(1);
  }

  return endPointFolderName;
}

function getRequestNumber(caseName, endPointFolderName, methodName, requestCounter) {

  let requestElement = requestCounter.find((element) => element.case === caseName && element.endPoint === endPointFolderName && element.method === methodName);

  if(requestElement)  {
    let position = requestCounter.indexOf(requestElement);
    requestCounter[position].numberOfRequests++;

    return requestCounter[position].numberOfRequests;
  }

  requestCounter.push({
    case: caseName,
    endPoint: endPointFolderName,
    method: methodName,
    numberOfRequests: 0
  });

  return 0;

}
function decreaseRequestNumber(caseName, endPointFolderName, methodName, requestCounter) {
  let requestElement = requestCounter.find(
    (element) => element.case === caseName && element.endPoint === endPointFolderName 
    && element.method === methodName);
  if(requestElement)  {
    let position = requestCounter.indexOf(requestElement);
    requestCounter[position].numberOfRequests--;

  }
}

function getMockResponse(endPoint, method, requestCounter) {
  try {
    let caseName = getCaseName();
    let endPointFolderName = getEndPointFolderName(endPoint);
    let methodName = method.toLowerCase();
    let mockFolderPath = `${HTTP_PROXY_MOCK_FOLDER}/${caseName}${endPointFolderName}/${methodName}`
    let requestNumber = getRequestNumber(caseName, endPointFolderName, methodName, requestCounter);

    // If there is no mock folder, create one
    if (!fs.existsSync(`${mockFolderPath}/${requestNumber}.json`)) {
      fs.mkdirSync(mockFolderPath, { recursive: true })

      if(requestNumber === 0){
        fs.writeFileSync(`${mockFolderPath}/${requestNumber}.json`, '');
      } else {
        decreaseRequestNumber(caseName, endPointFolderName, methodName, requestCounter);
      }
      
      return {};
    }

    return JSON.parse(fs.readFileSync(`${mockFolderPath}/${requestNumber}.json`, 'utf8'));
  } catch (error) {
    return {};
  }
}

function loadConfiguration() {
  try {
    return JSON.parse(fs.readFileSync(HTTP_PROXY_CONFIG_FILE, 'utf8'));
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
  getMockResponse,
  loadConfiguration
}
