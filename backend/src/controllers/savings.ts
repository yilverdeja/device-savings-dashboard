import { NextFunction, Request, Response } from 'express';
import { savingsService } from '../services/savingsService';
import { DataService } from '../services/dataService';
import getDateChunks from '../utils/dateChunks';
import { DeviceSavingsResponse } from '../types';
import { CustomError } from '../utils/customError';

const deviceSavingsRetrievalController =
	(dataService: DataService) =>
	async (
		req: Request,
		res: Response<DeviceSavingsResponse>,
		next: NextFunction
	) => {
		const { deviceId } = req.params;
		const { startDate, endDate, resolution } = req.query;

		const today = new Date('2023-06-01');
		const from =
			startDate === undefined
				? new Date(today.setDate(today.getDate() - 30))
				: new Date(startDate as string);
		const to = endDate === undefined ? today : new Date(endDate as string);

		// make sure resolution is valid
		const reso: 'month' | 'week' | 'day' =
			resolution === 'month'
				? 'month'
				: resolution === 'week'
				? 'week'
				: resolution === 'day'
				? 'day'
				: 'month';

		// create chunks based on resolution
		const dateChunks = getDateChunks(from, to, reso);

		try {
			// try to get the cached device data
			const { totalCarbon: carbon, totalDiesel: diesel } =
				await savingsService.getSavingsData(parseInt(deviceId));

			// get total energy savings per chunk range
			const data = dateChunks.map((chunk) => {
				const chunkTotal = savingsService.calculateTotalSavedInRange(
					parseInt(deviceId),
					chunk.start,
					chunk.end
				);
				return {
					from: chunk.start,
					to: chunk.end,
					totalCarbon: chunkTotal.totalCarbon,
					totalDiesel: chunkTotal.totalDiesel,
				};
			});

			res.json({
				device_id: parseInt(deviceId),
				totalCarbon: carbon,
				totalDiesel: diesel,
				savingsChunks: data,
			});
		} catch (error) {
			next(
				new CustomError(
					500,
					'Error fetching device savings data',
					'Internal Server Error'
				)
			);
		}
	};

export default deviceSavingsRetrievalController;
