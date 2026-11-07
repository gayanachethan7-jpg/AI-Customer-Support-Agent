
const OLLAMA_URL = "http://localhost:11434";

async function generateResponse(message, memory = "") {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3.2:1b",
            stream: false,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful AI customer support agent.
Be polite and helpful.
Use previous customer information when relevant.
Customer's saved memories and history:
${memory}`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
    }

   const data = await response.json();

if (!data.message?.content) {
    throw new Error("Ollama returned an empty AI response");
}

return data.message.content.trim(); 
}

// Extract important long-term customer information
export async function extractMemory(message) {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3.2:1b",
            stream: false,
            messages: [
                {
                    role: "system",
                    content: `You extract long-term customer memories.

Save only useful facts explicitly shared by the customer,
such as their name, communication preferences and
ongoing support needs.

Do not save passwords, payment credentials or other
sensitive information.
Do not invent facts.
If there is no useful long-term information, output exactly:
NONE

Otherwise output only one short sentence describing
the important customer fact.`
                },
                {
                    role: "user",
                    content: message
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`Memory extraction failed: ${response.status}`);
    }

    const data = await response.json();

if (!data.message?.content) {
    throw new Error("Ollama returned an empty memory response");
}

return data.message.content.trim();
}

export default generateResponse;

