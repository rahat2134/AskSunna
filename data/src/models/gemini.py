# data/src/models/gemini.py
import google.generativeai as genai
from typing import Dict, Optional, Tuple
from functools import lru_cache
import hashlib
import json
from ..config.env_manager import env_manager
from .base import BaseLLM
import os 

try:
    from ..config.env_manager import env_manager
    GOOGLE_API_KEY = env_manager.gemini_key
except ImportError:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")

class GeminiLLM(BaseLLM):
    def __init__(self):
        genai.configure(api_key=env_manager.gemini_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
    def _get_cache_key(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Create a unique cache key from prompt and context"""
        # Convert context to a stable string representation
        context_str = json.dumps(context, sort_keys=True) if context else ""
        # Combine prompt and context
        combined = f"{prompt}::{context_str}"
        # Create hash for cache key
        return hashlib.md5(combined.encode()).hexdigest()

    @lru_cache(maxsize=100)
    def _cached_generate(self, cache_key: str, prompt: str) -> str:
        """Cached version of content generation"""
        response = self.model.generate_content(
            prompt,
            safety_settings=[
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        )
        return response.text

    def _construct_prompt(self, question: str, context: Optional[Dict] = None) -> str:
        # Previous prompt template code remains the same
        if not context:
            return question
            
        prompt_template = """You are an educational Islamic AI assistant. Analyze the provided authenticated sources and answer the question while following these guidelines:

Context: This is an educational discussion based on Islamic teachings from authenticated sources.

Sources:
{sources}

Question: {question}

Guidelines for answering:
1. Base your answer EXCLUSIVELY on the provided sources
2. Maintain a scholarly, respectful tone
3. If multiple interpretations exist in the sources, present them objectively
4. Structure the response in a clear, educational format
5. Always include relevant source citations
6. If the sources don't provide sufficient information, acknowledge the limitations
7. Focus on the ethical, spiritual, and practical aspects of the teaching
8. Present information in a way that emphasizes wisdom and guidance
9. Avoid speculation beyond what's directly supported by the sources

Please provide a structured response that honors these guidelines while accurately conveying the teachings from the sources."""
        
        sources_text = "\n".join([
            f"- [{source['source']}] {source.get('translation', '')}\n  Original: {source['text']}"
            if source.get('translation')
            else f"- [{source['source']}] {source['text']}"
            for source in context
        ])
        
        return prompt_template.format(
            sources=sources_text,
            question=question
        )

    async def generate(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate response with caching"""
        try:
            full_prompt = self._construct_prompt(prompt, context)
            cache_key = self._get_cache_key(prompt, context)
            
            try:
                return self._cached_generate(cache_key, full_prompt)
            except Exception as e:
                if "safety" in str(e).lower():
                    return (f"While the sources contain relevant information about {prompt.lower()}, "
                           "I recommend consulting with a qualified Islamic scholar for a more "
                           "complete understanding of this topic. They can provide proper context "
                           "and guidance based on these and other authentic sources.")
                raise Exception(f"Gemini API error: {str(e)}")
                
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")