@echo off
if not exist public\image-cache (
    mkdir public\image-cache
)
if not exist public\image-result-cache (
    mkdir public\image-result-cache
)
if not exist public\pdf-cache (
    mkdir public\pdf-cache
)
if not exist public\watermark-cache (
    mkdir public\watermark-cache
)
if not exist utility-tools-env (
    python -m venv utility-tools-env
)
call utility-tools-env\Scripts\activate.bat
pip install -r requirements.txt
npm install