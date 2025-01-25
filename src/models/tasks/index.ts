import { required } from "joi";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema ({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true, 
        default : "pending"
    },
    user: {
        type: String,
        required: true
    },
    isActive : {
        type : Boolean,
        default : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
})

export default mongoose.model('tasks', taskSchema, "tasks")