import sys
import os
import logging

# Add agents directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.crew import run_crew

# Configure logging
logging.basicConfig(level=logging.INFO)


def test_crew():
    user_id = "be9408b5-4403-43b1-913e-f76be414863e"  # Seed Admin ID
    query = "Quais as últimas notícias de política?"

    print(f"Testing crew with user_id={user_id} and query='{query}'")

    try:
        result = run_crew(user_id, query)
        print("\n--- Result ---")
        print(result)
        print("--------------\n")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    test_crew()
