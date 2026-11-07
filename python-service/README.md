# AI Customer Support Agent with Long-Term Memory

## Project Overview

This project is an AI-powered customer support chatbot built using Python, Flask, Groq API, and SQLite.

It uses a Large Language Model (LLM) to understand customer questions and provide friendly, professional support. It can remember customer details across conversations using a SQLite database.

## Features

- AI-powered customer support conversations
- Long-term memory using SQLite
- Remembers customer names and previously shared order details
- Separate customer memory using browser-generated customer IDs
- Refund guidance
- Returns and replacements guidance
- Damaged product support
- Complaint handling
- Order and delivery assistance
- English and Kannada language support
- Modern web-based chat interface
- Secure API key storage using environment variables

## Technologies Used

- Python
- Groq API
- OpenAI GPT-OSS 20B model through Groq
- Flask
- SQLite
- HTML
- CSS
- JavaScript
- python-dotenv

## Project Structure

- `ai_logic.py` – Handles AI responses and communication with the Groq API.
- `app.py` – Runs the Flask web application and chatbot API.
- `memory.py` – Stores and retrieves customer information using SQLite.
- `templates/index.html` – Provides the chatbot's web interface.
- `text_ai.py` – Terminal-based chatbot interface.
- `.env` – Stores the Groq API key.
- `.gitignore` – Prevents sensitive and temporary files from being uploaded.
- `customer_memory.db` – SQLite database created automatically.
- `README.md` – Project documentation.

## Installation and Setup

1. Install Python.
2. Open the project folder in VS Code.
3. Install the required packages:

   ```bash
   python -m pip install groq python-dotenv flask flask-cors
   ```

4. Create a `.env` file in the project folder.
5. Add your Groq API key:

   ```env
   GROQ_API_KEY=your_groq_api_key
   ```

6. Start the application:

   ```bash
   python app.py
   ```

7. Open your browser and visit:

   `http://127.0.0.1:5000`

## Long-Term Memory

The chatbot uses SQLite to store customer details such as names and previously shared order information.

Customer information is retrieved during future conversations, even after restarting the application.

## Current Limitations

- Real order tracking is not connected.
- Refunds and replacements cannot be processed automatically.
- No real order management database is connected.
- Customer IDs are browser-based demo identifiers, not secure authentication.
- Memory extraction currently recognises simple English phrases such as "My name is" and "I ordered".

## Future Improvements

- Integrate a real order management system.
- Add live delivery tracking.
- Enable actual refund and replacement workflows through secure integrations.
- Improve multilingual memory extraction.
- Add secure customer authentication.
- Add an admin dashboard.

## Note

This project is a hackathon prototype demonstrating AI-powered customer support and long-term memory. Real order, payment, and delivery operations require additional integrations.