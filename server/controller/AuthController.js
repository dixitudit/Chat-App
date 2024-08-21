import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import otpGenerator from "otp-generator";
import OTP from "../models/otpModel.js";
import jwt from "jsonwebtoken";

//check username available
export const checkUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    if (user) {
      res.status(200).json({ message: "false" });
    } else {
      res.status(200).json({ message: "true" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// register new user
export const signup = async (req, res) => {
  const { username, password, name, email, otp } = req.body;
  if (!username || !name || !email || !password || !otp) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }
  const usernameExists = await User.findOne({ username: username });
  if (usernameExists) {
    return res.status(400).json("Username already exists");
  }
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(400).json("Email already exists");
  }
  try {
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username: username,
      password: hashedPassword,
      name: name,
      email: email,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// handle otp verification
export const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }
    //numeric 6 digit otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // check if otp already exists
    let result = await OTP.findOne({ otp: otp });
    // keep generating otp until unique otp is generated
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = new OTP({
      email: email,
      otp: otp,
    });
    await otpPayload.save();
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// sign in
export const signin = async (req, res) => {
  try {
    const { unameOrEmail, password } = req.body;
    if (!unameOrEmail || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      $or: [{ username: unameOrEmail }, { email: unameOrEmail }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Wrong Credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );
    const { password: pass, ...others } = user._doc;

    res.status(200).cookie("token", token).json({ user: others });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
