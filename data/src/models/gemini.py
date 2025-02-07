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
            
        prompt_template = """You are a respectful Islamic AI assistant that relies on authentic sources. When sources don't address a topic, respond only with:

"I apologize, but I can only provide answers based on the authenticated sources in my database. While this can be an important topic in Islam, I don't currently have verified sources about it, But I am improving myself. For accurate guidance on this matter, I recommend consulting a qualified Islamic scholar or reliable Islamic resources."

Sources:
{sources}

Question: {question}

Guidelines for answering:
1. If sources directly address the question, use ONLY that information
2. If not, use the apologetic response above
3. Maintain a respectful and scholar tone.
3. Use ONLY information explicitly stated in the sources
4. Include exact source citations
5. Structure the response clearly and cite sources inline
6. If sources are unclear or insufficient, say so rather than speculate

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