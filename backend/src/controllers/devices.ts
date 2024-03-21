import { savingsService } from './../services/savingsService';
import { DataService } from '../services/dataService';
import { Device } from '../types';
import { Request, Response } from 'express';

export type TotalSavingsData = {
	carbon: number;
	diesel: number;
};

export type DeviceWithTotalSavings = Device & TotalSavingsData;

const devicesRetrievalController =
	(dataService: DataService) => async (req: Request, res: Response) => {
		const devices = dataService.getDevices();
		if (!devices) {
			return res.status(503).send('Data is not loaded yet');
		}
		const { includeSavings } = req.query;
		if (includeSavings) {
			try {
				const deviceWithSavings: DeviceWithTotalSavings[] =
					await Promise.all(
						devices.map(
							async (device): Promise<DeviceWithTotalSavings> => {
								const savingsData: TotalSavingsData =
									await savingsService.getSavingsData(
										device.id
									);
								return { ...device, ...savingsData };
							}
						)
					);
				res.json(deviceWithSavings);
			} catch (error) {
				res.status(500).json({
					message: 'Error fetching devices with device saving data',
					error,
				});
			}
		} else {
			res.json(devices);
		}
	};

export default devicesRetrievalController;
