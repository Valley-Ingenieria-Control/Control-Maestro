from fastapi import APIRouter, UploadFile, File, Form, Query, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import shutil
import os
import time

from database import get_db
from models.image_model import Imagen360

router = APIRouter(prefix="/imagenes360")

# Carpeta donde se almacenan las imágenes
IMAGES_FOLDER = "static/images"
os.makedirs(IMAGES_FOLDER, exist_ok=True)

@router.post("/")
async def subir_imagen(
    fecha: str = Form(...),
    sector: str = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Validar formato del archivo
        if not archivo.filename.lower().endswith((".jpg", ".jpeg")):
            return JSONResponse(status_code=400, content={"error": "Solo se permiten imágenes .jpg o .jpeg"})

        # Crear nombre único de archivo
        timestamp = int(time.time())
        filename_clean = archivo.filename.replace(" ", "_")
        nombre_archivo = f"{fecha}_{sector.replace(' ', '_')}_{timestamp}_{filename_clean}"
        ruta_destino = os.path.join(IMAGES_FOLDER, nombre_archivo)

        # Guardar archivo
        with open(ruta_destino, "wb") as buffer:
            shutil.copyfileobj(archivo.file, buffer)

        # Ruta relativa para el visor
        url_relativa = f"/images/{nombre_archivo}"

        # Registrar en BD
        nueva_imagen = Imagen360(fecha=fecha, sector=sector, url=url_relativa)
        db.add(nueva_imagen)
        db.commit()

        return {"mensaje": "Imagen subida y registrada", "url": url_relativa}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/")
def obtener_imagen(fecha: str = Query(...), sector: str = Query(...), db: Session = Depends(get_db)):
    imagen = db.query(Imagen360).filter_by(fecha=fecha, sector=sector).order_by(Imagen360.id.desc()).first()
    if imagen:
        return {"ruta_imagen": imagen.url}
    else:
        return JSONResponse(status_code=404, content={"error": "Imagen no encontrada"})
