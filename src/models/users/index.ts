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
     tasks:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks',
        }],
     role : {
        type : String,
        required : true,
        ref : "roles"
     }
},
{
    timestamps : true
}
)

export default mongoose.model('users', userSchema, "users")