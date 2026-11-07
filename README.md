# AI Customer Support Agent

An AI-powered customer support chatbot built using HTML, CSS, JavaScript, Node.js, Express, Python, Flask, Groq API, MySQL and SQLite.

The application generates AI-powered customer support responses and maintains customer conversation history and long-term memory.

## Features

- AI-powered customer support chatbot
- Customer registration
- Persistent conversation history using MySQL
- Long-term customer memory using SQLite
- Customer information and order-detail recognition
- English and Kannada language support
- Markdown-formatted AI responses
- Refund, return, replacement and delivery guidance
- Separate frontend, backend and AI service

## Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript
- Marked.js
- DOMPurify

**Backend**
- Node.js
- Express.js
- MySQL
- mysql2

**AI Service**
- Python
- Flask
- Groq API
- GPT-OSS 20B model
- SQLite
- python-dotenv

## Project Structure

```text
AI-Customer-Support-Agent/
|
|-- index.html
|-- style.css
|-- script.js
|-- .gitignore
|-- README.md
|
|-- database/
|   |-- schema.sql
|
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |   |-- ollama.js
|   |   |-- openai.js
|   |-- routes/
|   |   |-- chat.js
|   |-- package.json
|   |-- package-lock.json
|   |-- server.js
|   |-- .env.example
|
|-- python-service/
    |-- app.py
    |-- ai_logic.py
    |-- memory.py
    |-- text_ai.py
    |-- requirements.txt
    |-- README.md
    |-- .env.example
    |-- templates/
        |-- index.html

## Application Architecture

1. The frontend sends customer requests to the Node.js backend.
2. The backend validates customer information using MySQL.
3. The backend forwards messages to the Python Flask AI service.
4. The Python service generates responses using the Groq API.
5. SQLite maintains long-term customer memory.
6. The Node.js backend stores conversations in MySQL.
7. The generated response is returned to the frontend.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gayanachethan7-jpg/AI-Customer-Support-Agent.git
cd AI-Customer-Support-Agent
```

### 2. MySQL Database Setup

- Start MySQL Server.
- Open MySQL Workbench.
- Execute `database/schema.sql`.

This creates the `ai_customer_support` database and its required tables: `customers` and `conversations`.

### 3. Node.js Backend

Open a terminal:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a template. Configure your MySQL credentials.

Start the backend:

```bash
npm start
```

The backend runs at `http://localhost:5000`.

### 4. Python AI Service

Open another terminal:

```bash
cd python-service
python -m venv venv
venv\Scripts\activate
python -m pip install -r requirements.txt
```

Create a `.env` file using `.env.example` as a template. Add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
```

Start the AI service:

```bash
python app.py
```

The Flask service runs at `http://127.0.0.1:5001`.

### 5. Frontend

Open the root `index.html` file in your browser, or use the VS Code Live Server extension.

Keep both backend services running while using the chatbot.

## Database and Memory

**MySQL**
- Stores customer registration information.
- Stores customer messages and AI responses.
- Retrieves previous conversation history.

**SQLite**
- Maintains long-term customer memory.
- Stores recognized customer details and order information.
- Creates its database automatically when the Python service starts.

## Environment Variables

Never upload actual `.env` files or API keys.

The repository provides `.env.example` files containing configuration placeholders.

## Current Limitations

- Real-time order tracking is not connected.
- Refunds and replacements are guidance-based, not automatically processed.
- Customer IDs are demo identifiers and do not provide secure authentication.
- Memory extraction recognizes a limited set of customer information patterns.
- Localhost configuration is intended for local development.

## Future Improvements

- Secure customer authentication.
- Real order management integration.
- Live delivery tracking.
- Automated refund and replacement workflows.
- Improved multilingual memory extraction.
- Customer support administration dashboard.

## Project Note

This project demonstrates the integration of frontend technologies, backend development, AI-powered responses, relational database storage and long-term memory.

It is a prototype and requires additional integrations before production use.

