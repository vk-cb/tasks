import { Response, Request, NextFunction } from "express";
import { statusCodes } from "../../utility/statusCodes";
import users from "../../models/users";
import tasks from "../../models/tasks";


export const usersListController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const payload = req.body;
        const adminData = req.user;
        if(!adminData){
            res.status(statusCodes.unauthorized).json({ msg: "User not authenticated" });
            return;
        }
        else {
            if(adminData.role !== "admin"){
                res.status(statusCodes.unauthorized).json({ msg: "User not authenticated" });
                return;
            }
            else {
                if(payload.isActive){
                    const usersList = await users.find({ role: "user", isActive : payload.isActive });
                    res.status(statusCodes.success).json( { msg: "Users fetched successfully", data: usersList, noOfBlockedUsers : usersList.length });
                    return;
                }else{
                    const usersList = await users.find({ role: "user", isActive : true });
                    res.status(statusCodes.success).json({ msg: "Users fetched successfully", data: usersList, noOfUsers : usersList.length });
                    return;
                }
            }
        }
        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(statusCodes.internalServerError).json({ msg: "Internal Server Error" });
        return;
    }
}
export const activateDeactivateUserController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {

    try {
        const { id } = req.params;
        const user = await users.findById(id);
        const admin = req.user;
        if(admin.role !== "admin"){
            res.status(statusCodes.unauthorized).json({ msg: "You are not authorized" });
            return;
        }
        if (!user) {
            res.status(statusCodes.notFound).json({ msg: "User not found" });
            return;
        }
        user.isActive = !user.isActive;
        await user.save();
        res.status(statusCodes.success).json({ msg: "User updated successfully", data: user });
        return;
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(statusCodes.internalServerError).json({ msg: "Internal Server Error" });
        return;
    }
}

export const userWiseTaskListController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
   try {
    const userId = req.params.id;
    const admin = req.user;
    if(admin.role !== "admin"){
        res.status(statusCodes.unauthorized).json({
            msg : "You are not Authorized to access"
        })
        return;
    }
    const userTasks = await tasks.find({user : userId});
    
    if(!userTasks){
        res.status(statusCodes.notFound).json({
            msg : "User not found"
        })
        return;
    }
    res.status(statusCodes.success).json({
        msg : "Task fetched successfully",
        data : userTasks
    })
    return;
   } catch (error) {
    console.log(error)
    return;
   }
}      

export const deleteUserTaskController = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const taskId = req.params.id;
        const admin = req.user;
        if(admin.role !== "admin"){
            res.status(statusCodes.unauthorized).json({ msg: "You are not authorized" });
            return;
        }
        const deletedTask = await tasks.findOneAndUpdate({ _id: taskId, isActive: true }, { isActive: false }, { new: true });
        if (!deletedTask) {
            res.status(statusCodes.notFound).json({ msg: "Task not found" });
            return;
        }
        res.status(statusCodes.success).json({ msg: "Task deleted successfully", data: deletedTask });
        return;
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(statusCodes.internalServerError).json({ msg: "Internal Server Error" });
        return;
    }
}

export const updateAdminTaskController = async(req : Request, res : Response, next: NextFunction) : Promise<void> =>{
    try {
        const taskId = req.params.id;
        const admin = req.user; 
        if(req.user.role !== "admin"){
            res.status(statusCodes.unauthorized).json({ msg: "You are not authorized" });
            return;
        }
        const updatedTask = await tasks.findOneAndUpdate({_id : taskId, isActive :true }, req.body, {new : true});
        if(!updatedTask){
            res.status(statusCodes.notFound).json({ msg: "Task not found" });
            return;
        }
        res.status(statusCodes.success).json({ msg: "Task updated successfully", data: updatedTask });
        return;
    } catch (error) {
        res.status(statusCodes.internalServerError).json({ msg: "Internal Server Error" });
        return;
    }
}