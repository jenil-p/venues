import prisma from "../prisma/client.js";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
export async function sendOtp(req, res) {
    try {
        const { contactnumber } = req.body;

        const verification = await client.verify.v2
            .services("VAca7392b17d913a0576bd170003a1a352")
            .verifications.create({
                to: contactnumber.startsWith("+91") ? contactnumber : `+91${contactnumber}`,
                channel: "sms"
            });

        res.json({ success: true, sid: verification });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "OTP send failed" });
    }
}

export async function verifyOtp(req, res) {
    try {
        const { contactnumber, otp } = req.body;

        const verificationCheck = await client.verify.v2
            .services("VAca7392b17d913a0576bd170003a1a352")
            .verificationChecks.create({
                to: contactnumber.startsWith("+91") ? contactnumber : `+91${contactnumber}`,
                code: otp
            });

        if (verificationCheck.status === "approved") {
            return res.json({ success: true, message: "OTP verified" });
        }

        res.status(400).json({ success: false, message: "Invalid OTP" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "OTP verification failed" });
    }
}

export async function createUser(req, res) {
    const { username, email, fullname, contactnumber, password } = req.body;
    const findUser = await prisma.user.findUnique({
        where: {
            contactnumber: contactnumber,
        }
    })
    if (findUser) {
        return res.status(409).json({ message: "user exists with this phone number ..." });
    }
    await prisma.user.create({
        username,
        fullname,
        email,
        password,
        contactnumber
    })
    return res.status(200).json({ message: 'user created successfully !' });
};

export async function validateUserLogin(req, res) {
    const { contactnumber, password } = req.body;
    try {
        const token = await User.matchPasswordAndCreateToken(contactnumber, password);
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        return res.status(400).json({ message: "incorrect contactnumber or password!" });
    }
}

export async function logOutHelper(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout sucessfull !" });
}

export async function getUser(req, res) {
    const user = req.user;
    return res.status(200).json({ user });
}