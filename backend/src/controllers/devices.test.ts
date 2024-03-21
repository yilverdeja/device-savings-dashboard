import { describe, it, expect, vi } from 'vitest';
import devicesRetrievalController, { DeviceWithTotalSavings } from './devices';
import { DataService } from '../services/dataService';
import { Device, DeviceSaving } from '../types';
import { savingsService } from '../services/savingsService';
import { beforeEach } from 'node:test';

// Mock data based on the CSV file
const mockDevices: Device[] = [
	{ id: 1, name: 'advenio', timezone: 'Pacific/Chuuk' },
	{ id: 2, name: 'approbo', timezone: 'America/Mexico_City' },
	{ id: 3, name: 'ventito', timezone: 'America/North_Dakota/Beulah' },
	{ id: 4, name: 'ulterius', timezone: 'Africa/Cairo' },
];

// 30 days so the average monthly will become equal to the total in that month
const recordStartDate = new Date('2023-01-01T00:00:00.000Z');
const recordEndDate = new Date('2023-01-30T00:00:00.000Z');

// Mock savings data based on the CSV file
const mockSavings: DeviceSaving[] = [
	{
		device_id: 1,
		timestamp: recordStartDate,
		device_timestamp: recordStartDate,
		carbon_saved: 1,
		fueld_saved: 2,
	},
	{
		device_id: 1,
		timestamp: recordEndDate,
		device_timestamp: recordEndDate,
		carbon_saved: 10,
		fueld_saved: 10,
	},
	{
		device_id: 2,
		timestamp: recordStartDate,
		device_timestamp: recordStartDate,
		carbon_saved: 3,
		fueld_saved: 4,
	},
	{
		device_id: 2,
		timestamp: recordEndDate,
		device_timestamp: recordEndDate,
		carbon_saved: 10,
		fueld_saved: 10,
	},
	{
		device_id: 3,
		timestamp: recordStartDate,
		device_timestamp: recordStartDate,
		carbon_saved: 5,
		fueld_saved: 6,
	},
	{
		device_id: 3,
		timestamp: recordEndDate,
		device_timestamp: recordEndDate,
		carbon_saved: 10,
		fueld_saved: 10,
	},
	{
		device_id: 4,
		timestamp: recordStartDate,
		device_timestamp: recordStartDate,
		carbon_saved: 7,
		fueld_saved: 8,
	},
	{
		device_id: 4,
		timestamp: recordEndDate,
		device_timestamp: recordEndDate,
		carbon_saved: 10,
		fueld_saved: 10,
	},
];

// Mock data based on the CSV file
const mockDevicesWithSavings: DeviceWithTotalSavings[] = [
	{
		id: 1,
		name: 'advenio',
		timezone: 'Pacific/Chuuk',
		totalCarbon: 11,
		totalDiesel: 12,
		averageCarbon: 11,
		averageDiesel: 12,
	},
	{
		id: 2,
		name: 'approbo',
		timezone: 'America/Mexico_City',
		totalCarbon: 13,
		totalDiesel: 14,
		averageCarbon: 13,
		averageDiesel: 14,
	},
	{
		id: 3,
		name: 'ventito',
		timezone: 'America/North_Dakota/Beulah',
		totalCarbon: 15,
		totalDiesel: 16,
		averageCarbon: 15,
		averageDiesel: 16,
	},
	{
		id: 4,
		name: 'ulterius',
		timezone: 'Africa/Cairo',
		totalCarbon: 17,
		totalDiesel: 18,
		averageCarbon: 17,
		averageDiesel: 18,
	},
];

