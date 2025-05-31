from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.project_model import Project

router = APIRouter(prefix="/projects")

@router.get("/")
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()
