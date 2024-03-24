import { describe, it, expect } from 'vitest';
import cache from './cacheManager';

describe('Cache Module', () => {
	it('should retrieve null for a non-existent key', async () => {
		const result = await cache.get('non-existent-key');
		expect(result).toBeNull();
	});

	it('should set and get a value correctly', async () => {
		const key = 'test-key';
		const value = { foo: 'bar' };
		await cache.set(key, value, 60 * 60 * 1000); // Set TTL to 1 hour

		const cachedValue = await cache.get(key);
		expect(cachedValue).toEqual(value);
	});

	it('should delete a key', async () => {
		const key = 'test-key-to-delete';
		await cache.set(key, 'value', 60 * 60 * 1000); // Set TTL to 1 hour

		await cache.del(key);
		const result = await cache.get(key);
		expect(result).toBeNull();
	});
});
