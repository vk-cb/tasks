import express, { Request, Response } from 'express';

import { userLoginController, userSignUpController } from '../../controllers/user/auth';
import { createTaskController, getAllUserTasksController } from '../../controllers/user/task';
import { userAuthMiddleware } from '../../middlewares/userMiddleware';

const router = express.Router();

router.post('/signup',userSignUpController);
router.post('/login',userLoginController);

//task create
router.post('/create-task', userAuthMiddleware, createTaskController);
router.get('/get-tasks', userAuthMiddleware, getAllUserTasksController);


export default router;