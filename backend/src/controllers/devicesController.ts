import { TotalSavingsData, savingsService } from '../services/savingsService';
import { DataService } from '../services/dataService';
import { DeviceResponse } from '../types';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError';
import { validationResult } from 'express-validator';

const devicesRetrievalController =
	(dataService: DataService) =>
	async (
		req: Request,
		res: Response<DeviceResponse[]>,
		next: NextFunction
	) => {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return next(
				new CustomError(
					400,
					'The query was invalid',
					'Validation Error',
					validationErrors.array()
				)
			);
		}
		const devices = dataService.getDevices();
		if (!devices) {
			return next(
				new CustomError(
					503,
					'Device data has not yet loaded in the server',
					'Service Unavailable'
				)
			);
		}
		const { includeSavings = false } = req.query;
		if (includeSavings) {
			try {
				const deviceWithSavings: DeviceResponse[] = await Promise.all(
					devices.map(async (device): Promise<DeviceResponse> => {
						const savingsData: TotalSavingsData =
							await savingsService.getSavingsData(device.id);
						return { ...device, ...savingsData };
					})
				);
				res.json(deviceWithSavings);
			} catch (error) {
				next(
					new CustomError(
						500,
						'Error fetching devices with device saving data',
						'Internal Server Error'
					)
				);
			}
		} else {
			res.json(devices as DeviceResponse[]);
		}
	};

export default devicesRetrievalController;
