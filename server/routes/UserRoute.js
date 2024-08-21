import express from "express";
import { getUserById, getUserByUnemail } from "../controller/UserController.js";

const router = express.Router();

router.get("/id/:userId", getUserById);
router.get("/find/:unore", getUserByUnemail);

export default router;
