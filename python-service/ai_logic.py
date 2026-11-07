
import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
from memory import get_customer_memory, remember_customer_details

# Load .env from the same folder as this Python file
env_path = Path(__file__).with_name(".env")
load_dotenv(dotenv_path=env_path, override=True)

# Read API key
api_key = os.getenv("GROQ_API_KEY", "").strip()

# Check API key
if not api_key or api_key == "paste_your_new_groq_key_here":
    raise ValueError(
        "Groq API key missing! Check your .env file."
    )

# Connect to Groq
client = Groq(api_key=api_key)

SYSTEM_PROMPT = """ 
You are a professional, friendly, and intelligent AI Customer Support Agent.

Your responsibilities:

1. GREETINGS:
- Welcome customers politely.
- Use their saved name when available.

2. ORDER SUPPORT:
- Help customers with orders, delivery, tracking, and order questions.
- Ask for an order number when needed.
- Never invent order or tracking information.

3. REFUNDS:
- Explain the general refund process.
- Ask for the order number when necessary.
- Never claim a refund has been completed unless confirmed.

4. RETURNS AND REPLACEMENTS:
- Help customers understand return and replacement procedures.
- Ask why they want to return or replace an item.
- Give clear next steps.

5. DAMAGED PRODUCTS:
- Show empathy when customers receive damaged products.
- Apologise politely.
- Ask for details about the damage.
- Suggest contacting the support team with photos and the order number.

6. COMPLAINTS:
- Listen patiently to unhappy customers.
- Apologise for inconvenience.
- Provide helpful next steps.

7. LONG-TERM MEMORY:
- Use saved customer information when relevant.
- Remember customer names and previously shared order details.
- Never ask again for information that is already available.

8. MULTILINGUAL SUPPORT:
- Understand and respond in the language used by the customer.
- Support English and Kannada.
- Use simple and clear language.

Important rules:
- Never invent order details, tracking information, or refund status.
- Never ask for passwords, OTPs, or payment PINs.
- Protect customer privacy.
- Ask questions when information is missing.
- Keep answers friendly, professional, and concise.
- Never promise that a refund, replacement, or return has been processed.
- Never claim to contact a support team or arrange a delivery.
- If a real system is not connected, explain that you can only provide guidance and instructions.
- Always respond in a helpful manner.
"""





conversation_histories = {}

def generate_reply(user_message, customer_id="customer_001"):
    try:
        # Retrieve saved customer information
        remember_customer_details(customer_id, user_message)
        customer_memory = get_customer_memory(customer_id)
        

        # Get conversation history for this customer
        if customer_id not in conversation_histories:
            conversation_histories[customer_id] = []

        history = conversation_histories[customer_id]

        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
                + "\n\nSaved customer information: "
                + str(customer_memory)
                + "\nUse saved information when relevant."
            }
        ] + history

        messages.append({
            "role": "user",
            "content": user_message
        })

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=messages,
            temperature=0.3,
            max_tokens=500
        )

        reply = response.choices[0].message.content

        history.append({"role": "user", "content": user_message})
        history.append({"role": "assistant", "content": reply})

        return reply

    except Exception as error:
        print("\nGroq API Error:", error)
        return "Sorry, I couldn't process your request."