const GRPC_CONFIG_FOLDER = `${process.env.ROOT_DIR}/rest_grpc_handler/grpc`;
const GRPC_PROTO_FOLDER = `${GRPC_CONFIG_FOLDER}/protos`;
const GRPC_MOCK_FOLDER = `${process.env.ROOT_DIR}/requests/grpc`;
const GRPC_CONFIG_FILE = `${GRPC_CONFIG_FOLDER}/config.json`;
const CASE_FILE = `${process.env.ROOT_DIR}/case.json`;
const HTTP_PROXY_CONFIG_FOLDER = `${process.env.ROOT_DIR}/rest_grpc_handler/http-proxy`;
const HTTP_PROXY_CONFIG_FILE = `${HTTP_PROXY_CONFIG_FOLDER}/config.json`;
const HTTP_PROXY_MOCK_FOLDER = `${process.env.ROOT_DIR}/requests/http-proxy`;


export { 
    GRPC_CONFIG_FOLDER,
    GRPC_PROTO_FOLDER,
    GRPC_MOCK_FOLDER,
    GRPC_CONFIG_FILE,
    CASE_FILE,
    HTTP_PROXY_CONFIG_FOLDER,
    HTTP_PROXY_CONFIG_FILE,
    HTTP_PROXY_MOCK_FOLDER
};
