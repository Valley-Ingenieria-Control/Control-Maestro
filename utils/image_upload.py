import shutil
from fastapi import UploadFile
import os

UPLOAD_DIR = "static/uploads"

def save_image(file: UploadFile) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return f"/{file_path}"
