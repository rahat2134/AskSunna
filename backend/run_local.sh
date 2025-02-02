#!/bin/bash

# Get the absolute path of the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Set environment variables
export PYTHONPATH=$PROJECT_ROOT
export LANCEDB_CONFIG_DIR=./islamic_db

# Create lancedb directory if it doesn't exist
mkdir -p ./islamic_db

# Check if GOOGLE_API_KEY is set
if [ -z "$GOOGLE_API_KEY" ]; then
    if [ -f "$PROJECT_ROOT/.env" ]; then
        source "$PROJECT_ROOT/.env"
    else
        echo "Error: GOOGLE_API_KEY not set and .env file not found"
        exit 1
    fi
fi

# Start the server
cd "$(dirname "${BASH_SOURCE[0]}")"  # Change to backend directory
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload