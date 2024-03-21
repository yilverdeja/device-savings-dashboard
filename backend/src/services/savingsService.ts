import cacheManager from './cacheManager';
import { DataService } from './dataService';

// types
type TotalSavingsData = {
	carbon: number;
	diesel: number;
};

const dataService = DataService.getInstance();

class SavingsService {
	async getSavingsData(deviceId: number): Promise<TotalSavingsData> {
		try {
			const cachedTotalCarbonKey = `totalCarbon-${deviceId}`;
			const cachedTotalDieselKey = `totalDiesel-${deviceId}`;

			let carbon: number | null = await cacheManager.get<number | null>(
				cachedTotalCarbonKey
			);
			let diesel: number | null = await cacheManager.get<number | null>(
				cachedTotalDieselKey
			);

			if (!(carbon && diesel)) {
				const total: TotalSavingsData =
					this.calculateTotalSaved(deviceId);
				carbon = total.carbon;
				diesel = total.diesel;

				await Promise.all([
					cacheManager.set(
						cachedTotalCarbonKey,
						carbon,
						60 * 60 * 1000
					),
					cacheManager.set(
						cachedTotalDieselKey,
						diesel,
						60 * 60 * 1000
					),
				]);
			}

			return { carbon, diesel };
		} catch (error) {
			// Handle errors appropriately
			console.error('Failed to get savings data:', error);
			throw new Error('Unable to retrieve savings data.');
		}
	}

	private calculateTotalSaved(deviceId: number) {
		const deviceSavings = dataService.getDeviceSavings() || [];

		deviceSavings.filter((ds) => ds.device_id === deviceId);

		if (!deviceSavings.length) {
			// Handle the case where no savings data is found for the device
			throw new Error(`No savings data found for device ID ${deviceId}`);
		}

		const carbon = deviceSavings.reduce(
			(acc, ds) => acc + ds.carbon_saved,
			0
		);
		const diesel = deviceSavings.reduce(
			(acc, ds) => acc + ds.fueld_saved,
			0
		);

		return { carbon, diesel };
	}
}

export const savingsService = new SavingsService();
