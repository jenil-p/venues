import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    street : {type : String , required : true},
    city : {type : mongoose.Schema.Types.ObjectId , ref:'city' ,required: true},
    state : {type : mongoose.Schema.Types.ObjectId , ref:'state' ,required: true},
    country : {type : mongoose.Schema.Types.ObjectId , ref:'country' ,required: true},
    postalcode : {type: Number , required: true},
    latitude : {type : Number , required : true},
    longitude: { type : Number , required : true},
})

export default mongoose.models.address || mongoose.model('address' , AddressSchema);