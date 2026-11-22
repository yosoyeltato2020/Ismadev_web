ISMADEV SOLUTIONS — VERSIÓN INTEGRADA V2
=========================================

INCLUYE
- Página web completa en HTML/CSS/JS, navegación responsive, FAQ, precios,
  factura interactiva, contacto, sección de demostraciones pendientes.
- Escena WebGL tridimensional con Three.js (28 segundos), con dispositivos,
  edificios, farolas y movimiento de cámara.
- Vídeo de avance MP4 (24 segundos, 2.5D), NO anuncio definitivo.
- Formulario con endpoint SMTP en Flask, pendiente de credenciales reales.
- Página legal con marcadores pendientes, NO publicable sin completar.

EJECUCIÓN SENCILLA (formulario ofrece mailto):
  python3 -m http.server 8000
  Navegar a http://localhost:8000

EJECUCIÓN CON ENVÍO REAL DE FORMULARIO:
  python3 -m pip install -r requirements.txt
  export SMTP_HOST='servidor-smtp-real'
  export SMTP_PORT='465'
  export SMTP_USER='cuenta-real'
  export SMTP_PASSWORD='contraseña-de-aplicación'
  export SMTP_FROM='cuenta-real'
  export CONTACT_TO='ilopez.infor@hotmail.com'
  python3 server.py
  Navegar a http://localhost:8000

IMPORTANTE ANTES DE PUBLICAR:
- No subir claves SMTP al repositorio ni al código JavaScript.
- WhatsApp configurado con el número facilitado: +34 638 315 035.
  Los botones abren una conversación con mensaje predefinido según la tarifa.
- Completar responsable, NIF, domicilio y privacidad en legal.html.
- Implementar protección anti-spam y límites de envío en el backend.
- Definir por contrato los servicios incluidos en cada tarifa.
- Crear las 3 demos cuando se decida esa fase.
- Producir el anuncio final 3D de 60 segundos con locución y música;
  no se afirma que el vídeo 2.5D incluido sea el anuncio final.
- Se requiere Internet para cargar Three.js y GSAP.
