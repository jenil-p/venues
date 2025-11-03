import mongoose from "mongoose";

const OperationSchema = new mongoose.Schema({
    operationname : {type : String , required: true , unique:true}
})

export default mongoose.models.operation || mongoose.model("operation" , OperationSchema);