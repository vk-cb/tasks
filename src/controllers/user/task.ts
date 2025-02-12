import { Request, Response, NextFunction } from "express";
import { taskValidation } from "../../validation/tasks/taskValidation";
import { statusCodes } from "../../utility/statusCodes";
import tasks from "../../models/tasks";
import users from "../../models/users";

export const createTaskController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const taskData = req.body;
        const { error } = taskValidation.validate(taskData);
        if (error) {
            res.status(statusCodes.badRequest).json({status: statusCodes.badRequest, msg: error.details[0].message });
            return;
        }
        // Ensure user information is available from the middleware
        const user = req.user;
        if (!user) {
            res.status(statusCodes.unauthorized).json({status: statusCodes.unauthorized, msg: "User not authenticated" });
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
            status: statusCodes.success,
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
        
        const user = req.user;
        if (!user) {
            res.status(statusCodes.unauthorized).json({status: statusCodes.unauthorized, msg: "User not authenticated" });
            return;
        }
        const getTasks = await tasks.find({ user: user._id, isActive : true });
        // sort task logic
        const sortedTasks = getTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.status(statusCodes.success).json({
            msg: "Tasks fetched successfully",
            data: sortedTasks,
            status: statusCodes.success,
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
            data: getTask,
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
        const userId = req.user?._id.toString(); 
        
        if (!userId) {
            res.status(statusCodes.unauthorized).json({
                status: statusCodes.unauthorized,
                msg: "Unauthorized: User not found",
            });
            return;
        }

        const updatedTask = await tasks.findOneAndUpdate(
            { _id: taskId, user: userId, isActive: true }, 
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
export const taskandUserDetails = async (req: Request, res:Response, next : NextFunction):Promise<void> =>{

    console.log("userDetails")
}

export const taskDetailController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(statusCodes.unauthorized).json({
                status: statusCodes.unauthorized,
                msg: "User not authenticated"
            });
            return;
        }

        // Fetch user details
        const userProfile = await users.findById(user._id).select("name email role");
        if (!userProfile) {
            res.status(statusCodes.notFound).json({
                status: statusCodes.notFound,
                msg: "User not found"
            });
            return;
        }

        // Fetch tasks
        const getTasks = await tasks.find({ user: user._id, isActive: true });

        // Task counts
        const totalTasks = getTasks.length;
        const pendingTasks = getTasks.filter(task => task.status === "pending").length;
        const doneTasks = getTasks.filter(task => task.status === "done").length;
        const inProgressTasks = getTasks.filter(task => task.status === "in-progress").length;

       
        res.status(statusCodes.success).json({
            msg: "Task details fetched successfully",
            status: statusCodes.success,
            data: {
                profile: userProfile,
                taskStats: {
                    totalTasks,
                    pendingTasks,
                    doneTasks,
                    inProgressTasks
                }
                
            }
        });
        return;
    } catch (error) {
        console.error("Error fetching task details:", error);
        next(error);
        return;
    }
};
