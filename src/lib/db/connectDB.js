import mongoose from "mongoose";

const mongodbURL = process.env.MONGO_URI

const connectDatabaseMongoDB = async () => {
    await mongoose.connect(mongodbURL)
        .then(console.log('mongodb connected ...'))
        .catch((e) => console.log('error connecting datanase. error : ', e));
}

module.exports = connectDatabaseMongoDB;