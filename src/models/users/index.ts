import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
     password : {
        type : String,
        required  : true
     }, 
     role : {
        type : String,
        required : true,
     },
     isActive : {
        type : Boolean,
        default : true
     }
},
{
    timestamps : true
}
)

export default mongoose.model('users', userSchema, "users")