from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parents[2]
sys.path.append(str(project_root))

from data.src.rag.rag import IslamicRAG
from data.src.config.env_manager import env_manager

# Initialize FastAPI app with metadata
app = FastAPI(
    title="AskSunna API",
    description="Islamic Q&A Platform powered by RAG and LLM.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:4173,https://asksunna.netlify.app"
).split(",")

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG system
rag = IslamicRAG()

# Request/Response Models
class QuestionRequest(BaseModel):
    question: str
    source_type: Optional[str] = None  # 'hadith' or 'quran'
    sect: Optional[str] = None  # 'sunni' or 'shia'

    model_config = {
        "json_schema_extra": {
            "example": {
                "question": "What does Islam say about intentions?",
                "source_type": "hadith",
                "sect": "sunni"
            }
        }
    }

class Source(BaseModel):
    text: str
    translation: Optional[str]
    source: str
    type: str
    score: float

class AnswerResponse(BaseModel):
    answer: str
    sources: List[Source]

@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to docs"""
    return RedirectResponse(url="/docs")

@app.post("/api/v1/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """
    Ask a question and get an answer with relevant sources.
    
    - **question**: Your Islamic question
    - **source_type**: Filter by 'hadith' or 'quran' (optional)
    - **sect**: Filter by 'sunni' or 'shia' (optional)
    """
    try:
        # Validate source_type
        if request.source_type and request.source_type not in ['hadith', 'quran']:
            raise HTTPException(
                status_code=400,
                detail="source_type must be either 'hadith', 'quran', or null"
            )
            
        answer, sources = await rag.answer_question(
            query=request.question,
            source_type=request.source_type
        )
        return AnswerResponse(answer=answer, sources=sources)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    """Check API health status"""
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)