import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auths.js";
import messageRoutes from "./routes/message.js";


//middleware
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config();


//connection to mongodb
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err);
  });


//routes
app.use("/api/users", userRoutes);
app.use("/api/auths", authRoutes);
app.use("/api/messages", messageRoutes);


//connection to the serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port 3000!");
});