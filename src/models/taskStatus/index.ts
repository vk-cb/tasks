import mongoose from "mongoose";    

const taskStatusSchema = new mongoose.Schema ({
    status : {
        type : String,
        required : true,
        enum : [ "pending", "in-progress", "done" ]
    }
})

export default mongoose.model('taskStatus', taskStatusSchema, "taskStatus")