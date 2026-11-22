"""Servidor de desarrollo y endpoint SMTP para ISMADEV.
Instalar Flask: python3 -m pip install -r requirements.txt
Variables de entorno: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
SMTP_FROM, CONTACT_TO y opcionalmente SMTP_SSL=1.
No subir contraseñas a repositorios.
"""
import os
import re
import smtplib
import ssl
from email.message import EmailMessage
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

@app.get("/<path:filename>")
def static(filename):
    return send_from_directory(BASE_DIR, filename)

@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()[:120]
    email = str(data.get("email", "")).strip()[:200]
    service = str(data.get("service", "")).strip()[:80]
    message = str(data.get("message", "")).strip()[:3000]
    if not all((name, email, service, message, data.get("privacy"))):
        return jsonify(error="Completa los campos y acepta el tratamiento de datos."), 400
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return jsonify(error="El correo electrónico no es válido."), 400
    host = os.getenv("SMTP_HOST")
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    recipient = os.getenv("CONTACT_TO", "ilopez.infor@hotmail.com")
    sender = os.getenv("SMTP_FROM", user or "")
    if not all((host, user, password, sender)):
        return jsonify(error="El servidor de correo todavía no está configurado."), 503
    mail = EmailMessage()
    mail["Subject"] = "ISMADEV · Consulta: " + service.replace("\r", " ").replace("\n", " ")
    mail["From"] = sender
    mail["To"] = recipient
    mail["Reply-To"] = email
    mail.set_content(f"Nombre: {name}\nEmail: {email}\nServicio: {service}\n\n{message}")
    try:
        port = int(os.getenv("SMTP_PORT", "465"))
        if os.getenv("SMTP_SSL", "1") == "1":
            with smtplib.SMTP_SSL(host, port, timeout=12, context=ssl.create_default_context()) as smtp:
                smtp.login(user, password)
                smtp.send_message(mail)
        else:
            with smtplib.SMTP(host, port, timeout=12) as smtp:
                smtp.starttls(context=ssl.create_default_context())
                smtp.login(user, password)
                smtp.send_message(mail)
    except (smtplib.SMTPException, OSError, ValueError):
        app.logger.exception("Fallo de entrega SMTP")
        return jsonify(error="No se ha podido entregar el mensaje."), 502
    return jsonify(ok=True)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
