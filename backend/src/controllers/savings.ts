import { NextFunction, Request, Response } from 'express';
import { savingsService } from '../services/savingsService';
import { DataService } from '../services/dataService';
import getDateChunks from '../utils/dateChunks';
import {
	DeviceSaving,
	DeviceSavingsResolution,
	DeviceSavingsResponse,
} from '../types';
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
		let dateChunks = getDateChunks(fromDate, toDate, resolutionType);
		const deviceSavings = dataService.getDeviceSavings() as DeviceSaving[];

		// TODO: Move dataChunks filtering somewhere else
		// get the minimum and maximum dates in the deviceSavings
		const minDeviceDate = new Date(
			Math.min(
				...deviceSavings
					.filter((ds) => ds.device_id === id)
					.map((ds) => ds.timestamp.getTime())
			)
		);
		const maxDeviceDate = new Date(
			Math.max(
				...deviceSavings
					.filter((ds) => ds.device_id === id)
					.map((ds) => ds.timestamp.getTime())
			)
		);

		// remove chunks that are not in the range
		dateChunks = dateChunks.filter((dateChunk) => {
			const chunkStart = dateChunk.from.getTime();
			const chunkEnd = dateChunk.to.getTime();
			const minTime = minDeviceDate.getTime();
			const maxTime = maxDeviceDate.getTime();

			// Check if the chunk overlaps with the device savings date range
			return chunkStart <= maxTime && chunkEnd >= minTime;
		});

		try {
			// try to get the cached device data
			const { totalCarbon, totalDiesel, averageCarbon, averageDiesel } =
				await savingsService.getSavingsData(id);

			// get total energy savings per chunk range
			const data = dateChunks.map((chunk) => {
				const chunkTotal = savingsService.calculateTotalSavedInRange(
					id,
					chunk.from,
					chunk.to
				);
				return {
					from: chunk.from,
					to: chunk.to,
					totalCarbon: chunkTotal.totalCarbon,
					totalDiesel: chunkTotal.totalDiesel,
				};
			});

			res.json({
				device_id: id,
				totalCarbon,
				totalDiesel,
				averageCarbon,
				averageDiesel,
				savingsChunks: data,
			});
		} catch (error) {
			let errorMessage;
			if (error instanceof Error) errorMessage = error.message;
			next(
				new CustomError(
					500,
					errorMessage || 'Error fetching device savings data',
					'Internal Server Error'
				)
			);
		}
	};

export default deviceSavingsRetrievalController;
