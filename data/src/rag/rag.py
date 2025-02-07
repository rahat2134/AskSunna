import json
import lancedb
import pyarrow as pa
import numpy as np
import os
import logging
import time
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import Dict, List, Optional, Tuple
from pathlib import Path
from ..models.base import BaseLLM
from ..models.gemini import GeminiLLM

logger = logging.getLogger(__name__)

class IslamicRAG:
    def __init__(self, 
                 data_path: str = str(Path(__file__).parents[2] / "processed" / "islamic_data.json"),
                 db_path: str = str(Path(__file__).parents[3] / "islamic_db"),
                 database_dir: str = None,
                 llm: Optional[BaseLLM] = None):

        self.model = SentenceTransformer("all-mpnet-base-v2")
        
        # Determine database path with priority order:
        # 1. Environment variable
        # 2. Provided database_dir
        # 3. Default db_path
        db_path = (
            os.getenv('LANCEDB_CONFIG_DIR') or 
            database_dir or 
            db_path
        )

        # Ensure directory exists
        os.makedirs(db_path, exist_ok=True)

        # Try to set permissions if possible (might fail in some environments)
        try:
            os.chmod(db_path, 0o777)  # Full permissions
        except Exception as e:
            logger.warning(f"Could not set permissions for {db_path}: {str(e)}")

        logger.info(f"Using database path: {db_path}")
        self.db = lancedb.connect(db_path)
        self.vector_dim = 768
        self.llm = llm if llm is not None else GeminiLLM()
        self.setup_database(data_path)
    
    def determine_type(self, source: str) -> str:
        return "quran" if "Quran" in source else "hadith"
    
    def setup_database(self, data_path: str):
        """Initialize the database with proper vector column"""
        # Load data
        print("Loading data...")
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("Preparing embeddings...")
        documents = []
        for item in data:
            # Get text for embedding (prefer translation if available)
            text_for_embedding = item.get('translation', item['text'])
            
            # Create embedding with correct type
            vector = self.model.encode(text_for_embedding)
            vector = vector.astype(np.float32).tolist()
            
            # Create document with all necessary fields
            doc = {
                'text': item['text'],
                'translation': item.get('translation', ''),
                'source': item['source'],
                'type': self.determine_type(item['source']),
                'vector': vector
            }
            documents.append(doc)
        
        print("Setting up database...")
        # Create or recreate the table
        if "hadith_quran" in self.db.table_names():
            print("Removing existing table...")
            self.db.drop_table("hadith_quran")

        # Create schema with fixed-length vector
        schema = pa.schema([
            pa.field('text', pa.string()),
            pa.field('translation', pa.string()),
            pa.field('source', pa.string()),
            pa.field('type', pa.string()),
            pa.field('vector', pa.list_(pa.float32(), self.vector_dim))
        ])
        
        # Create table with vector column
        self.table = self.db.create_table(
            "hadith_quran",
            schema=schema,
            mode="overwrite"
        )
        
        # Insert data
        print("Inserting data...")
        self.table.add(documents)
        print("Database setup complete!")
    
    def search(self, query: str, source_type: str = None, limit: int = 3) -> List[Dict]:
        """Search the database with proper vector column specification"""
        # Encode query with correct type
        query_vector = self.model.encode(query)
        query_vector = query_vector.astype(np.float32).tolist()
        
        # Start search query with explicit vector column
        search_query = self.table.search(query_vector, vector_column_name="vector")
        
        # Add type filter if specified
        if source_type in ['hadith', 'quran']:
            search_query = search_query.where(f"type = '{source_type}'")
        
        # Execute search and get results
        results = search_query.limit(limit).to_pandas()
        
        # Format results
        formatted_results = []
        for _, row in results.iterrows():
            result = {
                'text': row['text'],
                'translation': row['translation'],
                'source': row['source'],
                'type': row['type'],
                'score': float(row['_distance'])
            }
            formatted_results.append(result)
            
        return formatted_results

    async def answer_question(self, query: str, source_type: str = None, limit: int = 3) -> Tuple[str, List[Dict]]:
        """
        Answer a question using RAG and LLM
        Args:
            query: User question
            source_type: Filter by 'hadith' or 'quran'
            limit: Number of sources to retrieve
        Returns:
            Tuple[str, List[Dict]]: Generated answer and retrieved sources
        """
        # Get relevant sources
        sources = self.search(query, source_type, limit)
        
        if not sources:
            return "I cannot provide an answer as I don't have relevant verified sources about this topic in my database.", []

        try:
            # Generate answer using LLM
            answer = await self.llm.generate(query, context=sources)
            return answer, sources
        except Exception as e:
            raise Exception(f"Error generating answer: {str(e)}")