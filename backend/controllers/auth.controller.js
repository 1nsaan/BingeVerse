import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { genTokenAndSetCookie } from "../utils/genToken.js";


export const signup = async (req, res) => {
    try {

        const { username, email, password } = req.body;
    
        if (!email || !password || !username) {
            res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const existingEmail = await User.findOne({ email: email });

        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already in use!" });
        }

        const existingUsername = await User.findOne({ username: username });

        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already in use!" });
        }

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];


        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image,
        });


        genTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        //remove password from res
        return res.status(201).json({
            success: true, message: "User created successfully!", user: {
                ...newUser._doc,

            }
        });


    } catch (error) {

        console.log("user creation error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: "Please enter all fields" });
        }

        const user = await User.findOne({ email: email });

        //console.log(user);
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        //console.log(isPasswordCorrect);
        if (isPasswordCorrect) {
            genTokenAndSetCookie(user._id, res);
            return res.status(200).json({
                successs: true,
                message: "Login Successful",
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } else {
            return res.status(400).json({success:false,message:"Invalid Credentials"});

        }
    } catch (error) {

    }
}


export const logout = (req, res) => {

    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Logout Error", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export async function authCheck(req, res) {
	try {
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

