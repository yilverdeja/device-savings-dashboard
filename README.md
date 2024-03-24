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

## Backend - Endpoints

The data in the backend is kept in the .csv files within the `src/data` directory and loaded onto the server on startup.

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

### Endpoint Tests

When the server starts, you can start retrieving data from it after seeing the `CSV data loaded successfully` message on the server console. Attempting to retrieve data from it will return an internal server error JSON that the data hasn't loaded.

-   `curl "http://localhost:5000/devices"`
    -   returns a list of devices each with device_id, name, and timezone info
-   `curl "http://localhost:5000/devices?includeSavings=true"`
    -   returns same as above but with totalCarbon, averageCarbon, totalDiesel and averageDiesel info
-   `curl "http://localhost:5000/savings/:device_id"`
    -   `device_id` is an available device_id on that can be found on `/devices`
    -   returns the device_id, with the totalCarbon and totalDiesel in it's lifespan. In addition, with a default of Jan to Dec 2023 at a monthly resolution, it should return an array of 12 chunks
    -   each chunk has the from date, the to date, the totalCarbon saved and the totalDiesel saved

## Frontend - UI

### Devices

<!-- Devices -->

When the client application starts, it fetches the `/devices` information on the backend with the additional `includeSavings` query. Admins can see the device names, in addition to an overview of the device savings and the timezone information.

### Device Savings - Overview

<!-- Device Savings Overview -->

Selecting a device card will open up a modal with more in-depth information about the device savings like the `total` and `monthly average` `carbon savings` and `diesel savings`.

If any of the carbon savings information is under 1000kg's, then the unit will change from `tonnes` to `kgs`.

### Device Savings - Details

<!-- Device Savings Details -->

Users can view the device savings from a specific time range. On startup, it's hardcoded to January to December of 2023 as that is the range in the `.csv` data files.

Selecting the `Last 30 Days`, `Last 60 Days` or `Last Year` buttons will update the range with an end date to the current date (i.e. 2024 - this year) and the start date will update accordingly. Since the data does not exist in the .csv file provided, the data will not be loaded into the graph.

In addition, I've added a `Month`, `Week` and `Day` selector to choose the resolution of the data retrieved. If it's set to month, the date range will be split into monthly chunks. If weeks then weekly chunks, and day into daily chunks. The graph will update accordingly.

The graph can be zoomed in and out, but it will not change the resolution of the data shown.
