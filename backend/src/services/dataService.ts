import path from 'path';
import { parseCSV } from '../utils/csvParser';
import { setDataLoaded } from '../middlewares/checkDataLoaded';
import { Device, DeviceSaving } from '../types';

// data file paths
const devicesFilePath = path.join(__dirname, '../data', 'devices.csv');
const deviceSavingsFilePath = path.join(
	__dirname,
	'../data',
	'device-saving.csv'
);

export class DataService {
	private static instance: DataService;
	private devices: Device[] = [];
	private deviceSavings: DeviceSaving[] = [];

	private constructor() {
		this.loadCSVData();
	}

	public static getInstance(): DataService {
		if (!DataService.instance) {
			DataService.instance = new DataService();
		}
		return DataService.instance;
	}

	// function to load CSV data into memory
	private async loadCSVData() {
		try {
			this.devices = await parseCSV<Device>(devicesFilePath);
			this.deviceSavings = await parseCSV<DeviceSaving>(
				deviceSavingsFilePath
			);
			setDataLoaded(true);
			console.log('CSV data loaded successfully');
		} catch (error) {
			console.error('Error loading CSV data:', error);
			setDataLoaded(false);
		}
	}

	public getDevices() {
		return this.devices;
	}

	public getDeviceSavings() {
		return this.deviceSavings;
	}
}
