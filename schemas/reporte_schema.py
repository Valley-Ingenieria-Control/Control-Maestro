from pydantic import BaseModel
from datetime import date
from typing import Optional

class ReporteBase(BaseModel):
    proyecto: Optional[str]
    supervisor: Optional[str]
    usuario_rut: Optional[str]
    fecha: Optional[date]
    clima: Optional[str]
    trabajador_nombre: Optional[str]
    trabajador_especialidad: Optional[str]
    area: Optional[str]
    tarea: Optional[str]
    hh: Optional[int]
    tag: Optional[str]
    unidad: Optional[str]
    cantidad: Optional[str]
    comentarios: Optional[str]
    trabajador_rut: Optional[str]
    actividad: Optional[str]
    tipo_tarea: Optional[str]
    firma: Optional[str]

class ReporteCreate(ReporteBase):
    pass

class ReporteOut(ReporteBase):
    id: int

    class Config:
        from_attributes = True
