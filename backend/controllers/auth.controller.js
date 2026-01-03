import prisma from "../prisma/client.js";
import dotenv from "dotenv";
import twilio from "twilio";

import { createTokenForUser, validateToken } from "../services/authentication.js";

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
export async function sendOtp(req, res) {
    try {
        const { contactnumber } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                contactnumber: contactnumber,
            }
        })

        if (!user) {
            return res.status(401).json({ message: "Unauthorised access..." });
        }

        const verification = await client.verify.v2
            .services(process.env.TWILIO_SERVICE)
            .verifications.create({
                to: contactnumber.startsWith("+91") ? contactnumber : `+91${contactnumber}`,
                channel: "sms"
            });

        return res.json({ success: true, sid: verification });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "OTP send failed" });
    }
}

export async function verifyOtp(req, res) {
    try {
        const { contactnumber, otp } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                contactnumber: contactnumber,
            }
        })

        if (!user) {
            return res.status(401).json({ message: "Unauthorised access..." });
        }

        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_SERVICE)
            .verificationChecks.create({
                to: contactnumber.startsWith("+91") ? contactnumber : `+91${contactnumber}`,
                code: otp
            });

        if (verificationCheck.status === "approved") {
            await prisma.user.update({
                where : {
                    contactnumber : contactnumber
                },
                data : {
                    isverified : true
                },
            })
            const token = createTokenForUser(user);
            res.cookie('token', token, { httpOnly: true });
            return res.json({ success: true, message: "OTP verified", token: token });
        }

        return res.status(400).json({ success: false, message: "Invalid OTP" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "OTP verification failed" });
    }
}

export async function createUser(req, res) {
    const { contactnumber, fullname, email } = req.body;
    const findUser = await prisma.user.findUnique({
        where: {
            contactnumber: contactnumber,
        }
    })
    if (findUser) {
        return res.status(409).json({ message: "user exists with this phone number ..." });
    }
    const newUser = await prisma.user.create({
        data: {
            contactnumber: contactnumber,
            fullname: fullname,
            email: email,
        }
    })

    const findRoleAsUser = await prisma.role.findUnique({
        where : {
            rolename : 'user',
        }
    })

    await prisma.userRole.create({
        data : {
            userId : newUser.id,
            roleId : findRoleAsUser.id,
            isDeleted : false,
        }
    })

    return res.status(200).json({ message: 'user created successfully ! and assigned as simple user ...' });
};

export async function deleteUser(req, res , next) {
    const { userId } = req.params;

    const findUser = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        }
    })

    if (!findUser || findUser.isDeleted) {
        return res.status(404).json({ message: "User not found ..." });
    }

    const deletedUser = await prisma.user.update({
        where: {
            id: Number(userId),
        },
        data : {
            isDeleted : true
        }
    })
    req.objectId =  userId;
    res.status(200).json({ message: "user deleted ..." })
    next();
}

export async function logOutHelper(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout sucessfull !" });
}

export async function getUser(req, res) {
    const user = req.user;
    return res.status(200).json({ user });
}