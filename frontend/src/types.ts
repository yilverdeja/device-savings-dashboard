// Component Objects
export interface DataItemType {
	title?: string;
	information?: string;
	value: number | null;
	units: string;
}

// Request Interfaces
export interface DevicesRequest {
	includeSavings?: boolean;
}

export type DeviceSavingsResolution = 'month' | 'week' | 'day';

export interface DeviceSavingsRequest {
	from?: Date;
	to?: Date;
	resolution?: DeviceSavingsResolution;
}

// Response Interfaces
export type SavingsChunk = {
	from: Date;
	to: Date;
	totalCarbon: number;
	totalDiesel: number;
};

export interface DeviceSavingsResponse {
	device_id: number;
	totalCarbon: number;
	totalDiesel: number;
	// averageCarbon: number;
	// averageDiesel: number;
	savingsChunks: SavingsChunk[];
}

export interface Device {
	id: number;
	name: string;
	timezone: string;
}

export type DeviceSavingsInfo = {
	totalCarbon: number;
	totalDiesel: number;
	averageCarbon: number;
	averageDiesel: number;
};

export type DeviceResponse = Device & Partial<DeviceSavingsInfo>;

export interface DevicesResponse {
	devices: DeviceResponse[];
}
