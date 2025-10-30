import mongoose from "mongoose";

const bookingStatusSchema = new mongoose.Schema({
    name: {type : String , required : true , unique : true},
})

export default mongoose.models.bookigstatus || mongoose.model('bookingstatus' , bookingStatusSchema);