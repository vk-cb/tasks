import express  from "express";
import  {initializeRoles}  from "../../controllers/roles/roleController";

const roleRouter = express.Router();

roleRouter.get('/get-roles', initializeRoles );  

export default roleRouter