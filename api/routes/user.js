import express from "express";
import User from "../models/user.model.js";

const router = express.Router();


//GET ALL USERS CONNECTED
router.get("/connected", async (req, res) => {
    try{
        const connectedUsers = await User.find({ isConnected: true });

        const formattedUsers = connectedUsers.map((user) => ({
          userId: user._id,
          name: user.name,
        }));

        return res.status(200).json(formattedUsers);
    }catch(err){
        return res.status(500).json(err)
    }
})

//GET USER
router.get("/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;
        return res.status(200).json(others)
    }catch(err){
        return res.status(500).json(err)
    }
})

//GET ALL USERS
router.get("/", async (req, res) => {
    try{
        const users = await User.find().select("-password");
        return res.status(200).json(users)
    }catch(err){
        return res.status(500).json(err)
    }
})

export default router;
