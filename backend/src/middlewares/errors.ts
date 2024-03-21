import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types';
import { CustomError } from '../utils/customError';

export const errorHandler = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err.stack); // Log the error stack for debugging
	const errorResponse: ErrorResponse = {
		statusCode: err.statusCode || 500,
		error: err.error || 'Internal Server Error',
		message: err.message || 'An unexpected error occurred.',
		details: err.details || undefined,
	};

	res.status(errorResponse.statusCode).json(errorResponse);
};
