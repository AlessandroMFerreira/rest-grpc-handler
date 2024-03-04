import fs from 'fs';
import {
  HTTP_PROXY_MOCK_FOLDER,
  CASE_FILE
} from '../utils.js';

function getCaseName(projectRoot) {
  var caseName = '';
  try {
    if (fs.existsSync(`${projectRoot}/${CASE_FILE}`)) {
      let mockFile = JSON.parse(fs.readFileSync(`${projectRoot}/${CASE_FILE}`, 'utf8'));
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

  if (requestElement) {
    let position = requestCounter.indexOf(requestElement);
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

function increaseRequestNumber(caseName, endPointFolderName, methodName, requestCounter) {
  let requestElement = requestCounter.find(
    (element) => element.case === caseName && element.endPoint === endPointFolderName
      && element.method === methodName);
  if (requestElement) {
    let position = requestCounter.indexOf(requestElement);
    requestCounter[position].numberOfRequests++;
  }
}

function getMockResponse(projectRoot, endPoint, method, requestCounter) {
  try {
    let caseName = getCaseName(projectRoot);
    let endPointFolderName = getEndPointFolderName(endPoint);
    let methodName = method.toLowerCase();
    let mockFolderPath = `${projectRoot}/${HTTP_PROXY_MOCK_FOLDER}/${caseName}${endPointFolderName}/${methodName}`
    let requestNumber = getRequestNumber(caseName, endPointFolderName, methodName, requestCounter);

    // If there is no mock folder, create one
    if (!fs.existsSync(`${mockFolderPath}/${requestNumber}.json`)) {
      fs.mkdirSync(mockFolderPath, { recursive: true })

      let obj = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {}
      }

      fs.writeFileSync(`${mockFolderPath}/${requestNumber}.json`, JSON.stringify(obj), 'utf8');

      return {};
    }

    increaseRequestNumber(caseName, endPointFolderName, methodName, requestCounter);
    return JSON.parse(fs.readFileSync(`${mockFolderPath}/${requestNumber}.json`, 'utf8'));
  } catch (error) {
    return {};
  }
}

function resetRequestCounter(requestCounter, res) {
  requestCounter.forEach((item) => {
    item.numberOfRequests = 0;
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({}));
}

function sendResponse(data, res) {
  let status = data.status ? data.status : 200;
  let headers = data.headers ? data.headers : { 'Content-Type': 'application/json' };
  let body = data.body ? data.body : {};

  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

export {
  getMockResponse,
  resetRequestCounter,
  sendResponse
}
