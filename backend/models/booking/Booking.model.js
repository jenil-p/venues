import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId , ref:'user' , required: true},
    venue: {type: mongoose.Schema.Types.ObjectId , ref: 'venue' , required: true},
    bookingStatus : {type : mongoose.Schema.Types.ObjectId , ref:'bookingstatus' , required: true},
    plan: {type : mongoose.Schema.Types.ObjectId , ref: 'plan', },
    startTime: {type : Date , default: Date.now},
    endTime: {type : Date , default: Date.now},
    numberOfGuestsExpected : {type: Number},
    totalCost : {type: Number , required: true},
}, {timestamps : true});

export default mongoose.models.booking || mongoose.model('booking' , bookingSchema);