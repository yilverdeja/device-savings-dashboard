import { Router } from 'express';
import { DataService } from '../services/dataService';
import deviceSavingsRetrievalController from '../controllers/savings';
import validateGetDeviceSavings from '../validators/savings';

const router = Router();
const dataService = DataService.getInstance();

router.get(
	'/savings/:deviceId',
	validateGetDeviceSavings,
	deviceSavingsRetrievalController(dataService)
);

export default router;
