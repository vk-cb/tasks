
import taskStatus from "../../models/taskStatus";
import { statusCodes } from "../../utility/statusCodes";
import { Request, Response } from "express";

export const taskStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskStatusCustom = [ "pending", "in-progress", "done" ];
    const insertedTasksStatus: { id: string; taskStatus: string }[] = [];

    for (const status of taskStatusCustom) {
      
      const exists = await taskStatus.findOne({ status });
      if (!exists) {
      
        const newTask = await taskStatus.create({ status });
        insertedTasksStatus.push({ id: newTask._id.toString(), taskStatus: newTask.status });
      } else {
        
        insertedTasksStatus.push({ id: exists._id.toString(), taskStatus: exists.status });
      }
    }

    
    res.status(statusCodes.success).json({
      message: "Tasks status fetched successfully",
      status : statusCodes.success,
      data: insertedTasksStatus,
    });
  } catch (error) {
    console.error("Error initializing tasks:", error);

    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCodes.internalServerError).json({
      message: "Error initializing tasks",
      error: errorMessage,
    });
  }
};
