import { Router } from 'express';
import { DataService } from '../services/dataService';
import deviceSavingsRetrievalController from '../controllers/savingsController';
import validateGetDeviceSavings from '../validators/savingsValidator';

const router = Router();
const dataService = DataService.getInstance();

router.get(
	'/savings/:deviceId',
	validateGetDeviceSavings,
	deviceSavingsRetrievalController(dataService)
);

export default router;
