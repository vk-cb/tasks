import express from 'express';
import { userAuthMiddleware } from '../../middlewares/userMiddleware';
import { activateDeactivateUserController, deleteUserTaskController, updateAdminTaskController, usersListController, userWiseTaskListController } from '../../controllers/admin/adminController';

const router = express.Router();

router.post('/get-users', userAuthMiddleware, usersListController);
router.post('/user-status/:id', userAuthMiddleware, activateDeactivateUserController);
router.get('/user-task/:id', userAuthMiddleware, userWiseTaskListController);
router.post('/delete-task/:id', userAuthMiddleware, deleteUserTaskController);
router.put('/update-task/:id', userAuthMiddleware, updateAdminTaskController);

export default router;