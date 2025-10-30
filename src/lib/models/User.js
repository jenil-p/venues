import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
    username : {type : String , required: true , unique: true},
    fullname : {type : String },
    contactnumber: {type: Number , required : true},
    password: {type: String , required : true},
    salt: {type: String},
    email : {type : String , unique: true},
})


export default mongoose.models.user || mongoose.model('user' , UserSchema);