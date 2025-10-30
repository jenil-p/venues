import mongoose from "mongoose";

const MenuLinkSchema = new mongoose.Schema({
    displayname: {type: String , required: true , unique: true},
    url: {type: String , required: true , }, // unique: true  <--- think of it
    icon: {type: String, },
    parentid : {type: mongoose.Schema.Types.ObjectId, ref: 'menulink', required: true},
    table : {type: mongoose.Schema.Types.ObjectId, ref: 'apptable', required: true},
})

export default mongoose.models.menulink || mongoose.model('menulink' , MenuLinkSchema);