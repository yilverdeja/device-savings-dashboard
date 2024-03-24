import { DeviceSaving } from '../types';
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
			const cachedMonthAverageCarbonKey = `averageCarbon-${deviceId}`;
			const cachedMonthAverageDieselKey = `averageDiesel-${deviceId}`;

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

	private calculateTotalCarbonDieselSaved(deviceSavings: DeviceSaving[]) {
		const totalCarbon = deviceSavings.reduce(
			(acc, ds) => acc + ds.carbon_saved,
			0
		);
		const totalDiesel = deviceSavings.reduce(
			(acc, ds) => acc + ds.fueld_saved,
			0
		);

		return { totalCarbon, totalDiesel };
	}

	private calculateTotalSaved(deviceId: number): TotalSavingsData {
		let deviceSavings = dataService.getDeviceSavings() || [];

		// filter by deviceId
		deviceSavings = deviceSavings.filter((ds) => ds.device_id === deviceId);

		if (!deviceSavings.length) {
			// Handle the case where no savings data is found for the device
			throw new Error(`No savings data found for device ID ${deviceId}`);
		}

		// calculates the total carbon and diesel saved from the deviceSavings data provided
		const { totalCarbon, totalDiesel } =
			this.calculateTotalCarbonDieselSaved(deviceSavings);

		// calculate the total monthly average based on the min and max dates
		const multiplier =
			this.calculateMonthlyAverageMultiplier(deviceSavings);
		const averageCarbon = totalCarbon * multiplier;
		const averageDiesel = totalDiesel * multiplier;

		return { totalCarbon, totalDiesel, averageCarbon, averageDiesel };
	}

	public calculateTotalSavedInRange(
		deviceId: number,
		start: Date,
		end: Date
	) {
		let deviceSavings = dataService.getDeviceSavings() || [];

		// filter by deviceId
		deviceSavings = deviceSavings.filter((ds) => {
			return (
				ds.device_id === deviceId &&
				ds.timestamp >= start &&
				ds.timestamp <= end
			);
		});

		if (!deviceSavings.length) {
			// Handle the case where no savings data is found for the device
			throw new Error(`No savings data found for device ID ${deviceId}`);
		}

		// calculates the total carbon and diesel saved from the deviceSavings data provided
		const { totalCarbon, totalDiesel } =
			this.calculateTotalCarbonDieselSaved(deviceSavings);

		return { totalCarbon, totalDiesel };
	}

	public calculateMinMaxDate(deviceSavings?: DeviceSaving[]) {
		if (!deviceSavings)
			deviceSavings = dataService.getDeviceSavings() || [];
		const minDate = new Date(
			Math.min(...deviceSavings.map((ds) => ds.timestamp.getTime()))
		);

		const maxDate = new Date(
			Math.max(...deviceSavings.map((ds) => ds.timestamp.getTime()))
		);

		return { minDate, maxDate };
	}

	private calculateMonthlyAverageMultiplier(
		deviceSavings: DeviceSaving[]
	): number {
		// get the minimum and maximum dates in the deviceSavings
		const { minDate, maxDate } = this.calculateMinMaxDate(deviceSavings);

		// calculate the number of days between the min and max dates
		const daysBetweenMinMaxDates = Math.ceil(
			(maxDate.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000) // milliseconds in one day
		);

		// assumption that a month averages at 30 days
		const daysInAMonth = 30;

		// average monthly multiplier
		if (daysBetweenMinMaxDates <= 0) return 0;
		return daysInAMonth / daysBetweenMinMaxDates;
	}
}

export const savingsService = new SavingsService();
