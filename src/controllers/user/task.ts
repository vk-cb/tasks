import { Request, Response, NextFunction } from "express";
import { taskValidation } from "../../validation/tasks/taskValidation";
import { statusCodes } from "../../utility/statusCodes";
import tasks from "../../models/tasks";

export const createTaskController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const taskData = req.body;
        const { error } = taskValidation.validate(taskData);
        if (error) {
            res.status(statusCodes.badRequest).json({ msg: error.details[0].message });
            return;
        }
        // Ensure user information is available from the middleware
        const user = req.user;
        if (!user) {
            res.status(statusCodes.unauthorized).json({ msg: "User not authenticated" });
            return;
        }
       
       const payload = { ...taskData, user: user._id.toString() };
       
        const newTask = new tasks({
            ...payload 
        });

        
        await newTask.save();

        
        res.status(statusCodes.success).json({
            msg: "Task created successfully",
            data: newTask,
        });
        return
    } catch (error) {
        console.error("Error creating task:", error);
        next(error); 
        return;
    }
};


export const getAllUserTasksController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {

    try {
        // Ensure user information is available from the middleware
        const user = req.user;
        if (!user) {
            res.status(statusCodes.unauthorized).json({ msg: "User not authenticated" });
            return;
        }
        const getTasks = await tasks.find({ user: user._id, isActive : true });
        res.status(statusCodes.success).json({
            msg: "Tasks fetched successfully",
            data: getTasks,
        });
        return
    } catch (error) {
        console.error("Error fetching tasks:", error);
        next(error); 
        return;
    }
}

export const getTaskByIdController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const taskId  = req.params.id;
        const getTask = await tasks.findOne({_id :taskId, user: req.user._id, isActive : true });   
        res.status(statusCodes.success).json({
            status : statusCodes.success,
            msg: "Task fetched successfully",   
            data: [getTask],
        });
        return
    }
catch (error) {
        console.error("Error fetching task:", error);
        res.status(statusCodes.internalServerError).json({ msg: "Internal Server Error", status : statusCodes.internalServerError });
        return;
    }
}

export const updateTaskByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = req.params.id;
        const userId = req.user?._id.toString(); // Ensure req.user exists and _id is accessible
        
        if (!userId) {
            res.status(statusCodes.unauthorized).json({
                status: statusCodes.unauthorized,
                msg: "Unauthorized: User not found",
            });
            return;
        }

        const updatedTask = await tasks.findOneAndUpdate(
            { _id: taskId, user: userId, isActive: true }, // Ensure the `createdBy` field is used
            req.body,
            { new: true }
        );
        if (!updatedTask) {
            res.status(statusCodes.notFound).json({
                status: statusCodes.notFound,
                msg: "Task not found or you are not authorized to update it",
            });
            return;
        }

        res.status(statusCodes.success).json({
            status: statusCodes.success,
            msg: "Task updated successfully",
            data: updatedTask, 
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(statusCodes.internalServerError).json({
            status: statusCodes.internalServerError,
            msg: "Internal Server Error",
        });
    }
};

export const statusChangeController = async (req: Request, res : Response, next : NextFunction) : Promise<void> => {

    try{
        const taskId = req.params.id;
        const userId = req.user?._id.toString();
        const status = req.body.status;
        console.log(status)
        if(!userId){
            res.status(statusCodes.unauthorized).json({
                status : statusCodes.unauthorized,
                msg : "Unauthorized: User not found"
            });
            return; 
        }

        const updatedTask = await tasks.findOneAndUpdate(
            { _id : taskId, user : userId, isActive : true },
            req.body,
            { new : true })

        if(!updatedTask){
            res.status(statusCodes.notFound).json({
                status : statusCodes.notFound,
                msg : "Task not found or you are not authorized to update it"
            });
            return;
        }

        res.status(statusCodes.success).json({ 
            status : statusCodes.success,
            msg : "Task updated successfully",
            data : updatedTask
        });
        return;
    }catch(error){
        console.error("Error updating task:", error);
        res.status(statusCodes.internalServerError).json({
            status : statusCodes.internalServerError,
            msg : "Internal Server Error"
        });
        return
    }

}

export const deleteTaskController = async (req :Request, res : Response , next : NextFunction) : Promise<void> => {

    try{
        const userId = req.user?._id.toString();
        const taskId = req.params.id;
        if(!userId){
            res.status(statusCodes.unauthorized).json({
                status : statusCodes.unauthorized,
                msg : "Unauthorized: User not found"
            });
            return; 
        }

        const deletedTask = await tasks.findOneAndUpdate(
            { _id : taskId, user : userId, isActive : true },
            { isActive : false },
            { new : true })

        if(!deletedTask){
            res.status(statusCodes.notFound).json({
                status : statusCodes.notFound,
                msg : "Task not found or you are not authorized to update it"
            });
            return;
        }
        else {
            res.status(statusCodes.success).json({
                status : statusCodes.success,
                msg : "Task deleted successfully"
            })
            return;
        }

    }
    catch(error){
        console.error("Error deleting task:", error);
        res.status(statusCodes.internalServerError).json({
            status : statusCodes.internalServerError,
            msg : "Internal Server Error"
        });
        return
    }
}