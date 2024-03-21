// Data types
export interface Device {
	id: number;
	name: string;
	timezone: string;
}

export interface DeviceSaving {
	device_id: number;
	timestamp: Date;
	device_timestamp: Date;
	carbon_saved: number;
	fueld_saved: number;
}

// Request types
export interface DevicesRequest {
	includeSavings?: boolean;
}

export type DeviceSavingsResolution = 'month' | 'week' | 'day';

export interface DeviceSavingsRequest {
	from?: Date;
	to?: Date;
	resolution?: DeviceSavingsResolution;
}

// Response types
type DeviceSavingsInfo = {
	totalCarbon: number;
	totalDiesel: number;
	averageCarbon: number;
	averageDiesel: number;
};

type DeviceResponse = Device & Partial<DeviceSavingsInfo>;
export interface DevicesResponse {
	devices: DeviceResponse[];
}

type SavingsChunk = {
	from: Date;
	to: Date;
	totalCarbon: number;
	totalDiesel: number;
};

export interface DeviceSavingsResponse {
	device_id: number;
	totalCarbon: number;
	totalDiesel: number;
	savingsChunks: SavingsChunk[];
}

// Error Response
export interface ErrorResponse {
	statusCode: number;
	error: string;
	message: string;
	details?: any;
}
