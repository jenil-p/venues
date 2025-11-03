import mongoose from "mongoose";

const venuefeatureSchema = new mongoose.Schema({
    venue: {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required: true},
    feature: {type: mongoose.Schema.Types.ObjectId , ref: 'feature' , required: true},
})

export default mongoose.models.venuefeature || mongoose.model('venuefeature' , venuefeatureSchema);