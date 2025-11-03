import mongoose, { mongo } from "mongoose";

const RoleSchema = new mongoose.Schema({
    rolename : {type : String , required: true , unique: true},
})


export default mongoose.models.role || mongoose.model('role' , RoleSchema);