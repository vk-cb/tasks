import express from 'express';
import userRoutes from '../routes/userRoutes/index';
import roleRouter from '../routes/roles/index';
import taskRouter from './tasks';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/roles', roleRouter);
router.use('/task', taskRouter)
export default router;