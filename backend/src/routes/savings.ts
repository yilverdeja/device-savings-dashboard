import { Router } from 'express';
import { DataService } from '../services/dataService';
import { savingsService } from '../services/savingsService';

const router = Router();
const dataService = DataService.getInstance();

router.get('/savings/:deviceId', async (req, res) => {
	const { deviceId } = req.params;
	const { startDate, endDate, resolution } = req.query;

	try {
		// try to get the cached device data
		const { carbon, diesel } = await savingsService.getSavingsData(
			parseInt(deviceId)
		);

		// filter the data based on the query
		const today = new Date('2023-06-01');
		const start =
			startDate === undefined
				? new Date(today.setDate(today.getDate() - 30))
				: new Date(startDate as string);
		const end = endDate === undefined ? today : new Date(endDate as string);

		const filteredData = dataService.getDeviceSavings().filter((saving) => {
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

export default router;
