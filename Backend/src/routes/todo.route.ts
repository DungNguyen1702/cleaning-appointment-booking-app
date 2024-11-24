import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.get(
  '/all/:userId',
  verifyToken,
  todoController.getCustomerRequestsAllController
);

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

router.delete(
  '/:todoId',
  verifyToken,
  todoController.deleteTodoByIdController
);


export default router;
