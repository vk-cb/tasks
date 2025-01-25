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
        const getTasks = await tasks.find({ user: user._id });
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