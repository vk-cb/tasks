import express from 'express';
import { userAuthMiddleware } from '../../middlewares/userMiddleware';
import { activateDeactivateUserController, usersListController, userWiseTaskListController } from '../../controllers/admin/adminController';

const router = express.Router();

router.get('/get-users', userAuthMiddleware, usersListController);
router.post('/user-status/:id', userAuthMiddleware, activateDeactivateUserController);
router.get('/user-task/:id', userAuthMiddleware, userWiseTaskListController);

export default router;