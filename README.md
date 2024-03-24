# Device Savings Dashboard

![image](https://github.com/yilverdeja/c3c3aa95-fb85-4a34-8439-339c8a12fcd2/assets/29952939/457cfec9-db50-4d6a-b96e-3c340f0540f0)

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

![image](https://github.com/yilverdeja/c3c3aa95-fb85-4a34-8439-339c8a12fcd2/assets/29952939/a97729d1-c5f4-42bc-bd33-58d06757c22f)

When the client application starts, it fetches the `/devices` information on the backend with the additional `includeSavings` query. Admins can see the device names, in addition to an overview of the device savings and the timezone information.

### Device Savings - Overview

![image](https://github.com/yilverdeja/c3c3aa95-fb85-4a34-8439-339c8a12fcd2/assets/29952939/c13494f2-2cf8-4b9f-853c-17cf67b39539)

Selecting a device card will open up a modal with more in-depth information about the device savings like the `total` and `monthly average` `carbon savings` and `diesel savings`.

If any of the carbon savings information is under 1000kg's, then the unit will change from `tonnes` to `kgs`.

### Device Savings - Details

![image](https://github.com/yilverdeja/c3c3aa95-fb85-4a34-8439-339c8a12fcd2/assets/29952939/b0854d35-5b0e-4c9b-bbd7-4fcf042a5a94)

Users can view the device savings from a specific time range. On startup, it's hardcoded to January to December of 2023 as that is the range in the `.csv` data files.

Selecting the `Last 30 Days`, `Last 60 Days` or `Last Year` buttons will update the range with an end date to the current date (i.e. 2024 - this year) and the start date will update accordingly. Since the data does not exist in the .csv file provided, the data will not be loaded into the graph.

In addition, I've added a `Month`, `Week` and `Day` selector to choose the resolution of the data retrieved. If it's set to month, the date range will be split into monthly chunks. If weeks then weekly chunks, and day into daily chunks. The graph will update accordingly.

The graph can be zoomed in and out, but it will not change the resolution of the data shown.

## Notes & Known Issues

### Inconsistent Testing

-   **Issue**: The testing implemented throughout the codebase is inconsistent.
-   **Impact**: This inconsistency has led to bugs which required time to fix.
-   **Future Consideration**: Invest time in Test Driven Development (TDD) practices to streamline debugging and ensure reliability.

### Hardcoded Values

-   **Issue**: The frontend has the starting date range hardcoded to January-December 2023.
-   **Impact**: This limits the flexibility of date range selection.
-   **Future Consideration**: Add `lastUpdated` to each device in `/devices` and set the starting `to` date to this value on modal open.

### Range Validations

-   **Issue**: The frontend lacks validations for the date range input.
-   **Impact**: Invalid date ranges can cause server errors.
-   **Future Consideration**: Introduce client-side validation to improve user experience and reduce invalid server requests.

### Separation of Concerns

-   **Issue**: `dataService` and `savingsService` are singletons, leading to poor separation of concerns.
-   **Impact**: This design complicates the codebase and may introduce tight coupling.
-   **Future Consideration**: Refactor the services to better adhere to the separation of concerns principle.

### useDeviceSavings

-   **Issue**: The `useDeviceSavings` hook is currently not in use due to query issues.
-   **Impact**: The logic is directly integrated into components, which is not ideal.
-   **Future Consideration**: Debug and reimplement `useDeviceSavings` as intended for better maintainability.

### Vue3 Composition API vs React

-   **Issue**: The frontend's Vue3 code resembles React, contributing to bugs.
-   **Impact**: The learning curve of Vue3's Composition API affected code quality.
-   **Future Consideration**: Refactor the code to align more with Vue3 best practices.

### Ant Design

-   **Issue**: First-time use of Ant Design resulted in some dissatisfaction.
-   **Impact**: Preference for TailwindCSS due to personal comfort and experience.
-   **Future Consideration**: Consider using TailwindCSS or another easier to customize UI framework for future projects for improved productivity.

### Timestamps

#### No Device Timestamp Usage

-   **Issue**: Assumed immediate data retrieval, neglecting `device_timestamp` value in device savings data.
-   **Impact**: Simplifies project scope but may not represent realistic data flow.
-   **Future Consideration**: Incorporate device timestamps for accuracy.

#### No Timezone Adjustments

-   **Issue**: Ignored timezone differences between user and device data.
-   **Impact**: Data representation may not accurately reflect the device's timezone.
-   **Future Consideration**: Implement timezone adjustments for device data.

## Improvements

### Testing

**Idea**: Expand test coverage to include `savingsController`, services, and other critical components.

### Get Devices

**Idea**: Enhance device retrieval functionality by allowing searches by device names, assuming uniqueness.

### GET Savings API & Graph

**Ideas**:

-   Implement re-fetching of data upon zoom for real-time accuracy, though mindful of potential performance issues.
-   Consider front-end aggregation of day-resolution data to avoid excessive server load.
-   Optimize data delivery by fetching larger resolutions first, followed by background fetching of granular data.

### Types

**Idea**: Refine the usage of TypeScript by organizing and standardizing `Types` and `Interfaces` for better code clarity.

### Set Server Port

Right now, the server port is hardcoded into the `index.ts` backend file, and the `services/api-client.ts` frontend file. When updating a port in the backend file, the frontend file reference has to be updated too which can result in issues.
