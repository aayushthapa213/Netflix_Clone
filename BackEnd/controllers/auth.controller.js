import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email!" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters!",
      });
    }

    const exicitingUserByEmail = await User.findOne({ email: email });

    if (exicitingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exists!" });
    }

    const exicitingUserByUserName = await User.findOne({ username: username });

    if (exicitingUserByUserName) {
      return res
        .status(400)
        .json({ success: false, message: "UserName Already Exists!" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const ProfilePics = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = ProfilePics[Math.floor(Math.random() * ProfilePics.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in SignUp Controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
}

export async function login(req, res) {
  res.send("LogIn Route");
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    return res
      .status(200)
      .json({ success: true, message: "Successfully Logged Out!" });  
  } catch (error) {
    console.log("Error in LogOut Controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
}
