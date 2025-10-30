import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    booking: {type: mongoose.Schema.Types.ObjectId , ref:'booking' , required:true , unique: true},
    transactionId : {type: Number , required:true , unique: true},
    amount: {type: Number , required:true},
    paymentMethod: { type: String, enum: ['UPI', 'Credit_Card', 'Cash', , 'Bank_cheque'], default: 'Credit_Card' },
    status: { type: String, enum: ['Sucessfull', 'Pending', 'Error', 'Cancelled'], default: 'Pending' },
} , {timestamps: true});

export default mongoose.models.payment || mongoose.model('payment' , paymentSchema);