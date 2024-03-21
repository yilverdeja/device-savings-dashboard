import { Router } from 'express';
import { Device } from '../types';
import { DataService } from './../services/dataService';
// import { savingsService } from '../services/savingsService';
import devicesRetrievalController from '../controllers/devices';

// types
type TotalSavingsData = {
	carbon: number;
	diesel: number;
};

// type DeviceWithTotalSavings = Device & TotalSavingsData;

const router = Router();
const dataService = DataService.getInstance();

router.get('/devices', devicesRetrievalController(dataService));

export default router;
