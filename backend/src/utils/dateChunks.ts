interface DateChunk {
	start: Date;
	end: Date;
}

const getDateChunks = (
	start: Date,
	end: Date,
	resolution: 'month' | 'week' | 'day'
): DateChunk[] => {
	let dateChunks: DateChunk[] = [];
	switch (resolution) {
		case 'month':
			let currentMonthStart = new Date(
				Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)
			);

			// Keep iterating until the current month start is beyond the end date
			while (currentMonthStart < end) {
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
				if (currentMonthEnd >= end) {
					currentMonthEnd = end;
				}

				// Push the chunk, using the actual start date for the first chunk
				dateChunks.push({
					start:
						currentMonthStart > start ? currentMonthStart : start,
					end: currentMonthEnd,
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
			let currentStart = start;
			let dayShift = 7 - currentStart.getUTCDay();
			let changeFlag = dayShift === 6;

			// Iterate from the 'currentStart' to 'end', one week at a time
			while (currentStart < end) {
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
					start: currentStart,
					end: currentEnd > end ? end : currentEnd,
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
			let currentDayStart = start;

			// Iterate from 'start' to 'end', one day at a time
			while (currentDayStart < end) {
				const currentDayEnd = new Date(
					Date.UTC(
						currentDayStart.getUTCFullYear(),
						currentDayStart.getUTCMonth(),
						currentDayStart.getUTCDate() + 1 // Next day
					)
				);

				const endOfDay = new Date(currentDayEnd.getTime() - 1);

				dateChunks.push({
					start: currentDayStart,
					end: endOfDay > end ? end : endOfDay,
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
