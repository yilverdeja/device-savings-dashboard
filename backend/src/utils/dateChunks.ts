import { DeviceSavingsResolution } from '../types';

interface DateChunk {
	from: Date;
	to: Date;
}

const getDateChunks = (
	from: Date,
	to: Date,
	resolution: DeviceSavingsResolution
): DateChunk[] => {
	let dateChunks: DateChunk[] = [];
	switch (resolution) {
		case 'month':
			let currentMonthStart = new Date(
				Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1)
			);

			// Keep iterating until the current month start is beyond the end date
			while (currentMonthStart < to) {
				// Get the last day of the current month
				let currentMonthEnd = new Date(
					Date.UTC(
						currentMonthStart.getUTCFullYear(),
						currentMonthStart.getUTCMonth() + 1,
						0,
						23,
						59,
						59,
						999
					)
				);

				// If the current month end is beyond the overall end, use overall end date instead
				if (currentMonthEnd >= to) {
					currentMonthEnd = to;
				}

				// Push the chunk, using the actual start date for the first chunk
				dateChunks.push({
					from: currentMonthStart > from ? currentMonthStart : from,
					to: currentMonthEnd,
				});

				// Set the start of the next month
				currentMonthStart = new Date(
					Date.UTC(
						currentMonthEnd.getUTCFullYear(),
						currentMonthEnd.getUTCMonth() + 1,
						1
					)
				);
			}
			break;
		case 'week':
			// Start at the beginning of the week in which 'start' is located
			let currentStart = from;
			let dayShift = 7 - currentStart.getUTCDay();
			let changeFlag = dayShift === 6;

			// Iterate from the 'currentStart' to 'end', one week at a time
			while (currentStart < to) {
				const currentEnd = new Date(
					Date.UTC(
						currentStart.getUTCFullYear(),
						currentStart.getUTCMonth(),
						currentStart.getUTCDate() + dayShift + 1 // Set to Sunday
					) - 1
				);

				if (!changeFlag) {
					dayShift = 6;
					changeFlag = !changeFlag;
				}

				dateChunks.push({
					from: currentStart,
					to: currentEnd > to ? to : currentEnd,
				});

				currentStart = new Date(
					Date.UTC(
						currentEnd.getUTCFullYear(),
						currentEnd.getUTCMonth(),
						currentEnd.getUTCDate() + 1 // Start next chunk on the following day
					)
				);
			}
			break;
		case 'day':
			let currentDayStart = from;

			// Iterate from 'start' to 'end', one day at a time
			while (currentDayStart < to) {
				const currentDayEnd = new Date(
					Date.UTC(
						currentDayStart.getUTCFullYear(),
						currentDayStart.getUTCMonth(),
						currentDayStart.getUTCDate() + 1 // Next day
					)
				);

				const endOfDay = new Date(currentDayEnd.getTime() - 1);

				dateChunks.push({
					from: currentDayStart,
					to: endOfDay > to ? to : endOfDay,
				});

				currentDayStart = currentDayEnd;
			}
			break;
		default:
			break;
	}

	return dateChunks;
};

export default getDateChunks;
