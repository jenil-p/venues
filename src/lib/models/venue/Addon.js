import mongoose from "mongoose";

const addonSchema = new mongoose.Schema({
    name: {type: String , required: true , unique : true},
    icon: {type: String , required: true},
});

export default mongoose.models.addon || mongoose.model('addon' , addonSchema);