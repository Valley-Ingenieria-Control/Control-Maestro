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
from routers import dashboard_routes

app = FastAPI()

# ✅ Dominios permitidos para CORS
allowed_origins = [
    "http://localhost:3000",  # entorno local de desarrollo
    "https://virtualvalley-backend-fsenhqcylxhbdpha.chilecentral-01.azurewebsites.net",  # backend Azure
]

# ✅ Middleware CORS configurado
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ruta raíz para confirmar estado API
@app.get("/")
def read_root():
    return {"status": "API de Virtual Valley corriendo"}

# ✅ Montaje de carpeta estática de imágenes
app.mount("/images", StaticFiles(directory="static/images"), name="images")

# ✅ Ruta explícita para servir imágenes
@app.get("/images/{filename}")
def serve_image(filename: str):
    file_path = os.path.join("static", "images", filename)
    if not os.path.exists(file_path):
        return {"error": "Archivo no encontrado"}
    
    return FileResponse(
        path=file_path,
        media_type="image/jpeg",
        headers={
            "Access-Control-Allow-Origin": "*",  # puedes hacer esto más restrictivo si lo deseas
            "Access-Control-Allow-Credentials": "true"
        }
    )

# ✅ Registro de rutas de negocio
app.include_router(imagenes360_routes.router)
app.include_router(reporte_routes.router)
app.include_router(email_routes.router)
app.include_router(email_log_routes.router)
app.include_router(dashboard_routes.router)
