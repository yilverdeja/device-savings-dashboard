# Device Savings Dashboard

<!-- Add images here -->

## About

Developing a dashboard to retrieve energy savings information from specific devices. The focus of this project was the develop a backend to retrieve device saving information to be able to diplay it on a specific UI page. The major features are:

1. Retrieving a list of devices and their total savings so far
2. Retrieving device savings information of a specific device within a specified range

### Built With

#### Backend

-   Typescript
-   Node
-   Express

#### Frontend

-   Typescript
-   Vue
-   AntDesign: UI

## Getting Started

### Note

This project has only been tested on Node Versions `18.19.0` and `20.11.0`. Please consider using these Node versions if it doesn't work on other versions.

### Installation

On the root folder, install all the NPM packages with the following command.

```sh
npm run install
```

This will install the NPM packages on the root directory, the frontend directory and the backend directory.

## Scripts

After installing the NPM packages, start the backend server on port `5000` and the frontend on a port that vite configures.

### Server + Client

In the project directory, you can run both the server and client concurrently using:

```sh
npm start
```

This will start a node server on port `5000`, and a web server on an availale port.

### Server

In the backend directory, run the node server using:

```sh
npm start
```

This will start a node server on port `5000`

### Client

In the frontend directory, run the web server using:

```sh
npm run dev
```

This will start a web server on an availale port

## Endpoints

### Get Devices with Optional Savings Information

Retrieves a list of devices, with the option to include related savings information.

**HTTP Method**: `GET`  
**URL**: `/devices?includeSavings=true`

#### Request Parameters

-   `includeSavings` (boolean, optional): If set to `true`, the response will include savings information for each device.

#### Response Parameters

The response includes an array of devices, optionally augmented with savings information if `includeSavings` is set to true

Each device has the following parameters of the following types:

-   `id`: number
-   `name`: string
-   `timezone`: string

The following are the optional parameters if `includeSavings` is set to true

-   `totalCarbon`: number
-   `totalDiesel`: number
-   `averageCarbon`: number
-   `averageDiesel`: number

### Get Savings Over a Date Range

Retrieves a list of saving data of a specific device.

**HTTP Method**: `GET`  
**URL**: `/savings?from=DATE&to=DATE&resolution=RESOLUTION`

#### Request Parameters

-   `from` (optional): The start date for the savings data. Must be a string in an ISO format.
-   `to` (optional): The end date for the savings data. Must be a string in an ISO format.
-   `resolution` (optional): The resolution of the savings data (month, week, or day).

#### Response Parameters

The response includes savings data chunks for the specified date range and resolution.

-   `device_id`: number
-   `totalCarbon`: number
-   `totalDiesel`: number
-   `savingsChunks`: SavingsChunk[]

SavingsChunk is shaped below:

-   `from`: Date;
-   `to`: Date;
-   `totalCarbon`: number;
-   `totalDiesel`: number;

### Error Response

Both endpoints will return an error response in the case of a failure, such as when the request parameters are invalid or the server encounters an unexpected condition.

The error response is structured below:

-   `statusCode`: number;
-   `error`: string;
-   `message`: string;
-   `details` (optional): any;

## Notes & Improvements

Loading...
