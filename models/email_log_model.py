from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base

class EmailLog(Base):
    __tablename__ = "email_log"

    id = Column(Integer, primary_key=True, index=True)
    destinatario = Column(String, nullable=False)
    archivo_enviado = Column(String, nullable=True)
    resultado = Column(Text)
    fecha_envio = Column(DateTime(timezone=True), server_default=func.now())
