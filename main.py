from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Routers existentes
from routers import imagenes360_routes
from routers import reporte_routes

# ✅ Nuevos routers
from routers import email_routes
from routers import email_log_routes

# Router input para dashboard
from routers import dashboard_routes

app = FastAPI()

# CORS habilitado para el frontend en localhost:3000
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar carpeta estática para imágenes
app.mount("/images", StaticFiles(directory="static/images"), name="images")

# Ruta de acceso a imágenes con headers explícitos
@app.get("/images/{filename}")
def serve_image(filename: str):
    file_path = os.path.join("static", "images", filename)
    if not os.path.exists(file_path):
        return {"error": "Archivo no encontrado"}
    
    return FileResponse(
        path=file_path,
        media_type="image/jpeg",
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true"
        }
    )

# Routers del sistema
app.include_router(imagenes360_routes.router)
app.include_router(reporte_routes.router)
app.include_router(email_routes.router)         # ✅ Ruta para envío de correo con Excel
app.include_router(email_log_routes.router)     # ✅ Ruta para consultar logs de correos
app.include_router(dashboard_routes.router)     # ✅ Ruta para KPIs desde Excel