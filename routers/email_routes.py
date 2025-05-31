from fastapi import APIRouter, File, UploadFile, Form, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.email_log_model import EmailLog
import smtplib
from email.message import EmailMessage
import os

router = APIRouter()

@router.post("/send_excel")
async def send_excel(file: UploadFile = File(...), email: str = Form(...), db: Session = Depends(get_db)):
    contents = await file.read()

    msg = EmailMessage()
    msg["Subject"] = "Reporte Diario Exportado"
    msg["From"] = "tureporte@virtualvalley.cl"
    msg["To"] = email
    msg.set_content("Adjunto se encuentra el archivo Excel exportado desde el sistema.")
    msg.add_attachment(contents, maintype="application", subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=file.filename)

    resultado = "OK"
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login(os.environ["EMAIL_USER"], os.environ["EMAIL_PASS"])
            smtp.send_message(msg)
    except Exception as e:
        resultado = f"ERROR: {str(e)}"

    # Guardar log en la base de datos
    db_log = EmailLog(
        destinatario=email,
        archivo_enviado=file.filename,
        resultado=resultado
    )
    db.add(db_log)
    db.commit()

    if resultado != "OK":
        return {"status": "error", "message": resultado}

    return {"status": "ok", "message": f"Archivo enviado a {email}"}
