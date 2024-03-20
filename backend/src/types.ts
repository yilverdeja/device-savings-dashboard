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
