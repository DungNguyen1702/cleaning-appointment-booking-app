import { Router } from 'express';
import * as companyController from '../controllers/company.controller';
import { verifyToken } from '../middleware/auth.middleware';

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

export default router;
