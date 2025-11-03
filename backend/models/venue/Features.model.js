import mongoose from "mongoose";

const featuresSchema = new mongoose.Schema({
    name: {type: String , required:true , unique: true},
    icon: {type : String , required: true},
})

export default mongoose.models.feature || mongoose.model('feature' , featuresSchema);