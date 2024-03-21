import { Router } from 'express';
import { DataService } from './../services/dataService';
import devicesRetrievalController from '../controllers/devices';

const router = Router();
const dataService = DataService.getInstance();

router.get('/devices', devicesRetrievalController(dataService));

export default router;
