import express from 'express';

import { userLoginController, userSignUpController } from '../../controllers/user/auth';
import { createTaskController, deleteTaskController, getAllUserTasksController, getTaskByIdController, statusChangeController, updateTaskByIdController } from '../../controllers/user/task';
import { userAuthMiddleware } from '../../middlewares/userMiddleware';

const router = express.Router();

router.post('/signup',userSignUpController);
router.post('/login',userLoginController);

//task create
router.post('/create-task', userAuthMiddleware, createTaskController);
router.get('/get-tasks', userAuthMiddleware, getAllUserTasksController);
router.get('/get-tasks/:id', userAuthMiddleware, getTaskByIdController);
router.put('/update-tasks/:id', userAuthMiddleware, updateTaskByIdController);
router.put('/status-change/:id', userAuthMiddleware, statusChangeController);
router.post('/delete-task/:id', userAuthMiddleware, deleteTaskController);


export default router;