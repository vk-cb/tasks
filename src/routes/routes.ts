import express from 'express';
import userRoutes from '../routes/userRoutes/index';
import roleRouter from '../routes/roles/index';
import taskRouter from './tasks';
import adminRouter from './admin';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/roles', roleRouter);
router.use('/task', taskRouter)
router.use('/admin', adminRouter)
export default router;