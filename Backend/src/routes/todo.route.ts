import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get(
  '/:id',
  verifyToken,
  todoController.getCustomerRequestsForWeekController
);

router.put(
  '/:id',
  verifyToken,
  todoController.updateTodoController
);


export default router;
