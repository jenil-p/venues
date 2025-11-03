import mongoose from "mongoose";
import { createHmac, randomBytes } from 'crypto';
import { createTokenForUser } from '../services/authentication.js';


const UserSchema = new mongoose.Schema({
    username : {type : String , required: true , unique: true},
    fullname : {type : String },
    contactnumber: {type: Number , required : true , unique: true},
    password: {type: String , required : true},
    salt: {type: String},
    email : {type : String , unique: true},
})

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

UserSchema.static("matchPasswordAndCreateToken", async function (username, password) {
    const user = await this.findOne({ username });

    const hashedPassword = user.password;

    if (!user) throw new Error('User not found!');

    const salt = user.salt;


    const password_entered = createHmac("sha256", salt)
        .update(password)
        .digest('hex');

    if (password_entered !== hashedPassword) {
        throw new Error('Incorrect password!');
    }

    const token = createTokenForUser(user);
    return token;
});

export default mongoose.models.user || mongoose.model('user' , UserSchema);