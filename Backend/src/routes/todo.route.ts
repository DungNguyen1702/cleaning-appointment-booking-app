import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// router.get(
//   '/:id',
//   verifyToken,
//   todoController.getCustomerRequestsForWeekController
// );

router.get(
  '/:userId',
  verifyToken,
  todoController.getUserTodosForWeek
);

router.post('/', verifyToken, todoController.createTodoController);
router.put(
  '/:id',
  verifyToken,
  todoController.updateTodoController
);


export default router;
