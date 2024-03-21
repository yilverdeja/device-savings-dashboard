import { NextFunction, Request, Response } from 'express';
import { savingsService } from '../services/savingsService';
import { DataService } from '../services/dataService';
import getDateChunks from '../utils/dateChunks';
import { DeviceSavingsResolution, DeviceSavingsResponse } from '../types';
import { CustomError } from '../utils/customError';
import { validationResult } from 'express-validator';

const deviceSavingsRetrievalController =
	(dataService: DataService) =>
	async (
		req: Request,
		res: Response<DeviceSavingsResponse>,
		next: NextFunction
	) => {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return next(
				new CustomError(
					400,
					'The query and/or params were invalid',
					'Validation Error',
					validationErrors.array()
				)
			);
		}

		// convert deviceId into an integer
		const { deviceId } = req.params;
		const id = parseInt(deviceId);

		// convert from and to to valid dates, and resolution to correct type
		const { from, to, resolution } = req.query;
		const currentDate = new Date();
		const defaultToDate = currentDate;

		// defaults to current date
		const toDate =
			to === undefined ? defaultToDate : new Date(to as string);

		// defaults to 30 days before toDate
		const fromDate =
			from === undefined
				? new Date(toDate.setDate(toDate.getDate() - 30))
				: new Date(from as string);

		// casts to the right type
		const resolutionType: DeviceSavingsResolution =
			resolution as DeviceSavingsResolution;

		// create chunks based on resolution
		const dateChunks = getDateChunks(fromDate, toDate, resolutionType);

		try {
			// try to get the cached device data
			const { totalCarbon: carbon, totalDiesel: diesel } =
				await savingsService.getSavingsData(id);

			// get total energy savings per chunk range
			const data = dateChunks.map((chunk) => {
				const chunkTotal = savingsService.calculateTotalSavedInRange(
					id,
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
				device_id: id,
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
