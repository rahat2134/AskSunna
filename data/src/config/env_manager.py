# data/src/config/env_manager.py
import os
from pathlib import Path
from dotenv import load_dotenv

class EnvManager:
    def __init__(self):
        # Get the project root directory (3 levels up from this file)
        project_root = Path(__file__).parents[3]
        env_path = project_root / '.env'
        
        # Check if .env file exists
        if not env_path.exists():
            raise FileNotFoundError(f".env file not found at {env_path}")
            
        # Load environment variables from .env file
        load_dotenv(str(env_path))
        
        # Required API keys with better error message
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        if not self.google_api_key:
            raise ValueError(
                "GOOGLE_API_KEY not found in environment variables. "
                "Please ensure it's properly set in your .env file."
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

# Create a singleton instance
env_manager = EnvManager()