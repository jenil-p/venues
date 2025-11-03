import mongoose from "mongoose";

const RolePermissionSchema = new mongoose.Schema({
    role : {type: mongoose.Schema.Types.ObjectId, ref: 'role', required: true},
    table : {type: mongoose.Schema.Types.ObjectId, ref: 'apptable', required: true},
    operation : {type: mongoose.Schema.Types.ObjectId, ref: 'operation', required: true},
    isDeleted: {type: Boolean , default : false},
})

export default mongoose.models.rolepermission || mongoose.model('rolepermission' , RolePermissionSchema);