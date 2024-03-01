import fs from 'fs';
import {
  CASE_FILE,
  WS_MOCK_FOLDER
} from '../utils.js';

function getCaseName(projectRoot) {
  var caseName = '';
  try {
    if (fs.existsSync(`${projectRoot}/${CASE_FILE}`)) {
      let mockFile = JSON.parse(fs.readFileSync(`${projectRoot}/${CASE_FILE}`, 'utf8'));
      caseName = mockFile.case ? `/${mockFile.case}` : '';
    }
  } catch (error) {
    return '';
  }

  return caseName;
}

function getRequestNumber(caseName,requestCounter) {


  let requestElement = requestCounter.find((element) => element.case === caseName && element.kind === 'web-socket');

  if (requestElement) {
    let position = requestCounter.indexOf(requestElement);
    return requestCounter[position].numberOfRequests;
  }

  requestCounter.push({
    case: caseName,
    kid: 'web-socket',
    numberOfRequests: 0
  });

  return 0;
}

function increaseRequestNumber(caseName, requestCounter) {
  let requestElement = requestCounter.find(
    (element) => element.case === caseName && element.kind === 'web-socket');
  if (requestElement) {
    let position = requestCounter.indexOf(requestElement);
    requestCounter[position].numberOfRequests++;
  }
}

function getMockResponse(projectRoot,requestCounter) {
  try {
    let caseName = getCaseName(projectRoot);
    let mockFolderPath = `${projectRoot}/${WS_MOCK_FOLDER}${caseName}`
    let requestNumber = getRequestNumber(caseName, requestCounter);

    // If there is no mock folder, create one
    if (!fs.existsSync(`${mockFolderPath}/${requestNumber}.json`)) {
      fs.mkdirSync(mockFolderPath, { recursive: true })

      fs.writeFileSync(`${mockFolderPath}/${requestNumber}.json`, JSON.stringify({}), 'utf8');

      return {};
    }

    increaseRequestNumber(caseName, requestCounter);
    return fs.readFileSync(`${mockFolderPath}/${requestNumber}.json`, 'utf8');
  } catch (error) {
    return {};
  }
}

export {
  getMockResponse
}
