const API_URL = "http://localhost:5000/api/chat";

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatArea = document.getElementById("chat-area");
const conversationList = document.getElementById("conversation-list");
const newChatBtn = document.querySelector(".new-chat-btn");
const suggestionButtons = document.querySelectorAll(".suggestion-card");
const memoryPanel = document.querySelector(".memory-panel");
const memoryBtn = document.querySelector(".memory-btn");
const closeMemoryBtn = document.querySelector(".close-memory-btn");
const loginButton = document.querySelector(".login-btn");
const editMemoryBtn = document.querySelector(".edit-memory-btn");
const clearMemoryBtn = document.querySelector(".clear-memory-btn");

let customerId = localStorage.getItem("customer_id");

let conversations = [];
let currentConversationId = null;

let memory = {
    profile: "",
    preferences: "",
    interactions: []
};

async function loadMarkdownLibraries() {
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    await loadScript(
        "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
    );

    await loadScript(
        "https://cdn.jsdelivr.net/npm/dompurify@3.2.6/dist/purify.min.js"
    );

    marked.setOptions({
        gfm: true,
        breaks: true
    });
}

function addMarkdownStyles() {
    if (document.getElementById("markdown-styles")) return;

    const style = document.createElement("style");
    style.id = "markdown-styles";

    style.textContent = `
        .markdown-content {
            line-height: 1.7;
            overflow-wrap: anywhere;
        }

        .markdown-content p {
            margin: 8px 0;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
            margin: 14px 0 8px;
        }

        .markdown-content ul,
        .markdown-content ol {
            padding-left: 24px;
            margin: 8px 0;
        }

        .markdown-content li {
            margin: 5px 0;
        }

        .markdown-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            display: block;
            overflow-x: auto;
        }

        .markdown-content th,
        .markdown-content td {
            border: 1px solid #ccc;
            padding: 9px 12px;
            text-align: left;
        }

        .markdown-content th {
            font-weight: bold;
        }

        .markdown-content blockquote {
            border-left: 3px solid #73C9D4;
            padding-left: 12px;
            margin: 10px 0;
        }

        .markdown-content pre {
            overflow-x: auto;
            padding: 12px;
            border-radius: 8px;
        }

        .markdown-content code {
            overflow-wrap: anywhere;
        }

        .markdown-content a {
            text-decoration: underline;
        }

        .markdown-content hr {
            margin: 12px 0;
        }
    `;

    document.head.appendChild(style);
}

