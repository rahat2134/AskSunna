# backend/setup.py
from setuptools import setup, find_packages
from pathlib import Path
import shutil
import os

# Get the absolute path to the root directory (one level up from setup.py)
root_dir = Path(__file__).parent.parent

# Create data directories in backend if they don't exist
data_dir = Path(__file__).parent / 'data'
processed_dir = data_dir / 'processed'
raw_dir = data_dir / 'raw'

processed_dir.mkdir(parents=True, exist_ok=True)
raw_dir.mkdir(parents=True, exist_ok=True)

# Copy data files from root data directory to backend/data
try:
    shutil.copy2(root_dir / 'data' / 'processed' / 'islamic_data.json', processed_dir)
    shutil.copy2(root_dir / 'data' / 'raw' / 'hadiths.json', raw_dir)
    shutil.copy2(root_dir / 'data' / 'raw' / 'quran.json', raw_dir)
except Exception as e:
    print(f"Warning: Error copying data files: {e}")

setup(
    name="asksunna",
    version="1.0.0",
    packages=find_packages(),
    include_package_data=True,
    package_data={
        '': [
            'data/processed/*.json',
            'data/raw/*.json',
        ]
    }
)