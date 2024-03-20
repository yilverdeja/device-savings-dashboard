import express from 'express';
import path from 'path';
import cors from 'cors';
import { DeviceSaving, Device } from './types';
import { parseCSV } from './utils/csvParser';
import checkDataLoaded, { setDataLoaded } from './middlewares/checkDataLoaded';
import cacheManager from './utils/cacheManager';

// types
type TotalSavingsData = {
	carbon: number;
	diesel: number;
};

type DeviceWithTotalSavings = Device & TotalSavingsData;

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
app.get('/devices', async (req, res) => {
	const { includeSavings } = req.query;
	if (includeSavings) {
		try {
			const deviceWithSavings: DeviceWithTotalSavings[] =
				await Promise.all(
					devices.map(
						async (device): Promise<DeviceWithTotalSavings> => {
							const savingsData: TotalSavingsData =
								await getSavingsData(device.id);
							return { ...device, ...savingsData };
						}
					)
				);
			res.json(deviceWithSavings);
		} catch (error) {
			res.status(500).json({
				message: 'Error fetching devices with saving data',
				error,
			});
		}
	} else {
		res.json(devices);
	}
});

// endpoint to get data for a specific device and date range
app.get('/savings/:deviceId', async (req, res) => {
	const { deviceId } = req.params;
	const { startDate, endDate } = req.query;

	try {
		// try to get the cached device data
		const { carbon, diesel } = await getSavingsData(parseInt(deviceId));

		// filter the data based on the query
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

		res.json({
			totalCarbon: carbon,
			totalDiesel: diesel,
			savingsData: filteredData,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error fetching device savings data',
			error,
		});
	}
});

async function getSavingsData(deviceId: number): Promise<TotalSavingsData> {
	const cachedTotalCarbonKey = `totalCarbon-${deviceId}`;
	const cachedTotalDieselKey = `totalDiesel-${deviceId}`;

	let carbon: number | null = await cacheManager.get<number | null>(
		cachedTotalCarbonKey
	);
	let diesel: number | null = await cacheManager.get<number | null>(
		cachedTotalDieselKey
	);

	if (!(carbon && diesel)) {
		const total: TotalSavingsData = calculateTotalSaved(deviceId);
		carbon = total.carbon;
		diesel = total.diesel;

		await Promise.all([
			cacheManager.set(cachedTotalCarbonKey, carbon, 60 * 60 * 1000),
			cacheManager.set(cachedTotalDieselKey, diesel, 60 * 60 * 1000),
		]);
	}

	return { carbon, diesel };
}

function calculateTotalSaved(deviceId: number) {
	const deviceSaving = deviceSavings.filter(
		(ds) => ds.device_id === deviceId
	);
	const carbon = deviceSaving.reduce((acc, ds) => acc + ds.carbon_saved, 0);
	const diesel = deviceSaving.reduce((acc, ds) => acc + ds.fueld_saved, 0);
	return { carbon, diesel };
}

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
