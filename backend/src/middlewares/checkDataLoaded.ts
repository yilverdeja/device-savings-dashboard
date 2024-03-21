import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';

let isDataLoaded = false;

export function setDataLoaded(loaded: boolean) {
	isDataLoaded = loaded;
}

// middleware to check if the data has been loaded into the server
const checkDataLoaded = (req: Request, res: Response, next: NextFunction) => {
	if (!isDataLoaded) {
		return next(
			new CustomError(
				503,
				'Data has not yet finished loading into the server',
				'Service Unavailable'
			)
		);
	}
	next();
};

export default checkDataLoaded;
