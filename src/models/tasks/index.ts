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
        ref : "taskStatus"
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
})

export default mongoose.model('tasks', taskSchema, "tasks")