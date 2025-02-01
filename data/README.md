# Data Processing Pipeline

## Components
- `raw/`: Original Quran and Hadith data
- `processed/`: Combined datasets
- `src/`: Processing scripts and RAG implementation

## Usage
1. Collect Quran data: `python -m src.collectors.quran_data`
2. Process data: `python -m src.processors.combine_data`
3. Query data: `python -m tests.test_rag`