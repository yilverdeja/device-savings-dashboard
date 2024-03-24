import { Router } from 'express';
import { DataService } from '../services/dataService';
import devicesRetrievalController from '../controllers/devicesController';
import validateGetDevices from '../validators/devicesValidator';

const router = Router();
const dataService = DataService.getInstance();

router.get(
	'/devices',
	validateGetDevices,
	devicesRetrievalController(dataService)
);

export default router;
