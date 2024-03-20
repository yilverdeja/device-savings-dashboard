import { Request, Response, NextFunction } from 'express';

let isDataLoaded = false;

export function setDataLoaded(loaded: boolean) {
	isDataLoaded = loaded;
}

// middleware to check if the data has been loaded into the server
const checkDataLoaded = (req: Request, res: Response, next: NextFunction) => {
	if (!isDataLoaded) {
		return res
			.status(503)
			.send('Service Unavailable - Data is still loading');
	}
	next();
};

export default checkDataLoaded;
