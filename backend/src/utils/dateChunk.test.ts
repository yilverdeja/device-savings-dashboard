import { describe, it, expect, vi } from 'vitest';
import getDateChunks from './dateChunks';

interface DateChunksProps {
	from: Date;
	to: Date;
	resolution: 'month' | 'week' | 'day';
}

describe('dateChunk', () => {
	it('should return a single chunk with a month resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2023-02-06T01:01:01.001Z'),
			to: new Date('2023-02-22T23:23:23.999Z'),
			resolution: 'month',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		// date chunks should return an array
		expect(dateChunks).toBeInstanceOf(Array);

		// given the same month and different days should return only 1 month chunk
		expect(dateChunks).toHaveLength(1);

		expect(dateChunks[0]).toEqual({ from: params.from, to: params.to });
	});

	it('should return a single chunk with a week resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2024-03-05T01:01:01.001Z'),
			to: new Date('2024-03-09T23:23:23.999Z'),
			resolution: 'week',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		// date chunks should return an array
		expect(dateChunks).toBeInstanceOf(Array);

		// given the same month and different days should return only 1 month chunk
		expect(dateChunks).toHaveLength(1);

		expect(dateChunks[0]).toEqual({ from: params.from, to: params.to });
	});

	it('should return a single chunk with a day resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2023-03-01T01:01:01.001Z'),
			to: new Date('2023-03-01T23:23:23.999Z'),
			resolution: 'day',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		// date chunks should return an array
		expect(dateChunks).toBeInstanceOf(Array);

		// given the same month and different days should return only 1 month chunk
		expect(dateChunks).toHaveLength(1);

		expect(dateChunks[0]).toEqual({ from: params.from, to: params.to });
	});

	it('should return the appropriate chunks with a month resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2023-01-06T01:01:01.001Z'),
			to: new Date('2023-03-22T23:23:23.999Z'),
			resolution: 'month',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		// date chunks should return an array
		expect(dateChunks).toBeInstanceOf(Array);

		// jan to march in 2023 is 3 months
		expect(dateChunks).toHaveLength(3);

		// first month start should be start, last month end should be end
		expect(dateChunks[0].from).toEqual(params.from);
		expect(dateChunks[2].to).toEqual(params.to);

		// second month should start and end at the start and end of the month
		expect(dateChunks[1]).toEqual({
			from: new Date('2023-02-01T00:00:00.000Z'),
			to: new Date('2023-02-28T23:59:59.999Z'),
		});

		// first month should end at the end of the month
		expect(dateChunks[0].to).toEqual(new Date('2023-01-31T23:59:59.999Z'));

		// last month should start at the start of the month
		expect(dateChunks[2].from).toEqual(
			new Date('2023-03-01T00:00:00.000Z')
		);
	});

	it('should return the appropriate chunks given dates in different years with a month resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2022-11-01T01:01:01.001Z'),
			to: new Date('2023-02-28T23:23:23.999Z'),
			resolution: 'month',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		expect(dateChunks).toBeInstanceOf(Array);
		expect(dateChunks).toHaveLength(4); // Nov, Dec, Jan, Feb

		// November start and end
		expect(dateChunks[0].from).toEqual(params.from);
		expect(dateChunks[0].to).toEqual(new Date('2022-11-30T23:59:59.999Z'));

		// February start and end
		expect(dateChunks[3].from).toEqual(
			new Date('2023-02-01T00:00:00.000Z')
		);
		expect(dateChunks[3].to).toEqual(params.to);
	});

	it('should return the appropriate chunks with a week resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2023-02-01T01:01:01.001Z'),
			to: new Date('2023-04-29T23:23:23.999Z'),
			resolution: 'week',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		expect(dateChunks).toBeInstanceOf(Array);

		expect(dateChunks).toHaveLength(13);

		// start is wednesday
		expect(dateChunks[0].from.getUTCDay()).toBe(3);

		// end is thursday
		expect(dateChunks[12].to.getUTCDay()).toBe(6);

		// full week chunks should start from monday and end on sunday
		expect(dateChunks[1].from.getUTCDay()).toBe(1);
		expect(dateChunks[1].to.getUTCDay()).toBe(0);
	});

	it('should return the appropriate chunks given dates in different years with a week resolution', () => {
		const params: DateChunksProps = {
			from: new Date('2021-12-01T01:01:01.001Z'),
			to: new Date('2022-01-10T23:23:23.999Z'),
			resolution: 'week',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		expect(dateChunks).toBeInstanceOf(Array);
		expect(dateChunks).toHaveLength(7);

		expect(dateChunks[4]).toEqual({
			from: new Date('2021-12-27T00:00:00.000Z'),
			to: new Date('2022-01-02T23:59:59.999Z'),
		});
	});

	it('should return the appropriate chunks with a resolution of day', () => {
		const params: DateChunksProps = {
			from: new Date('2023-02-08T01:01:01.001Z'),
			to: new Date('2023-02-13T23:23:23.999Z'),
			resolution: 'day',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		expect(dateChunks).toBeInstanceOf(Array);
		expect(dateChunks).toHaveLength(6);

		// start
		expect(dateChunks[0].from).toEqual(params.from);
		expect(dateChunks[0].to).toEqual(new Date('2023-02-08T23:59:59.999Z'));

		// end
		expect(dateChunks[5].from).toEqual(
			new Date('2023-02-13T00:00:00.000Z')
		);
		expect(dateChunks[5].to).toEqual(params.to);

		// mid chunk as full day
		expect(dateChunks[1]).toEqual({
			from: new Date('2023-02-09T00:00:00.000Z'),
			to: new Date('2023-02-09T23:59:59.999Z'),
		});
	});

	it('should return the appropriate chunks given dates in different months with a resolution of day', () => {
		const params: DateChunksProps = {
			from: new Date('2023-02-27T01:01:01.001Z'),
			to: new Date('2023-03-02T23:23:23.999Z'),
			resolution: 'day',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		expect(dateChunks).toBeInstanceOf(Array);
		expect(dateChunks).toHaveLength(4);

		// days are on different months
		expect(dateChunks[1]).toEqual({
			from: new Date('2023-02-28T00:00:00.000Z'),
			to: new Date('2023-02-28T23:59:59.999Z'),
		});

		expect(dateChunks[2]).toEqual({
			from: new Date('2023-03-01T00:00:00.000Z'),
			to: new Date('2023-03-01T23:59:59.999Z'),
		});
	});

	it('should return the appropriate chunks given dates in different years with a resolution of day', () => {
		const params: DateChunksProps = {
			from: new Date('2022-12-30T01:01:01.001Z'),
			to: new Date('2023-01-02T23:23:23.999Z'),
			resolution: 'day',
		};

		const dateChunks = getDateChunks(
			params.from,
			params.to,
			params.resolution
		);

		expect(dateChunks).toBeInstanceOf(Array);
		expect(dateChunks).toHaveLength(4);

		// days are on different years
		expect(dateChunks[1]).toEqual({
			from: new Date('2022-12-31T00:00:00.000Z'),
			to: new Date('2022-12-31T23:59:59.999Z'),
		});

		expect(dateChunks[2]).toEqual({
			from: new Date('2023-01-01T00:00:00.000Z'),
			to: new Date('2023-01-01T23:59:59.999Z'),
		});
	});
});
