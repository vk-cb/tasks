import Role from "../../models/roles/index";
import { statusCodes } from "../../utility/statusCodes";
import { Request, Response } from "express";

export const initializeRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = ["admin", "user"];
    const insertedRoles: { id: string; role: string }[] = [];

    for (const role of roles) {
      // Check if the role already exists in the database
      const exists = await Role.findOne({ role });
      if (!exists) {
        // Create a new role if it doesn't exist
        const newRole = await Role.create({ role });
        insertedRoles.push({ id: newRole._id.toString(), role: newRole.role });
      } else {
        // Include the existing role's id and role
        insertedRoles.push({ id: exists._id.toString(), role: exists.role });
      }
    }

    // Send a success response with the roles
    res.status(statusCodes.success).json({
      message: "Roles initialized successfully",
      data: insertedRoles,
    });
  } catch (error) {
    console.error("Error initializing roles:", error);

    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(statusCodes.internalServerError).json({
      message: "Error initializing roles",
      error: errorMessage,
    });
  }
};
