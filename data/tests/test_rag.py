# data/tests/test_rag.py
import asyncio
import os
import sys
from pathlib import Path
import time
import argparse

# Add the project root to Python path
project_root = Path(__file__).parents[2]
sys.path.append(str(project_root))

from data.src.rag.rag import IslamicRAG
from data.src.config.env_manager import env_manager

async def test_regular_queries(rag):
    """Test regular queries"""
    test_queries = [
        ("What does Islam say about intentions?", "hadith"),
        ("How to bath correctly?", "quran"),
        ("What are the teachings about marriage in islam?", None)
    ]
    
    for query, source_type in test_queries:
        print("\n" + "="*50)
        print(f"Query: {query}")
        print(f"Source Type: {source_type if source_type else 'all'}")
        
        try:
            answer, sources = await rag.answer_question(query, source_type)
            print("\nAnswer:")
            print(answer)
            print("\nSources Used:")
            for i, source in enumerate(sources, 1):
                print(f"\n{i}. Source: {source['source']}")
                print(f"   Type: {source['type']}")
                if source['translation']:
                    print(f"   Arabic: {source['text']}")
                    print(f"   Translation: {source['translation']}")
                else:
                    print(f"   Text: {source['text']}")
                print(f"   Relevance Score: {source['score']:.4f}")
        except Exception as e:
            print(f"Error processing query: {str(e)}")

async def test_caching(rag):
    """Test caching functionality"""
    print("\n" + "="*50)
    print("Testing Cache Functionality")
    print("="*50)
    
    test_query = "What does Islam say about intentions?"
    
    # First call
    print("\nFirst API Call:")
    start_time = time.time()
    answer1, sources = await rag.answer_question(test_query, "hadith")
    first_call_time = time.time() - start_time
    print(f"Time taken: {first_call_time:.2f} seconds")
    
    # Second call (should use cache)
    print("\nSecond API Call (Should use cache):")
    start_time = time.time()
    answer2, sources = await rag.answer_question(test_query, "hadith")
    second_call_time = time.time() - start_time
    print(f"Time taken: {second_call_time:.2f} seconds")
    
    print("\nCache Analysis:")
    print(f"First call time:  {first_call_time:.2f} seconds")
    print(f"Second call time: {second_call_time:.2f} seconds")
    print(f"Time saved: {(first_call_time - second_call_time):.2f} seconds")
    print(f"Responses match: {answer1 == answer2}")

async def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Test Islamic RAG system')
    parser.add_argument('--test-cache', action='store_true', help='Run cache testing')
    args = parser.parse_args()

    # Initialize the RAG system
    print("Initializing RAG system...")
    rag = IslamicRAG()
    
    # Run regular query tests
    await test_regular_queries(rag)
    
    # Run cache tests only if flag is provided
    if args.test_cache:
        await test_caching(rag)

if __name__ == "__main__":
    asyncio.run(main())