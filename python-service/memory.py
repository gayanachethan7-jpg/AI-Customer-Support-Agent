import sqlite3
import re
from pathlib import Path

DB_PATH = Path(__file__).with_name("customer_memory.db")


def initialize_database():
    connection = sqlite3.connect(DB_PATH)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS customer_memories (
            customer_id TEXT,
            memory_key TEXT,
            memory_value TEXT,
            PRIMARY KEY (customer_id, memory_key)
        )
    """)

    connection.commit()
    connection.close()


def save_memory(customer_id, memory_key, memory_value):
    connection = sqlite3.connect(DB_PATH)

    connection.execute("""
        INSERT OR REPLACE INTO customer_memories
        (customer_id, memory_key, memory_value)
        VALUES (?, ?, ?)
    """, (customer_id, memory_key, memory_value))

    connection.commit()
    connection.close()


def get_customer_memory(customer_id):
    connection = sqlite3.connect(DB_PATH)

    result = connection.execute("""
        SELECT memory_key, memory_value
        FROM customer_memories
        WHERE customer_id = ?
    """, (customer_id,)).fetchall()

    connection.close()

    return dict(result)
def remember_customer_details(customer_id, user_message):
    # Recognise when a customer shares their name
    name_match = re.search(
        r"\bmy name is\s+([A-Za-z][A-Za-z '-]{0,49})",
        user_message,
        re.IGNORECASE
    )

    if name_match:
        name = name_match.group(1).strip()
        save_memory(customer_id, "name", name)

    # Recognise when a customer shares what they ordered
    order_match = re.search(
        r"\bi ordered\s+(?:a|an|the)?\s*(.+)",
        user_message,
        re.IGNORECASE
    )

    if order_match:
        product = order_match.group(1).strip().rstrip(".!?")
        if product:
            save_memory(customer_id, "product", product)