async function initializeCustomer() {
    if (!customerId) {
        const customerName = prompt("Enter your name:");

        if (!customerName || !customerName.trim()) {
            alert("Customer registration is required.");
            return false;
        }

        const email = prompt("Enter your email:");

        if (!email || !email.trim()) {
            alert("Email is required.");
            return false;
        }

        try {
            const response = await fetch(`${API_URL}/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer_name: customerName.trim(),
                    email: email.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message);
            }

            customerId = String(data.customer_id);

            localStorage.setItem("customer_id", customerId);
            localStorage.setItem("customer_name", customerName.trim());

        } catch (error) {
            alert(error.message);
            return false;
        }
    }

    memory.profile = localStorage.getItem("customer_name") || "";

    await loadHistory();

    return true;
}

function createConversation() {
    const conversation = {
        id: Date.now(),
        title: "New Conversation",
        messages: []
    };

    conversations.unshift(conversation);
    currentConversationId = conversation.id;

    chatArea.innerHTML = "";
    renderConversations();
    userInput.focus();
}

function getCurrentConversation() {
    return conversations.find(
        conversation => conversation.id === currentConversationId
    );
}

function addMessage(text, sender) {
    const message = document.createElement("div");

    message.classList.add("message", `${sender}-message`);

    if (sender === "assistant" && window.marked && window.DOMPurify) {
        const messageContent = document.createElement("div");

        messageContent.classList.add("markdown-content");

        const html = marked.parse(String(text));

        messageContent.innerHTML = DOMPurify.sanitize(html);

        message.appendChild(messageContent);

    } else {
        const messageText = document.createElement("p");
        messageText.textContent = text;

        message.appendChild(messageText);
    }

    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;
}

function renderConversations() {
    conversationList.innerHTML = "";

    conversations.forEach(conversation => {
        const item = document.createElement("li");
        const button = document.createElement("button");

        button.classList.add("conversation-item");
        button.textContent = conversation.title;

        if (conversation.id === currentConversationId) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            currentConversationId = conversation.id;
            renderConversationMessages();
            renderConversations();
        });

        item.appendChild(button);
        conversationList.appendChild(item);
    });
}

function renderConversationMessages() {
    chatArea.innerHTML = "";

    const conversation = getCurrentConversation();

    if (!conversation) return;

    conversation.messages.forEach(message => {
        addMessage(message.text, message.sender);
    });
}

function showTypingIndicator() {
    const typing = document.createElement("div");

    typing.classList.add(
        "message",
        "assistant-message",
        "typing-indicator"
    );

    typing.textContent = "Memora AI is typing...";

    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;

    return typing;
}

async function loadHistory() {
    try {
        const response = await fetch(
            `${API_URL}/history/${customerId}`
        );

        if (!response.ok) {
            throw new Error("Unable to load conversation history.");
        }

        const history = await response.json();

        if (history.length > 0) {
            const conversation = {
                id: Date.now(),
                title: "Previous Conversations",
                messages: []
            };

            history.forEach(chat => {
                conversation.messages.push({
                    text: chat.message,
                    sender: "user"
                });

                conversation.messages.push({
                    text: chat.response,
                    sender: "assistant"
                });
            });

            conversations.unshift(conversation);
            currentConversationId = conversation.id;

            renderConversationMessages();
            renderConversations();

        } else {
            createConversation();
        }

    } catch (error) {
        console.error(error);
        createConversation();
    }
}

async function sendMessage(text) {
    const messageText = text.trim();

    if (!messageText || !customerId) return;

    if (!currentConversationId) {
        createConversation();
    }

    const conversation = getCurrentConversation();

    conversation.messages.push({
        text: messageText,
        sender: "user"
    });

    if (conversation.messages.length === 1) {
        conversation.title =
            messageText.length > 25
                ? `${messageText.substring(0, 25)}...`
                : messageText;
    }

    addMessage(messageText, "user");
    renderConversations();

    userInput.value = "";

    memory.interactions.unshift(messageText);
    renderMemory();

    const typingIndicator = showTypingIndicator();

    try {
        const response = await fetch(`${API_URL}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customer_id: customerId,
                message: messageText
            })
        });

        const data = await response.json();

        typingIndicator.remove();

        if (!response.ok) {
            throw new Error(data.error || data.message);
        }

        const aiResponse = data.ai_response;

        conversation.messages.push({
            text: aiResponse,
            sender: "assistant"
        });

        addMessage(aiResponse, "assistant");

    } catch (error) {
        typingIndicator.remove();

        const errorMessage =
            "Sorry, I'm unable to connect right now. Please try again.";

        conversation.messages.push({
            text: errorMessage,
            sender: "assistant"
        });

        addMessage(errorMessage, "assistant");

        console.error("Chat error:", error);
    }
}

function renderMemory() {
    document.getElementById("customer-profile").textContent =
        memory.profile || "No customer information available.";

    document.getElementById("user-preferences").textContent =
        memory.preferences || "No preferences saved yet.";

    document.getElementById("previous-interactions").textContent =
        memory.interactions.length
            ? memory.interactions.slice(0, 5).join(" • ")
            : "No previous interactions available.";
}

chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(userInput.value);
});

newChatBtn.addEventListener("click", createConversation);

suggestionButtons.forEach(button => {
    button.addEventListener("click", () => {
        sendMessage(button.textContent.trim());
    });
});

memoryBtn.addEventListener("click", () => {
    memoryPanel.classList.toggle("active");
});

closeMemoryBtn.addEventListener("click", () => {
    memoryPanel.classList.remove("active");
});

loginButton.addEventListener("click", () => {
    alert(
        `Currently registered as ${localStorage.getItem("customer_name") || "Customer"}`
    );
});

editMemoryBtn.addEventListener("click", () => {
    const updatedProfile = prompt(
        "Enter customer information:",
        memory.profile
    );

    if (updatedProfile !== null) {
        memory.profile = updatedProfile.trim();
        renderMemory();
    }
});

clearMemoryBtn.addEventListener("click", () => {
    const confirmed = confirm(
        "Clear the displayed temporary memory?"
    );

    if (confirmed) {
        memory.interactions = [];
        memory.preferences = "";
        renderMemory();
    }
});

async function startApplication() {
    try {
        await loadMarkdownLibraries();
        addMarkdownStyles();
        await initializeCustomer();

    } catch (error) {
        console.error("Markdown loading error:", error);

        alert(
            "Unable to load chat formatting libraries. Please check your internet connection and refresh."
        );
    }
}

startApplication();