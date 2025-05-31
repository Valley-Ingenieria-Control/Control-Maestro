from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

# Leer la URL de conexión desde el archivo .env
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el engine con SSL (Azure requiere cifrado SSL)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "sslmode": "require"
    }
)

# Sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener sesión en rutas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