describe('devicesRetrievalController', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should retrieve devices without savings', async () => {
		// Mock the DataService with a getDevices method that returns the mock devices
		const dataService = {
			getDevices: vi.fn(() => mockDevices),
		} as unknown as DataService;

		const req: any = { query: {} };
		let capturedJson: Device[] | undefined;
		const res: any = {
			json: (data: any) => {
				capturedJson = data;
			},
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		};

		await devicesRetrievalController(dataService)(req, res);

		// Check if capturedJson is defined
		expect(capturedJson).toBeDefined();

		// If capturedJson is defined, perform the following checks
		if (capturedJson) {
			// Check if capturedJson is an array and has the same length as mockDevices
			expect(capturedJson).toBeInstanceOf(Array);
			expect(capturedJson).toHaveLength(mockDevices.length);

			// Optionally, check if the capturedJson contains objects with properties id, name, and timezone
			expect(
				capturedJson.every(
					(device) =>
						'id' in device &&
						'name' in device &&
						'timezone' in device
				)
			).toBe(true);

			// Check if the data in capturedJson matches the mockDevices
			expect(capturedJson).toEqual(mockDevices);
		}
	});

	it('should retrieve devices with savings', async () => {
		const mockGetSavingsData = vi.fn((deviceId) => {
			const totalCarbon = mockSavings
				.filter((ms) => ms.device_id === deviceId)
				.reduce((sum, ms) => sum + ms.carbon_saved, 0);
			const totalDiesel = mockSavings
				.filter((ms) => ms.device_id === deviceId)
				.reduce((sum, ms) => sum + ms.fueld_saved, 0);
			return Promise.resolve({
				totalCarbon: totalCarbon,
				totalDiesel: totalDiesel,
				averageCarbon: totalCarbon,
				averageDiesel: totalDiesel,
			});
		});

		vi.spyOn(savingsService, 'getSavingsData').mockImplementation(
			mockGetSavingsData
		);

		// Mock the DataService with a getDevices method that returns the mock devices
		const dataService = {
			getDevices: vi.fn(() => mockDevices),
			getDeviceSavings: vi.fn(() => mockSavings),
		} as unknown as DataService;

		const req: any = {
			query: {
				includeSavings: true,
			},
		};
		let capturedJson: DeviceWithTotalSavings[] | undefined;
		const res: any = {
			json: (data: any) => {
				capturedJson = data;
			},
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		};

		await devicesRetrievalController(dataService)(req, res);

		// Check if capturedJson is defined
		expect(capturedJson).toBeDefined();

		// If capturedJson is defined, perform the following checks
		if (capturedJson) {
			// Check if capturedJson is an array and has the same length as mockDevices
			expect(capturedJson).toBeInstanceOf(Array);
			expect(capturedJson).toHaveLength(mockDevices.length);

			// Optionally, check if the capturedJson contains objects with properties id, name, and timezone
			expect(
				capturedJson.every(
					(device) =>
						'id' in device &&
						'name' in device &&
						'timezone' in device &&
						'totalCarbon' in device &&
						'totalDiesel' in device
				)
			).toBe(true);

			// Check if the data in capturedJson matches the mockDevices
			expect(capturedJson).toEqual(mockDevicesWithSavings);
		}
	});

	it('should return a 503 status error if the data has not been loaded', async () => {
		// Mock the DataService with a getDevices method that returns the mock devices
		const dataService = {
			getDevices: vi.fn(() => null),
		} as unknown as DataService;

		const req: any = {
			query: {},
		};
		let capturedJson: string | undefined;
		const res: any = {
			json: vi.fn(),
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		};

		await devicesRetrievalController(dataService)(req, res);

		// Check if res.status was called with 503
		expect(res.status).toHaveBeenCalledWith(503);

		// Check if res.send was called with the correct message
		expect(res.send).toHaveBeenCalledOnce();
	});

	it('should return a 500 status error if the savings data for the devices cannot be fetched', async () => {
		const mockGetSavingsDataError = new Error(
			'Unable to retrieve savings data.'
		);

		const mockGetSavingsData = vi.fn(() => {
			throw mockGetSavingsDataError;
		});

		vi.spyOn(savingsService, 'getSavingsData').mockImplementation(
			mockGetSavingsData
		);

		// Mock the DataService with a getDevices method that returns the mock devices
		const dataService = {
			getDevices: vi.fn(() => mockDevices),
		} as unknown as DataService;

		const req: any = {
			query: {
				includeSavings: true,
			},
		};
		const res: any = {
			json: vi.fn(),
			status: vi.fn().mockReturnThis(),
			send: vi.fn(),
		};

		await devicesRetrievalController(dataService)(req, res);

		// Check if res.status was called with 500
		expect(res.status).toHaveBeenCalledWith(500);
	});
});
