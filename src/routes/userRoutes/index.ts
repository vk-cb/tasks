import express, { Request, Response } from 'express';

import { userLoginController, userSignUpController } from '../../controllers/user/auth';

const router = express.Router();

router.post('/signup',userSignUpController);

router.post('/login',userLoginController);

export default router;