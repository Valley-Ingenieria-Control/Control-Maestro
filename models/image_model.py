from sqlalchemy import Column, Integer, String
from database import Base

class Imagen360(Base):
    __tablename__ = "imagenes_360"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(String, index=True)
    sector = Column(String, index=True)
    url = Column(String)