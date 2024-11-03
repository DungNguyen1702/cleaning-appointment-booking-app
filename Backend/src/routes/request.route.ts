import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import {
  validateRequest,
  validateUpdateRequest,
} from '../middleware/request.middleware';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();
const requestController = new RequestController();

router.post(
  '/',
  verifyToken,
  validateRequest,
  requestController.create.bind(requestController)
);
router.get('/', verifyToken, requestController.getAll.bind(requestController));
router.get(
  '/:id',
  verifyToken,
  requestController.getById.bind(requestController)
);
router.put(
  '/:id',
  verifyToken,
  validateUpdateRequest,
  requestController.update.bind(requestController)
);
router.delete(
  '/:id',
  verifyToken,
  requestController.delete.bind(requestController)
);

router.get(
  '/:id/userrentalhistory',
  verifyToken,
  requestController.getRequestsCompanyHistory.bind(requestController)
);

router.get(
  '/:id/customerrequestsforweek',
  verifyToken,
  requestController.getCustomerRequestsForWeek.bind(requestController)
);

router.get('/requests/:id/details', requestController.getRequestDetails.bind(requestController));

export default router;
