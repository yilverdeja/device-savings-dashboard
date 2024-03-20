import express from 'express';
import path from 'path';
import cors from 'cors';
import { DeviceSaving, Device } from './types';
import { parseCSV } from './utils/csvParser';
import checkDataLoaded, { setDataLoaded } from './middlewares/checkDataLoaded';

// data file paths
const devicesFilePath = path.join(__dirname, 'data', 'devices.csv');
const deviceSavingsFilePath = path.join(__dirname, 'data', 'device-saving.csv');

// data storage
let devices: Device[] = [];
let deviceSavings: DeviceSaving[] = [];

// function to load CSV data into memory
async function loadCSVData() {
	try {
		devices = await parseCSV<Device>(devicesFilePath);
		deviceSavings = await parseCSV<DeviceSaving>(deviceSavingsFilePath);
		setDataLoaded(true);
		console.log('CSV data loaded successfully');
	} catch (error) {
		console.error('Error loading CSV data:', error);
		setDataLoaded(false);
	}
}

// load the data when the server starts
loadCSVData();

// create an express app
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
app.use(checkDataLoaded);

// endpoint to get devices
app.get('/devices', (req, res) => {
	res.json(devices);
});

// endpoint to get data for a specific device and date range
app.get('/device-savings/:deviceId', (req, res) => {
	const { deviceId } = req.params;
	const { startDate, endDate } = req.query;

	const start = new Date(startDate as string);
	const end = new Date(endDate as string);

	const filteredData = deviceSavings.filter((saving) => {
		const savingTimestamp = new Date(saving.timestamp);
		return (
			saving.device_id === parseInt(deviceId) &&
			savingTimestamp >= start &&
			savingTimestamp <= end
		);
	});

	res.json(filteredData);
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
