import mongoose from "mongoose";

const venuetypeSchema = new mongoose.Schema({
    venue: {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required:true},
    type: {type: mongoose.Schema.Types.ObjectId , ref:'typeofvenue' , required:true}
})

export default mongoose.models.venuetype || mongoose.model('venuetype' , venuetypeSchema);