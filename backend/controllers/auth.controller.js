import User from '../models/User.model.js';

export async function createUser(req, res) {
    const { username, email, fullname , contactnumber , password } = req.body;
    const findUser = await User.findOne({ username });
    if (findUser) {
        return res.status(409).json({ message: "User already exists on the system with this email" });
    }
    await User.create({
        username,
        fullname,
        email,
        password,
        contactnumber
    });
    return res.status(200).json({ message: 'user created successfully !' });
};

export async function validateUserLogin(req, res) {
    const { username, password } = req.body;
    try {
        const token = await User.matchPasswordAndCreateToken(username, password);
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        return res.status(400).json({ message: "incorrect username or password!" });
    }
}

export async function logOutHelper(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout sucessfull !" });
}
