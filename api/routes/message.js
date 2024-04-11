import dotenv from "dotenv";
import express from "express";
import Message from "../models/message.model.js";
import Pusher from "pusher";

const router = express.Router();
dotenv.config();

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

router.post("/", async (req, res) => {
  try {
    const { sendId, sendName, receiveId, content, time } = req.body;
    pusher.trigger(`${receiveId}`, "inserted", {
      sendId: sendId,
      sendName: sendName,
      receiveId: receiveId,
      content: content,
      time: time,
    });
    pusher.trigger(`${sendId}`, "inserted", {
      sendId: sendId,
      sendName: sendName,
      receiveId: receiveId,
      content: content,
      time: time,
    });
    await Message.create({
      sendId,
      sendName,
      receiveId,
      content,
      time,
    });
    res.send("Message créé avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création du message");
  }
});

//GET ALL MESSAGES
router.get("/", async (req, res) => {
    try{
        const messages = await Message.find();
        return res.status(200).json(messages);
    }catch(err){
        return res.status(500).json(err)
    }
})

export default router;
