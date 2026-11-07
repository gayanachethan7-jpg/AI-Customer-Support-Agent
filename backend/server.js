
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Chat API routes
app.use("/api/chat", chatRoutes);
app.get("/debug", (req, res) => {
    res.json({
        message: "Correct server.js is running",
        routesLoaded: true
    });
});
app.get("/", (req, res) => {
    res.send("AI Customer Support Agent Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

