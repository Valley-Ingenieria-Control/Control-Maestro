from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.reporte_model import ReporteDiario
from schemas.reporte_schema import ReporteCreate, ReporteOut

router = APIRouter(
    prefix="/daily_reports",
    tags=["Reporte Diario"]
)

@router.post("/", response_model=ReporteOut)
def create_reporte(reporte: ReporteCreate, db: Session = Depends(get_db)):
    db_reporte = ReporteDiario(**reporte.dict())
    db.add(db_reporte)
    db.commit()
    db.refresh(db_reporte)
    return db_reporte

@router.get("/", response_model=list[ReporteOut])
def get_reportes(db: Session = Depends(get_db)):
    return db.query(ReporteDiario).all()
