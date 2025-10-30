import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiver: {type: mongoose.Schema.Types.ObjectId , ref:'user' , required:true},
    sendertype : {type : String , required:true},
    sender: {type: mongoose.Schema.Types.ObjectId , ref:'user' , required:true},
    message: {type: String},
    type: {type: String},
    relatedid : {type: mongoose.Schema.Types.ObjectId},
    isread: {type: Boolean , default: false},
} , {timestamps:  true});

export default mongoose.models.notification || mongoose.model('notification' , notificationSchema);