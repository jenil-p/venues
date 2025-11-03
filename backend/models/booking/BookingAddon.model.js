import mongoose from "mongoose";

const bookingaddonSchema = new mongoose.Schema({
    booking: {type: mongoose.Schema.Types.ObjectId , ref:'booking' , required:true},
    addon:{type: mongoose.Schema.Types.ObjectId , ref:'venuedddon' , required:true},
})

export default mongoose.models.bookingaddon || mongoose.model('bookingaddon' , bookingaddonSchema);