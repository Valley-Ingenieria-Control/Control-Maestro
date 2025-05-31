from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.email_log_model import EmailLog

router = APIRouter()

@router.get("/email_logs")
def get_logs(db: Session = Depends(get_db)):
    return db.query(EmailLog).order_by(EmailLog.fecha_envio.desc()).all()
