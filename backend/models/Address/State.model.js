import mongoose from "mongoose";

const StateSchema = new mongoose.Schema({
    name: {type : String , required: true , unique: true , },
    country : {type : mongoose.Schema.Types.ObjectId , ref:'country' ,required: true},
})

export default mongoose.models.State || mongoose.model('state' , StateSchema);