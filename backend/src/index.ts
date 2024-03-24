import express from 'express';
import cors from 'cors';
import checkDataLoaded from './middlewares/checkDataLoaded';
import { DataService } from './services/dataService';
import deviceRouter from './routes/devicesRoute';
import savingsRouter from './routes/savingsRoute';
import { errorHandler } from './middlewares/errors';

// create an express app
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
app.use(checkDataLoaded);

const startServer = async () => {
	try {
		await DataService.getInstance();
		app.use('/', deviceRouter);
		app.use('/', savingsRouter);
		app.use(errorHandler);
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`);
		});
	} catch (error) {
		console.error('Failed to start the server: ', error);
	}
};

startServer();
