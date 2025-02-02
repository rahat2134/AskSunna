# data/src/config/env_manager.py
import os
from pathlib import Path
from dotenv import load_dotenv

class EnvManager:
    def __init__(self):
        # First try to load from .env file
        project_root = Path(__file__).parents[3]
        env_path = project_root / '.env'
        
        # Try to load .env but don't fail if not found
        if env_path.exists():
            load_dotenv(str(env_path))
        
        # Get API key from environment variable (set in Railway dashboard)
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        if not self.google_api_key:
            raise ValueError(
                "GOOGLE_API_KEY not found in environment variables. "
                "Please ensure it's properly set in environment variables or .env file."
            )
    
    @property
    def gemini_key(self) -> str:
        return self.google_api_key
    
    @property
    def sunnah_key(self) -> str:
        return os.getenv('SUNNAH_API_KEY', '')
    
    @property
    def quran_key(self) -> str:
        return os.getenv('QURAN_API_KEY', '')

# Create singleton instance - this should be at the bottom
env_manager = EnvManager()