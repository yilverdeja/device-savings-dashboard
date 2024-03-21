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
		const cachedTotalCarbonKey = `totalCarbon-${deviceId}`;
		const cachedTotalDieselKey = `totalDiesel-${deviceId}`;

		let carbon: number | null = await cacheManager.get<number | null>(
			cachedTotalCarbonKey
		);
		let diesel: number | null = await cacheManager.get<number | null>(
			cachedTotalDieselKey
		);

		if (!(carbon && diesel)) {
			const total: TotalSavingsData = this.calculateTotalSaved(deviceId);
			carbon = total.carbon;
			diesel = total.diesel;

			await Promise.all([
				cacheManager.set(cachedTotalCarbonKey, carbon, 60 * 60 * 1000),
				cacheManager.set(cachedTotalDieselKey, diesel, 60 * 60 * 1000),
			]);
		}

		return { carbon, diesel };
	}

	private calculateTotalSaved(deviceId: number) {
		const deviceSaving = dataService
			.getDeviceSavings()
			.filter((ds) => ds.device_id === deviceId);
		const carbon = deviceSaving.reduce(
			(acc, ds) => acc + ds.carbon_saved,
			0
		);
		const diesel = deviceSaving.reduce(
			(acc, ds) => acc + ds.fueld_saved,
			0
		);
		return { carbon, diesel };
	}
}

export const savingsService = new SavingsService();
