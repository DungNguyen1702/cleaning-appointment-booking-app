import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { getUserRequestsForWeek } from '../controllers/user.controller';

const router = Router();
const requestController = new RequestController();

router.get(
  '/requests/:requestId',
  verifyToken,
  requestController.getRequestDetails
);

router.get(
  '/requests/:userId/userrequestsforweek',
  verifyToken,
  getUserRequestsForWeek
);

export default router;
