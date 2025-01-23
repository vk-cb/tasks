import mongoose from "mongoose";

const roleSchema = new mongoose.Schema ({
    role : {
        enum : ["admin", "user"],
        required : true
    }
})

export default mongoose.model('roles', roleSchema, "roles")