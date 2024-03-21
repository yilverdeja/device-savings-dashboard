import { describe, it, expect, vi } from 'vitest';
import getDateChunks from './dateChunks';

interface DateChunksProps {
	start: Date;
	end: Date;
	resolution: 'month' | 'week' | 'day';
}

describe('dateChunk', () => {
	it('should return a single chunk between start and end with a month resolution', () => {
		const params: DateChunksProps = {
			start: new Date('2023-01-01T00:00:00.000Z'),
			end: new Date('2023-01-01T00:00:00.000Z'),
			resolution: 'month',
		};

		const dateChunks = getDateChunks(
			params.start,
			params.end,
			params.resolution
		);

		// expect(dateChunks).toBe(Array)
	});
});
