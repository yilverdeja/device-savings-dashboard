import { describe, it, expect, vi } from 'vitest';
import devicesRetrievalController from './devices';
import { DataService } from '../services/dataService';
import { Device, DeviceSaving } from '../types';
import { savingsService } from '../services/savingsService';
import { beforeEach } from 'node:test';
import { DeviceResponse } from '../types';
import { NextFunction, Request, Response } from 'express';

const mockSavings = [
	{
		device_id: 1,
		timestamp: new Date(),
		device_timestamp: new Date(),
		carbon_saved: 0,
		fuel_saved: 0,
	},
];

describe('deviceSavingsRetrievalController', () => {
	it('should', () => {});
});
