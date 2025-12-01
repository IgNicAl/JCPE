import sys
import os
import logging

# Add the current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.tools.jcpe_news_tools import search_jcpe_news

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_search(query):
    print(f"\n--- Testing search with query: '{query}' ---")
    result = search_jcpe_news(query)
    if result["status"] == "success":
        print(f"Found {result['total']} articles.")
        for article in result["articles"]:
            print(
                f"- [{article['category']}] {article['title']} (Tags: {article.get('tags', '')})"
            )
    else:
        print(f"Error: {result.get('message')}")


if __name__ == "__main__":
    print("Starting reproduction script...")

    # Test 1: Exact category match
    test_search("Política")

    # Test 2: Lowercase category match
    test_search("política")

    # Test 3: Subcategory/Tag match
    # Assuming there might be a tag like "Eleições" or "Futebol"
    test_search("Futebol")

    # Test 4: Full sentence query (Simulating bad agent behavior)
    test_search("Quero ver notícias de política")

    # Test 5: Partial match
    test_search("pol")
