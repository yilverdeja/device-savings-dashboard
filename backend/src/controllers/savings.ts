import { Request, Response } from 'express';
import { savingsService } from '../services/savingsService';
import { DataService } from '../services/dataService';
import getDateChunks from '../utils/dateChunks';

const deviceSavingsRetrievalController =
	(dataService: DataService) => async (req: Request, res: Response) => {
		const { deviceId } = req.params;
		const { startDate, endDate, resolution } = req.query;

		const today = new Date('2023-06-01');
		const start =
			startDate === undefined
				? new Date(today.setDate(today.getDate() - 30))
				: new Date(startDate as string);
		const end = endDate === undefined ? today : new Date(endDate as string);

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
		const dateChunks = getDateChunks(start, end, reso);

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
					start: chunk.start,
					end: chunk.end,
					totalCarbon: chunkTotal.totalCarbon,
					totalDiesel: chunkTotal.totalDiesel,
				};
			});

			res.json({
				totalCarbon: carbon,
				totalDiesel: diesel,
				savingsData: data,
			});
		} catch (error) {
			res.status(500).json({
				message: 'Error fetching device savings data',
				error,
			});
		}
	};

export default deviceSavingsRetrievalController;
