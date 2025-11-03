import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongodbURL = process.env.MONGO_URI;

export const connectDatabaseMongoDB = async () => {
    await mongoose.connect(mongodbURL)
        .then(console.log('mongodb connected ...'))
        .catch((e) => console.log('error connecting datanase. error : ', e));
}
