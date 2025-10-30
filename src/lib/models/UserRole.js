import mongoose, { mongo } from "mongoose";

const UserRoleSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    role: {type: mongoose.Schema.Types.ObjectId, ref: 'role', required: true},
    isDeleted: {type: Boolean , default: false},
})

export default mongoose.models.userrole || mongoose.model('userrole' , UserRoleSchema);