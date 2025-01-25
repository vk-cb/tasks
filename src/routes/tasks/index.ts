import express  from "express";
import { taskStatusController } from "../../controllers/common/taskStatusController";

const taskRouter = express.Router();

taskRouter.get('/task-status',  taskStatusController);  

export default taskRouter