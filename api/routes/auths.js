import express from "express";
import User from "../models/user.model.js"
import Pusher from "pusher";
import dotenv from "dotenv";

const router = express.Router()
dotenv.config();


const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

//REGISTRE
router.post("/register", async (req, res) => {

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    try{
        const savedUser = await newUser.save();
        const {password, ...others} = savedUser._doc;
        return res.status(201).json(others);
    }catch(err){
        return res.status(500).json(err)
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    try{

        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(401).json("Utilisateur non trouvé !");
        }

        const isPassswordCorrect = user.password === req.body.password;

        if(!isPassswordCorrect){
            return res.status(401).json("Mot de passe incorrect !");
        }

        user.isConnected = true;
        await user.save();

        pusher.trigger("user-channel", "user-connected", {
            userId: user?._id,
            name: user?.name
        });
        
        const {password, ...others} = user._doc;
        return res.status(201).json(others);

    }catch(err){
        return res.status(500).json(err)
    }
})

//LOGOUT
router.post("/login", async (req, res) => {
    try{

        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(401).json("Utilisateur non trouvé !");
        }

        const isPassswordCorrect = user.password === req.body.password;

        if(!isPassswordCorrect){
            return res.status(401).json("Mot de passe incorrect !");
        }

        user.isConnected = true;
        await user.save();

        pusher.trigger("user-channel", "user-connected", {
            userId: user?._id,
            name: user?.name
        });

        const {password, ...others} = user._doc;
        return res.status(201).json(others);

    }catch(err){
        return res.status(500).json(err)
    }
})


export default router