import User from "../models/userModel.js";

export const getUserById = async (req, res) => {
  try {
    const user = req.params.userId;
    const data = await User.findOne({ _id: user });
    if (!data || !data.name) {
      res.status(400).json("User not found");
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json("Something went wrong!");
  }
};

export const getUserByUnemail = async (req, res) => {
  try {
    const user = req.params.unore;
    const data = await User.findOne({
      $or: [{ username: user }, { email: user }],
    });
    if (!data || !data.name) {
      res.status(400).json("User not found");
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json("Something went wrong!");
  }
};
