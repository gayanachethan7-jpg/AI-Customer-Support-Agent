import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "AI Customer Support Chat API is working!"
    });
});

router.post("/customers", async (req, res) => {
    try {
        const { customer_name, email } = req.body;

        if (!customer_name || !email) {
            return res.status(400).json({
                message: "Customer name and email are required"
            });
        }

        const [result] = await db.query(
            "INSERT INTO customers (customer_name, email) VALUES (?, ?)",
            [customer_name, email]
        );

        res.status(201).json({
            message: "Customer registered successfully!",
            customer_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Customer registration failed",
            error: error.code === "ER_DUP_ENTRY"
                ? "Email already registered"
                : "Internal server error"
        });
    }
});

router.get("/customers", async (req, res) => {
    try {
        const [customers] = await db.query(
            "SELECT * FROM customers ORDER BY id DESC"
        );

        res.json(customers);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch customers"
        });
    }
});

router.post("/message", async (req, res) => {
    try {
        const { customer_id, message, response } = req.body;

        if (!customer_id || !message || !response) {
            return res.status(400).json({
                message: "Customer ID, message and response are required"
            });
        }

        const [customers] = await db.query(
            "SELECT id FROM customers WHERE id = ?",
            [customer_id]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const [result] = await db.query(
            `INSERT INTO conversations
             (customer_id, message, response)
             VALUES (?, ?, ?)`,
            [customer_id, message, response]
        );

        res.status(201).json({
            message: "Conversation saved successfully!",
            conversation_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to save conversation"
        });
    }
});

router.get("/history/:customer_id", async (req, res) => {
    try {
        const { customer_id } = req.params;

        const [conversations] = await db.query(
            `SELECT * FROM conversations
             WHERE customer_id = ?
             ORDER BY created_at ASC`,
            [customer_id]
        );

        res.json(conversations);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch conversation history"
        });
    }
});

router.post("/ask", async (req, res) => {
    try {
        const { customer_id, message } = req.body;

        if (!customer_id || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                message: "Customer ID and message are required"
            });
        }

        const [customers] = await db.query(
            "SELECT id FROM customers WHERE id = ?",
            [customer_id]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const aiServiceResponse = await fetch(
            "http://127.0.0.1:5001/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message.trim(),
                    customer_id: String(customer_id)
                })
            }
        );

        const aiData = await aiServiceResponse.json();

        if (!aiServiceResponse.ok) {
            throw new Error(aiData.error || "Python AI service failed");
        }

        if (!aiData.reply) {
            throw new Error("AI service returned an empty response");
        }

        const aiResponse = aiData.reply;

        const [result] = await db.query(
            `INSERT INTO conversations
             (customer_id, message, response)
             VALUES (?, ?, ?)`,
            [customer_id, message.trim(), aiResponse]
        );

        res.status(201).json({
            message: "AI response generated successfully!",
            conversation_id: result.insertId,
            customer_message: message.trim(),
            ai_response: aiResponse
        });

    } catch (error) {
        console.error("Chat error:", error);

        res.status(500).json({
            message: "Failed to generate AI response",
            error: error.message
        });
    }
});

export default router;