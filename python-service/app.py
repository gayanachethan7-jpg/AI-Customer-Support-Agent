from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from ai_logic import generate_reply
from memory import initialize_database

app = Flask(__name__)
initialize_database()
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Please enter a message"}), 400

    customer_id = data.get("customer_id", "customer_001")
    reply = generate_reply(message, customer_id)

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True, port=5001)