import { caching } from 'cache-manager';

const memoryCache = caching('memory', {
	max: 100,
	ttl: 60 * 60 * 1000, // time to live in milliseconds, 1 hour
});

export default {
	async get<T>(key: string): Promise<T | null> {
		const value = (await memoryCache).get(key);
		return value === undefined ? null : (value as T);
	},
	async set(key: string, value: any, ttl: number): Promise<void> {
		return (await memoryCache).set(key, value, ttl);
	},
	async del(keys: string): Promise<void> {
		return (await memoryCache).del(keys);
	},
};
