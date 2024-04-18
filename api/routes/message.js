import dotenv from "dotenv";
import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
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


//ENTRAIN D'ECRIRE
router.post('/text-update', (req, res) => {
  const { text, name, receiveId } = req.body;
  pusher.trigger(`${receiveId}`, 'text-update', { text, name });
  res.status(200).send('OK');
});

//POST A MESSAGE
router.post("/", async (req, res) => {
  try {
    const { sendId, sendName, receiveId, content, time } = req.body;

    const user = await User.findById(receiveId);
    let messageStatus = ''
    if(user.isConnected){
      messageStatus = 'non lu'
    }else{
      messageStatus = 'en attente'
    }
    
    const message = await Message.create({
      sendId,
      sendName,
      receiveId,
      content,
      statut: messageStatus,
      time,
    });

    pusher.trigger(`${receiveId}`, "inserted", {
      _id: message._id,
      sendId: sendId,
      sendName: sendName,
      receiveId: receiveId,
      content: content,
      statut: messageStatus,
      time: time,
    });
    pusher.trigger(`${sendId}`, "inserted", {
      _id: message._id,
      sendId: sendId,
      sendName: sendName,
      receiveId: receiveId,
      content: content,
      statut: messageStatus,
      time: time,
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

//DELETE MESSAGE
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json("Message not found");
    }

    pusher.trigger(`${message?.receiveId}`, "deleted", message?._id);
    pusher.trigger(`${message?.sendId}`, "deleted", message?._id);

    await Message.findByIdAndDelete(message._id);
    return res.status(200).json("Message deleted successfully", );

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//UPDATE MESSAGE
router.put("/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json("Message not found");
    }

    message.content = content;
    await message.save()

    pusher.trigger(`${message.receiveId}`, "updated", message);
    pusher.trigger(`${message.sendId}`, "updated", message);

    return res.status(200).json(message);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
