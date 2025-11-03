import mongoose from "mongoose";

const venueaddonSchema = new mongoose.Schema({
    addon: {type: mongoose.Schema.Types.ObjectId , ref:'addon' , required:true},
    venue: {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required:true},
    description : {type: String},
    price: {type : Number , required: true},
})

export default mongoose.models.venueaddon || mongoose.model('venueaddon' , venueaddonSchema);