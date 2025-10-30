// booking_stat according to ER-diagram

import mongoose from "mongoose";

const statisticSchema = new mongoose.Schema({
    venue: {type: mongoose.Schema.Types.ObjectId , ref: 'venue' , required: true},
    statDate : {type : Date , default: Date.now },
    pageViews: {type: Number ,},
    bookingrequests: {type: Number,},
    confirmedbookings: {type: Number},
    revenue: {type: Number},
})

export default mongoose.models.statisticvenue || mongoose.model('statisticvenue' , statisticSchema);