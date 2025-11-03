import mongoose from "mongoose";

const ActionLogSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    table: {type: mongoose.Schema.Types.ObjectId, ref: 'apptable', required: true},
    operation: {type: mongoose.Schema.Types.ObjectId, ref: 'operation', required: true},
    operationObjectID : {type: mongoose.Schema.Types.ObjectId , requires: true},
    operationDate: { type: Date, default: Date.now },
})

export default mongoose.models.actionlog || mongoose.model('actionlog' , ActionLogSchema);