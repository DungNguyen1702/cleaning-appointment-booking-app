import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
const requestController = new RequestController();

router.get(
  '/requests/:requestId',
  verifyToken,
  requestController.getRequestDetails
);

export default router;
