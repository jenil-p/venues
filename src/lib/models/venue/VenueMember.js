// this is host_venue (mapping) according to ER-diagram

import mongoose from "mongoose";

const VenueHostSchema = new mongoose.Schema({
    venue: {type: mongoose.Schema.Types.ObjectId , ref: 'venue' , required: true},
    host: {type: mongoose.Schema.Types.ObjectId , ref: 'hostmaster' , required: true},
    role: {type: mongoose.Schema.Types.ObjectId , ref: 'role' , required:true},
})

export default mongoose.models.venuehost || mongoose.model('venuehost' , VenueHostSchema);