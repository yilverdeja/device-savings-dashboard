export class CustomError extends Error {
	statusCode: number;
	error: string;
	details: any = undefined;

	constructor(
		statusCode: number,
		message: string,
		name: string,
		details?: any
	) {
		super(message);
		this.statusCode = statusCode;
		this.error = name;
		if (details) this.details = details;
	}
}
