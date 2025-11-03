import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId , ref: 'user' , required: true},
    venue: {type: mongoose.Schema.Types.ObjectId , ref: 'venue' , required: true}, // later we can replace this with 'Services'
} , {
    Timestamp:true,
});

export default mongoose.models.wishlist || mongoose.model('wishlist' , WishlistSchema);