from setuptools import setup, find_packages

setup(
    name="asksunna",
    version="1.0.0",
    packages=find_packages(include=['data', 'data.*']),
    package_data={
        'data': ['processed/*.json', 'raw/*.json'],
    },
    include_package_data=True,
)