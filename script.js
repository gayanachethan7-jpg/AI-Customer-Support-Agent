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

let conversations = [];
let currentConversationId = null;
let memory = {
    profile: "",
    preferences: "",
    interactions: []
};

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

    const messageText = document.createElement("p");
    messageText.textContent = text;

    message.appendChild(messageText);
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
    typing.classList.add("message", "assistant-message", "typing-indicator");
    typing.textContent = "Memora AI is typing...";
    chatArea.appendChild(typing);
    chatArea.scrollTop = chatArea.scrollHeight;

    return typing;
}

function getTemporaryResponse(message) {
    const text = message.toLowerCase();

    if (text.includes("order") || text.includes("track")) {
        return "I can help you track your order! Please provide your order ID.";
    }

    if (text.includes("refund") || text.includes("return")) {
        return "I can help with your refund or return request. Please share your order ID and briefly explain the issue.";
    }

    if (text.includes("product")) {
        return "I'd be happy to help with product information. Which product would you like to know more about?";
    }

    if (text.includes("account") || text.includes("login")) {
        return "I can help with your account. Could you tell me more about the issue you're experiencing?";
    }

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! I'm Memora AI, your customer support assistant. How can I help you today?";
    }

    return "Thanks for reaching out! I'm a frontend demo right now. Once we connect the AI backend, I'll be able to provide real support and remember useful details from our conversations.";
}

function sendMessage(text) {
    const messageText = text.trim();

    if (!messageText) return;

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

    const typingIndicator = showTypingIndicator();

    setTimeout(() => {
        typingIndicator.remove();

        const response = getTemporaryResponse(messageText);

        conversation.messages.push({
            text: response,
            sender: "assistant"
        });

        memory.interactions.unshift(messageText);
        renderMemory();

        addMessage(response, "assistant");
    }, 900);
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
    alert("Login and Sign Up will be implemented when we build the authentication backend.");
});

editMemoryBtn.addEventListener("click", () => {
    const updatedProfile = prompt(
        "Enter customer information to remember:",
        memory.profile
    );

    if (updatedProfile !== null) {
        memory.profile = updatedProfile.trim();
        renderMemory();
    }
});

clearMemoryBtn.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to clear all temporary memory?");

    if (confirmed) {
        memory = {
            profile: "",
            preferences: "",
            interactions: []
        };

        renderMemory();
    }
});

createConversation();