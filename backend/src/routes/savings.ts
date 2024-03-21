import { Router } from 'express';
import { DataService } from '../services/dataService';
import deviceSavingsRetrievalController from '../controllers/savings';

const router = Router();
const dataService = DataService.getInstance();

router.get('/savings/:deviceId', deviceSavingsRetrievalController(dataService));

export default router;
