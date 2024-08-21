import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const user = req.params.userId;
    const data = await User.findOne({
      $or: [{ _id: user }, { email: user }, { username: user }],
    });
    if (!data || !data.name) {
      res.status(400).json("User not found");
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(200).json("Something went wrong!");
  }
};
