import mongoose from "mongoose";

const HostmasterSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    fullname: {type: String , required: true},
    contact1: {type:Number , required: true},
    contact1: {type:Number},
    pannumber: {type: String , requires: true},
    idProof: {type: String, },
    photo: {type: String ,}
})

export default mongoose.models.hostmaster || mongoose.model('hostmaster' , HostmasterSchema);



//  i will...
//  review this table for bank details
//  think of how payment getways will be integrated (keys)
//  how autorization will be done , on what basis (Leagal documents or what ???)