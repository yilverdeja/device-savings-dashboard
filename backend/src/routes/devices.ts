import { Router } from 'express';
import { Device } from '../types';
import { DataService } from './../services/dataService';
import { savingsService } from '../services/savingsService';

// types
type TotalSavingsData = {
	carbon: number;
	diesel: number;
};

type DeviceWithTotalSavings = Device & TotalSavingsData;

const router = Router();
const dataService = DataService.getInstance();

router.get('/devices', async (req, res) => {
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
								await savingsService.getSavingsData(device.id);
							return { ...device, ...savingsData };
						}
					)
				);
			res.json(deviceWithSavings);
		} catch (error) {
			res.status(500).json({
				message: 'Error fetching devices with saving data',
				error,
			});
		}
	} else {
		res.json(devices);
	}
});

export default router;
