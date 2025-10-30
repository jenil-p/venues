import mongoose, { mongo } from "mongoose";

const AppTableSchema = new mongoose.Schema({
    tablename : {type : String , required: true , unique: true},
    displayname : {type : String , required: true , unique : true}
})

export default mongoose.models.apptable || mongoose.model("apptable" , AppTableSchema);