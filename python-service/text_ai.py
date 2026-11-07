
from ai_logic import generate_reply

print("================================")
print("   AI CUSTOMER SUPPORT CHATBOT")
print("================================")

while True:
    question = input("\nYou: ").strip()

    if question.lower() == "exit":
        print("Thank you for using our chatbot!")
        break

    if not question:
        print("Please enter a question.")
        continue

    answer = generate_reply(question)

    print("\nAI:", answer)
