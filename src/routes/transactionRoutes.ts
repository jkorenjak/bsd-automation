import { Router } from 'express';
import {createWithdrawal} from "../controllers/withdrawalController";
import {createDeposit} from "../controllers/depositController";
import {getBalance} from "../controllers/balanceController";

const router = Router();

router.post('/create/withdrawal', createWithdrawal);
router.post('/create/deposit', createDeposit);
router.get('/balance', getBalance);

export default router;
