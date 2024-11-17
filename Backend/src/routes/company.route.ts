import { Router } from 'express';
import * as companyController from '../controllers/company.controller';
import { verifyToken } from '../middleware/auth.middleware';
import upload from '../config/multer-config';

const router = Router();

router.get('/:id', verifyToken, companyController.getCompanyDetails);

//get all company va phan trang GET /companie?page=1&limit=10
router.get('/', verifyToken, companyController.getAllCompanies);

router.get(
  '/:companyId/requests',
  verifyToken,
  companyController.getRequestsByCompanyId
);

router.put(
  '/requests/:requestId',
  verifyToken,
  companyController.editRequestByCompany
);

router.put(
  '/requests/:requestId/status',
  verifyToken,
  companyController.editRequestStatusByCompany
);

router.get(
  '/request/:requestId/details',
  verifyToken,
  companyController.getRequestIdDetails
);

router.get(
  '/requests/:companyId/customerrequestsforweek',
  verifyToken,
  companyController.getCustomerRequestsForWeek
);

router.get(
  '/profile/:companyId',
  verifyToken,
  companyController.getCompanyProfile
);

router.put(
  '/profile/:companyId',
  verifyToken,
  upload.array('imageFiles', 5),
  companyController.editCompanyProfile
);

router.get(
  '/statistical/:companyId',
  verifyToken,
  companyController.getCompanyThongKe
);

export default router;
