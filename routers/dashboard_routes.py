from fastapi import APIRouter
import pandas as pd
import os
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard KPIs"]
)

EXCEL_PATH = "excels/input_p6.xlsx"

@router.get("/data")
def get_dashboard_data():
    if not os.path.exists(EXCEL_PATH):
        return {"error": "Archivo Excel no encontrado."}

    try:
        hoja1 = pd.read_excel(EXCEL_PATH, sheet_name=0, header=2)
        hoja2 = pd.read_excel(EXCEL_PATH, sheet_name=1)

        # 🟩 KPI: fechas y HH programadas (Hoja 1)
        fecha_inicio = str(hoja1.columns[3])
        fecha_entrega = str(hoja1.columns[4])
        hh_totales = int(hoja1.iloc[0, 6])

        # 🟩 KPI: HH acumuladas (curva S)
        columnas_hh = hoja1.columns[10:]
        hh_acumuladas = [
            {"fecha": str(col), "hh_acumuladas": float(hoja1[col].sum())}
            for col in columnas_hh if pd.notna(col)
        ]

        hh_ganadas = hh_acumuladas[-1]["hh_acumuladas"] if hh_acumuladas else 0
        avance_pct = round((hh_ganadas / hh_totales) * 100, 2) if hh_totales else 0

        # 🟩 KPI: HH gastadas por especialidad (Hoja 2)
        especialidad_col = hoja2.columns[3]
        semana_cols = hoja2.columns[7:]
        fechas = [str(col) for col in semana_cols]

        hh_especialidad = {
            esp: [0] * len(fechas)
            for esp in ["estructura", "civil", "electrico", "piping", "operadores"]
        }
        hh_gastadas = 0

        for _, row in hoja2.iterrows():
            esp_raw = str(row[especialidad_col]).lower()
            esp_key = (
                "estructura" if "es." in esp_raw else
                "civil" if "ci" in esp_raw else
                "electrico" if "el" in esp_raw else
                "piping" if "pi" in esp_raw else
                "operadores" if "maq" in esp_raw or "op" in esp_raw else
                None
            )
            if esp_key:
                for idx, col in enumerate(semana_cols):
                    val = row[col] if pd.notna(row[col]) else 0
                    hh_especialidad[esp_key][idx] += val
                    hh_gastadas += val

        productividad_fisica = round(hh_ganadas / hh_gastadas, 2) if hh_gastadas else 0

        # 🟩 Actividades próximas y ruta crítica (Hoja 1)
        hoy = datetime.today()
        limite_fecha = hoy + timedelta(days=21)
        actividades_proximas = []
        ruta_critica = []

        for _, row in hoja1.iterrows():
            try:
                actividad = str(row.iloc[3])  # Columna D
                start = pd.to_datetime(row.iloc[4], errors="coerce", dayfirst=True)  # Columna E
                finish = pd.to_datetime(row.iloc[5], errors="coerce", dayfirst=True)  # Columna F
                total_float = row.iloc[8]  # Columna I

                if pd.notna(start) and hoy <= start <= limite_fecha:
                    actividades_proximas.append({
                        "actividad": actividad,
                        "start": str(start.date())
                    })

                if pd.notna(total_float) and total_float == 0:
                    ruta_critica.append({
                        "actividad": actividad,
                        "start": str(start.date()) if pd.notna(start) else "NaT",
                        "finish": str(finish.date()) if pd.notna(finish) else "NaT"
                    })

            except Exception:
                continue

        return {
            "fecha_inicio": fecha_inicio,
            "fecha_entrega": fecha_entrega,
            "hh_totales_programadas": hh_totales,
            "avance_pct": avance_pct,
            "hh_ganadas": hh_ganadas,
            "hh_gastadas": hh_gastadas,
            "productividad_fisica": productividad_fisica,
            "hh_acumuladas": hh_acumuladas,
            "hh_por_especialidad": {
                "fechas": fechas,
                **hh_especialidad
            },
            "actividades_proximas": actividades_proximas,
            "ruta_critica": ruta_critica
        }

    except Exception as e:
        return {"error": f"Error al procesar el Excel: {str(e)}"}

