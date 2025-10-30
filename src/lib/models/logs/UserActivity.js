import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId , ref:'user' , required:true},
    activityType: {type: mongoose.Schema.Types.ObjectId , ref:'operation' , required:true},
    venue: {type: mongoose.Schema.Types.ObjectId , ref: 'venue'},
    searchKeywords : {type: String},
} , {timestamps: true});

export default mongoose.models.useractivity || mongoose.model('useractivity' , userActivitySchema);