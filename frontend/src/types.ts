// Component Objects
export interface DataItemType {
	title?: string;
	information?: string;
	value: number;
	units: string;
}

// Request Interfaces

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
