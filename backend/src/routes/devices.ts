import { Router } from 'express';
import { DataService } from './../services/dataService';
import devicesRetrievalController from '../controllers/devices';
import validateGetDevices from '../validators/devices';

const router = Router();
const dataService = DataService.getInstance();

router.get(
	'/devices',
	validateGetDevices,
	devicesRetrievalController(dataService)
);

export default router;
