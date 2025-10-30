import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    venue: {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required:true},
    user: {type: mongoose.Schema.Types.ObjectId , ref:'user' , required:true},
    rating:{type : Number , min: 1 , max: 5},
    comment: { type: String, maxlength: 255, trim: true },
} , {timestamps : true});

export default mongoose.models.review || mongoose.model('review' , reviewSchema);