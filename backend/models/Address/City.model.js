import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
    name: {type : String , required: true , unique: true , },
    state : {type : mongoose.Schema.Types.ObjectId , ref : 'state' , required: true},
    country : {type : mongoose.Schema.Types.ObjectId , ref:'country' ,required: true},
})

export default mongoose.models.City || mongoose.model('city' , CitySchema);