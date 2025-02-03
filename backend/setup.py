# backend/setup.py - Update to include data files
from setuptools import setup, find_packages

setup(
    name="asksunna",
    version="1.0.0",
    packages=find_packages(),
    include_package_data=True,
    package_data={
        'data': [
            'processed/*.json',
            'raw/*.json',
            'src/**/*.py'
        ]
    },
    data_files=[
        ('data/processed', ['data/processed/islamic_data.json']),
        ('data/raw', ['data/raw/hadiths.json', 'data/raw/quran.json'])
    ]
)