import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    venue: {type: mongoose.Schema.Types.ObjectId , ref:'venue' , required:true},
    image: {type: String , required:true},
    description: {type: String},
    isPrimary: {type: Boolean , default: false},
});

export default mongoose.models.venuephoto || mongoose.model('venuephoto' , photoSchema);