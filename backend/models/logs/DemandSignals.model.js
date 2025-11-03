import mongoose from "mongoose";

const demandSchema = new mongoose.Schema({
    venue : {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required:true},
    signalDate : {type : Date , default : Date.now , required : true},
    searchCount : {type : Number ,},
    viewCount : {type : Number} ,
    bookingAttempts : {type : Number} ,
    conversionRate: {type : Number , min :0 , max: 100},
} , {timestamps: true}) 

export default mongoose.models.demandsignal || mongoose.model('demandsignal' , demandSchema);