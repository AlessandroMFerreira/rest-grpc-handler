# rest-grpc-handler

`rest-grpc-handler` is a versatile mock server designed for both Rest and gRPC calls, facilitating the testing of applications by simulating backend services. This tool automatically generates a structured mock environment based on your configuration, making it an essential asset for developers looking to streamline their testing process.

## Installation

To install `rest-grpc-handler`, run the following command:
```
npm i rest-grpc-handler
```

## Getting Started

To start the server, execute:
```
npx rest-grpc-handler
```


Upon launch, `rest-grpc-handler` checks for the presence of specific configuration files and folders. If they are not found, it creates the following structure within your project:
```
requests/ 
    grpc/ 
    http-proxy/ 
rest_grpc_handler/ 
    protos/ 
    config.json 
case.json
```


### Configuration

- **Protos Folder**: Place your `.proto` files in the `rest_grpc_handler/protos` directory. These files are used by the gRPC server to construct the methods for the calls.

- **config.json**: Configures the ports for the servers and enables or disables them. Default configuration:

```json
{
  "grpc": {"port": 50051, "enabled": true},
  "http": {"port": 50052, "enabled": true}
}
```
- case.json: Determines the naming convention for mock storage directories based on the case property. Default content:
```json
{"case":"default"}
```

### Mocks Organization
Mocks are organized under the requests/ directory, divided into grpc and http-proxy for respective call types. The server dynamically creates and stores mocks based on the case.json configuration and the request paths.

#### Example
For a **GET** request to **http://my_api_gateway/products/list?id=2**, and with **case.json** set to {"case":"view_the_second_product_page"}, the following structure is generated:

```
./requests/
    http-proxy/
        view_the_second_product_page/
            products_list?id=2/
                get/
                    0.json
```

The **0.json** file is automatically generated upon a call if no mock exists yet. If your application makes multiple calls to the same resource, a new **.json** file is created for each call. For instance, if your application makes 3 calls to the same resource mentioned in the example, the directory **./requests/http-proxy/view_the_second_product_page/products_list?id=2/get/** will contain the files **0.json**, **1.json**, **2.json**, etc., sequentially.

### Request Counter Reset

The **rest-grpc-handler** module internally maintains a request counter for each resource accessed while the server is running. This feature enables it to determine whether a call to a specific resource is the first or a subsequent one.

To reset the request counter, send a GET request to:

```
http://localhost:50052/requestCounter/reset
```
This counter is stored in memory, so it is reset to zero whenever the server is restarted.


### Mock Files Structure
- **REST Mocks**: Control the status, headers, and body of the response.

```json
{
  "status": 200,
  "headers": {},
  "body": {}
}
```

- **gRPC Mocks**: Simpler structure, primarily containing the message returned by the called methods.

```json
{"data":[{"key":"MY_KEY","value":"MY_VALUE"}]}
```

rest-grpc-handler aims to provide a mock for any call made, eliminating the need for prior resource mapping. This flexibility allows for a wide range of testing scenarios, making it a valuable tool for development and testing teams.
