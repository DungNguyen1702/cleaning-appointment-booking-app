import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { verifyToken } from '../middleware/auth.middleware';
import {
  getUserRequestsForWeek,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller';
import upload from '../config/multer-config';

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

router.get('/profile/:userId', verifyToken, getUserProfile);
router.put(
  '/profile/:userId',
  verifyToken,
  upload.single('avatar'),
  updateUserProfile
);

export default router;
