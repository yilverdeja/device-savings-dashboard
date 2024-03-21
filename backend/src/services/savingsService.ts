import cacheManager from './cacheManager';
import { DataService } from './dataService';

// types
export type TotalSavingsData = {
	totalCarbon: number;
	totalDiesel: number;
	averageCarbon: number;
	averageDiesel: number;
};

const dataService = DataService.getInstance();

class SavingsService {
	async getSavingsData(deviceId: number): Promise<TotalSavingsData> {
		try {
			const cachedTotalCarbonKey = `totalCarbon-${deviceId}`;
			const cachedTotalDieselKey = `totalDiesel-${deviceId}`;
			const cachedMonthAverageCarbonKey = `totalCarbon-${deviceId}`;
			const cachedMonthAverageDieselKey = `totalDiesel-${deviceId}`;

			let totalCarbon: number | null = await cacheManager.get<
				number | null
			>(cachedTotalCarbonKey);
			let totalDiesel: number | null = await cacheManager.get<
				number | null
			>(cachedTotalDieselKey);
			let averageCarbon: number | null = await cacheManager.get<
				number | null
			>(cachedMonthAverageCarbonKey);
			let averageDiesel: number | null = await cacheManager.get<
				number | null
			>(cachedMonthAverageDieselKey);

			if (
				!(totalCarbon && totalDiesel && averageCarbon && averageDiesel)
			) {
				const total: TotalSavingsData =
					this.calculateTotalSaved(deviceId);
				totalCarbon = total.totalCarbon;
				totalDiesel = total.totalDiesel;
				averageCarbon = total.averageCarbon;
				averageDiesel = total.averageDiesel;

				await Promise.all([
					cacheManager.set(
						cachedTotalCarbonKey,
						totalCarbon,
						60 * 60 * 1000
					),
					cacheManager.set(
						cachedTotalDieselKey,
						totalDiesel,
						60 * 60 * 1000
					),
					cacheManager.set(
						cachedMonthAverageCarbonKey,
						averageCarbon,
						60 * 60 * 1000
					),
					cacheManager.set(
						cachedMonthAverageDieselKey,
						averageDiesel,
						60 * 60 * 1000
					),
				]);
			}

			return { totalCarbon, totalDiesel, averageCarbon, averageDiesel };
		} catch (error) {
			// Handle errors appropriately
			console.error('Failed to get savings data:', error);
			throw new Error('Unable to retrieve savings data.');
		}
	}

	private calculateTotalSaved(deviceId: number): TotalSavingsData {
		let deviceSavings = dataService.getDeviceSavings() || [];

		// filter by deviceId
		deviceSavings = deviceSavings.filter((ds) => ds.device_id === deviceId);

		// get the min and max timestamp
		// deviceSavings.reduce((dateMinMax, ds) => {
		// 	return {
		// 		"min": Math.min(dateMinMax["min"], ds.timestamp)
		// 	}
		// }, {})
		const minDeviceDate = new Date(
			Math.min(...deviceSavings.map((ds) => ds.timestamp.getTime()))
		);
		const maxDeviceDate = new Date(
			Math.max(...deviceSavings.map((ds) => ds.timestamp.getTime()))
		);

		const averageCarbon = 1;
		const averageDiesel = 2;

		console.log(minDeviceDate, maxDeviceDate);

		if (!deviceSavings.length) {
			// Handle the case where no savings data is found for the device
			throw new Error(`No savings data found for device ID ${deviceId}`);
		}

		const totalCarbon = deviceSavings.reduce(
			(acc, ds) => acc + ds.carbon_saved,
			0
		);
		const totalDiesel = deviceSavings.reduce(
			(acc, ds) => acc + ds.fueld_saved,
			0
		);

		return { totalCarbon, totalDiesel, averageCarbon, averageDiesel };
	}
}

export const savingsService = new SavingsService();
