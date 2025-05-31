from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.image_model import Image
import shutil
import os

router = APIRouter(prefix="/images")

UPLOAD_DIR = "uploads"

@router.post("/upload/{project_id}")
def upload_image(project_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    os.makedirs(f"{UPLOAD_DIR}/{project_id}", exist_ok=True)
    file_path = f"{UPLOAD_DIR}/{project_id}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_image = Image(filename=file.filename, project_id=project_id)
    db.add(new_image)
    db.commit()
    return {"message": "Uploaded"}

@router.get("/{project_id}")
def get_project_images(project_id: int, db: Session = Depends(get_db)):
    images = db.query(Image).filter(Image.project_id == project_id).all()
    return [{"filename": img.filename, "url": f"/uploads/{project_id}/{img.filename}"} for img in images]
