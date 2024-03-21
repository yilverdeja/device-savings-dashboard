import { TotalSavingsData, savingsService } from './../services/savingsService';
import { DataService } from '../services/dataService';
import { Device, DevicesRequest, DevicesResponse } from '../types';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/customError';
import { validationResult } from 'express-validator';

export type DeviceWithTotalSavings = Device & TotalSavingsData;

const devicesRetrievalController =
	(dataService: DataService) =>
	async (
		req: Request,
		res: Response<DevicesResponse>,
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
				res.json({
					devices: deviceWithSavings,
				});
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
			res.json({ devices });
		}
	};

export default devicesRetrievalController;
