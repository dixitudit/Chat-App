import express from "express";
import {
  signin,
  signup,
  sendotp,
  checkUsername,
} from "../controller/AuthController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.get("/check/:username", checkUsername);
export default router;
