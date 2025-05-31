from database import Base, engine
from models.image_model import Imagen360
from models.reporte_model import ReporteDiario  # <- Esto es CLAVE

print("⏳ Creando tablas en la base de datos...")

Base.metadata.create_all(bind=engine)

print("Tablas detectadas:", Base.metadata.tables.keys())
print("✅ Tablas creadas correctamente.")
