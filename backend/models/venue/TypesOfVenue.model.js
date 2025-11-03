import mongoose from "mongoose";

const typeofvenueSchema = new mongoose.Schema({
    name: {type: String , required: true},
    icon: {type: String , required: true},
})

export default mongoose.models.typeofvenue || mongoose.model('typeofvenue' , typeofvenueSchema);