import fs from 'fs';
import { parse } from 'csv-parse';

// Generic function to parse CSV without extending a base type
export function parseCSV<T>(filePath: string): Promise<T[]> {
	return new Promise((resolve, reject) => {
		const results: T[] = [];

		fs.createReadStream(filePath)
			.pipe(
				parse({
					columns: true,
					cast: true,
					cast_date: true,
					skip_empty_lines: true,
				})
			)
			.on('data', (data: T) => results.push(data))
			.on('end', () => {
				resolve(results);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}
