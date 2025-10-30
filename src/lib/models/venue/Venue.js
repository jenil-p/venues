import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
    venuename : {type: String , required:true },
    description: {type: String , required: true},
    capacity: {type : Number , required: true},
    address: {type: mongoose.Schema.Types.ObjectId , ref : 'address' , required: true},
    contactemail: {type: String , required: true},
    contactnumber1: {type: Number ,required: true},
    contactnumber2: {type: Number},
    status: { type: String, enum: ['Active', 'Under Maintenance', 'Pending', 'Blocked', 'Deleted'], default: 'Pending' },
})

export default mongoose.models.venue || mongoose.model('venue' , VenueSchema);