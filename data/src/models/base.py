# data/src/models/base.py
from abc import ABC, abstractmethod
from typing import Dict, Optional

class BaseLLM(ABC):
    @abstractmethod
    async def generate(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate response from the model"""
        pass
