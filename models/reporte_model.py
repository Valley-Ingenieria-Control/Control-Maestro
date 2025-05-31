from sqlalchemy import Column, Integer, String, Date, Numeric, Text  # ← Asegúrate que 'Text' esté aquí
from database import Base

class ReporteDiario(Base):
    __tablename__ = "daily_reports"
    id = Column(Integer, primary_key=True, index=True)
    proyecto = Column(Text)
    supervisor = Column(Text)
    usuario_rut = Column(Text)
    fecha = Column(Date)
    clima = Column(Text)
    trabajador_nombre = Column(Text)
    trabajador_especialidad = Column(Text)
    area = Column(Text)
    tarea = Column(Text)
    hh = Column(Integer)
    tag = Column(Text)
    unidad = Column(Text)
    cantidad = Column(Text)
    comentarios = Column(Text)
    trabajador_rut = Column(Text)
    actividad = Column(Text)
    tipo_tarea = Column(Text)
    firma = Column(Text)