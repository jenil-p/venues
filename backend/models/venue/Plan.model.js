import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {type: String , required: true},
    venue: {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required:true},
    duration: {type: String},
    description: {type: String , required: true ,  maxlength: 800, trim: true},
    baseprice: {type: Number, required:true},
})

export default mongoose.models.plan || mongoose.model('plan' , planSchema);