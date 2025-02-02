from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
from pathlib import Path
import logging
import traceback
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Starting AskSunna API server...")
logger.info(f"PYTHONPATH: {os.getenv('PYTHONPATH')}")
logger.info(f"Current directory: {os.getcwd()}")

DATA_DIR = os.getenv('DATA_DIR', str(Path(__file__).parents[2] / "data"))
logger.info(f"Using data directory: {DATA_DIR}")

# Add project root to Python path
project_root = Path(__file__).parents[2]
sys.path.append(str(project_root))

from data.src.rag.rag import IslamicRAG
from data.src.config.env_manager import env_manager

# Add startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize on startup
    logger.info("Application startup")
    try:
        global rag_instance
        rag_instance = None  # Don't initialize RAG at startup
        yield
    finally:
        logger.info("Application shutdown")

# Update FastAPI initialization
app = FastAPI(
    title="AskSunna API",
    description="Islamic Q&A Platform powered by RAG and LLM.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan  # Add this
)

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:4173,https://asksunnah.netlify.app"
).split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable for RAG instance
rag_instance = None
rag_initialized = False

def get_rag():
    global rag_instance
    if rag_instance is None:
        try:
            logger.info("Lazy initializing RAG system...")
            data_path = os.path.join(DATA_DIR, "processed", "islamic_data.json")
            logger.info(f"Looking for data at: {data_path}")
            
            if not os.path.exists(data_path):
                logger.error(f"Data file not found at {data_path}")
                available_files = os.listdir(os.path.dirname(data_path))
                logger.info(f"Available files in directory: {available_files}")
                raise FileNotFoundError(f"Data file not found at {data_path}")
                
            for attempt in range(3):
                try:
                    rag_instance = IslamicRAG(
                        data_path=data_path,
                        db_path=os.path.join(os.path.dirname(DATA_DIR), "islamic_db")
                    )
                    logger.info("RAG system initialized successfully!")
                    break
                except Exception as e:
                    if attempt == 2:  # Last attempt
                        raise
                    logger.warning(f"RAG init attempt {attempt + 1} failed: {str(e)}")
                    time.sleep(5)
        except Exception as e:
            logger.error(f"Error initializing RAG system: {str(e)}")
            logger.error(traceback.format_exc())
            raise
    return rag_instance

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
        logger.info(f"Processing question: {request.question}")
        logger.info(f"Source type: {request.source_type}")
        
        # Get or initialize RAG
        rag = get_rag()
        
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
        logger.info("Successfully generated answer")
        return AnswerResponse(answer=answer, sources=sources)
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
async def health_check():
    """Check API health status without initializing RAG"""
    logger.info("Health check called")
    try:
        # Check if data directory exists
        data_dir_exists = os.path.exists(DATA_DIR)
        logger.info(f"Data directory exists: {data_dir_exists}")
        if data_dir_exists:
            files = os.listdir(DATA_DIR)
            logger.info(f"Files in data directory: {files}")
        
        return {
            "status": "healthy",
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "production"),
            "data_dir_exists": data_dir_exists,
            "python_path": os.getenv("PYTHONPATH", "not_set")
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)