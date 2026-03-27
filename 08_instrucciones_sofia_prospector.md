# Sofia — Agente Prospectora IA
## Guía de Configuración Completa (Twilio + n8n + Google Calendar + Google Sheets)

---

## ¿QUÉ HACE SOFIA?

Sofia es un bot que **contacta proactivamente** clínicas dentales por WhatsApp usando el script de ventas de tu agencia de IA. Su flujo:

1. **Cada día hábil a las 9am** lee 30 prospectos nuevos de Google Sheets
2. **Envía el mensaje de apertura** (A o B alternados) vía Twilio
3. **Cuando el prospecto responde**, el bot inbound toma el control
4. **Sigue el script** de manera natural, etapa por etapa
5. **Agenda la demo** en Google Calendar automáticamente
6. **Registra todo** en Google Sheets (pipeline completo)

---

## ARCHIVOS A IMPORTAR EN n8n

| Archivo | Propósito |
|---|---|
| `07_sofia_agente_prospector.json` | Bot inbound — responde a los prospectos |
| `07_sofia_outbound_trigger.json` | Trigger diario — envía 30 mensajes iniciales |

---

## PASO 1 — GOOGLE SHEETS

Crear un Google Sheet con **3 hojas**:

### Hoja 1: `Prospectos`
Estas son las columnas necesarias (copiar exactamente):

| Columna | Descripción |
|---|---|
| `sender_id` | Teléfono del contacto (ej: `+5213312345678`) |
| `business_name` | Nombre de la clínica dental |
| `contact_name` | Nombre del dueño o contacto |
| `phone` | Mismo número que sender_id |
| `status` | `pendiente` → `contactado` → `en_conversacion` → `demo_confirmada` |
| `conversation_stage` | Etapa del script (ver abajo) |
| `conversation_history` | JSON del historial (lo gestiona el bot) |
| `last_message` | Último mensaje recibido |
| `last_message_date` | Fecha del último mensaje |
| `demo_date` | Fecha y hora de la demo agendada |
| `demo_calendar_id` | ID del evento en Google Calendar |
| `opening_used` | `A` o `B` |
| `notes` | Notas del bot o manuales |
| `created_at` | Fecha de creación del lead |
| `updated_at` | Última actualización |

**Etapas válidas para `conversation_stage`:**
- `pendiente` → Sin contactar aún
- `esperando_respuesta_inicial` → Se envió el primer mensaje
- `en_conversacion` → Respondió, conversación activa
- `propuesta_hecha` → Se propuso la demo
- `horario_propuesto` → Se ofreció horario específico
- `demo_confirmada` → Demo agendada con éxito
- `no_interesado` → Descartado amablemente
- `error_envio` → Error de Twilio al enviar

### Hoja 2: `Demos`
Registra todas las demos confirmadas:

| Columna | Descripción |
|---|---|
| `fecha_agendamiento` | Cuándo se agendó |
| `negocio` | Nombre de la clínica |
| `contacto` | Nombre del contacto |
| `telefono` | Teléfono |
| `fecha_demo` | Fecha y hora de la demo |
| `calendar_event_id` | ID del evento en Google Calendar |
| `zoom_link` | Enlace de Zoom (llenar manualmente) |
| `estado` | `Confirmada`, `Realizada`, `Cancelada` |

### Hoja 3: `Lista Negocios` (opcional, para llenar Prospectos)
Usa esta hoja para preparar los leads antes de pasarlos a `Prospectos`.

---

## PASO 2 — TWILIO

### Configurar WhatsApp en Twilio:
1. Ir a [console.twilio.com](https://console.twilio.com)
2. **Messaging → Senders → WhatsApp Senders**
3. Para pruebas: activar **WhatsApp Sandbox**
4. Para producción: solicitar número dedicado de WhatsApp

### Datos que necesitas de Twilio:
| Dato | Dónde encontrarlo |
|---|---|
| **Account SID** | Dashboard principal de Twilio |
| **Auth Token** | Dashboard principal (oculto, click para ver) |
| **Número WhatsApp** | Formato: `+14155238886` (sandbox) o tu número aprobado |

### Configurar el Webhook de Twilio (para recibir respuestas):
1. En Twilio → **Messaging → Settings → WhatsApp Sandbox** (o tu número)
2. En "When a message comes in": poner la URL del webhook de n8n:
   ```
   https://TU-N8N.com/webhook/sofia-prospector
   ```
3. Método: **HTTP POST**

### ⚠️ IMPORTANTE: Mensajes Outbound en Producción
- En el **Sandbox** de Twilio puedes enviar mensajes libremente (solo a números que hayan enviado el código de sandbox)
- En **Producción** con número real, los mensajes outbound fuera de sesión de 24h requieren **plantillas aprobadas por WhatsApp**
- Deberás crear una plantilla en Twilio para el primer mensaje de Sofia y esperar aprobación (~24-48h)

---

## PASO 3 — CREDENCIALES EN n8n

### 3.1 Google Sheets OAuth2:
1. n8n → **Credentials** → **New** → `Google Sheets OAuth2`
2. Seguir el flujo de autorización de Google
3. Copiar el **ID** de la credencial creada

### 3.2 Google Calendar OAuth2:
1. n8n → **Credentials** → **New** → `Google Calendar OAuth2`
2. Seguir el flujo de autorización
3. Copiar el **ID** de la credencial creada

### 3.3 OpenAI API:
1. n8n → **Credentials** → **New** → `OpenAI`
2. Pegar tu API Key de [platform.openai.com](https://platform.openai.com)

### 3.4 Twilio Basic Auth (para HTTP Request):
1. n8n → **Credentials** → **New** → `HTTP Basic Auth`
2. **User**: tu `TWILIO_ACCOUNT_SID`
3. **Password**: tu `TWILIO_AUTH_TOKEN`

---

## PASO 4 — VARIABLES DE ENTORNO EN n8n

En n8n, crear estas **Variables** (Settings → Variables):

| Variable | Valor |
|---|---|
| `TWILIO_ACCOUNT_SID` | Tu Account SID de Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Tu número de WhatsApp (ej: `+14155238886`) |

---

## PASO 5 — CONFIGURAR LOS WORKFLOWS

### En `07_sofia_agente_prospector.json`:
Reemplazar todos los valores `PONER_TU_CREDENTIAL_ID` y `REEMPLAZAR_CON_URL_DE_TU_GOOGLE_SHEET`:

| Nodo | Qué cambiar |
|---|---|
| `Obtener Prospecto` | Credential ID de Google Sheets + URL de tu Sheet |
| `Sofia — Agente IA` | Credential ID de OpenAI |
| `Crear Demo en Google Calendar` | Credential ID de Google Calendar |
| `Registrar Demo en Sheets` | Credential ID de Google Sheets + URL de tu Sheet |
| `Guardar Prospecto en Sheets` | Credential ID de Google Sheets + URL de tu Sheet |

### En `07_sofia_outbound_trigger.json`:
| Nodo | Qué cambiar |
|---|---|
| `Leer Prospectos Pendientes` | Credential ID de Google Sheets + URL de tu Sheet |
| `Enviar WhatsApp via Twilio` | Credential ID de Twilio Basic Auth |
| `Actualizar Estado en Sheets` | Credential ID de Google Sheets + URL de tu Sheet |

---

## PASO 6 — CARGAR TUS PROSPECTOS

En la hoja `Prospectos` de Google Sheets, agrega manualmente los negocios que quieres contactar:

```
sender_id      | business_name           | contact_name    | phone          | status    | created_at
+5213312345678 | Dental Sonrisa Plus     | Dr. Carlos Ruiz | +5213312345678 | pendiente | 2026-03-27
+5213387654321 | Clínica OdontoVida      | Dra. Ana Torres | +5213387654321 | pendiente | 2026-03-27
```

**Formato del teléfono**: siempre con código de país, sin espacios ni guiones.
- México: `+521` + 10 dígitos (ej: `+5213312345678`)

---

## PASO 7 — ACTIVAR Y PROBAR

### Activar workflows:
1. Importar `07_sofia_agente_prospector.json` → Toggle **Active**
2. Importar `07_sofia_outbound_trigger.json` → Toggle **Active**

### Prueba del bot inbound (sin esperar el trigger):
Enviar un POST manual al webhook con Postman o curl:
```bash
curl -X POST https://TU-N8N.com/webhook/sofia-prospector \
  -d "From=whatsapp:+5213312345678" \
  -d "Body=Hola, ¿qué tratamientos hacen?" \
  -d "ProfileName=Dr. Carlos" \
  -d "MessageSid=SM_test_123"
```

### Prueba del trigger outbound (manual):
En n8n, abrir `07_sofia_outbound_trigger.json` → **Execute Workflow** manualmente.

---

## FLUJO COMPLETO

```
CADA DÍA HÁBIL 9AM
      ↓
Lee hasta 30 prospectos (status=pendiente) de Sheets
      ↓
Para cada uno: selecciona apertura A o B
      ↓
Envía WhatsApp vía Twilio REST API
      ↓
Actualiza status → "contactado", stage → "esperando_respuesta_inicial"
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUANDO EL PROSPECTO RESPONDE
      ↓
Webhook recibe mensaje de Twilio
      ↓
Normalizar mensaje (extrae teléfono, nombre, texto)
      ↓
Buscar prospecto en Google Sheets
      ↓
Construir contexto (etapa actual + historial)
      ↓
Sofia IA genera respuesta (sigue el script según etapa)
      ↓
¿Respuesta contiene DEMO_AGENDADA?
      ├─ SÍ → Parsear datos → Crear evento en Calendar → Log en Sheets Demos
      └─ NO → continúa directo
      ↓
Actualizar prospecto en Sheets (etapa, historial, estado)
      ↓
Limpiar respuesta (quitar marcadores internos)
      ↓
Responder con TwiML (XML para Twilio)
```

---

## ETAPAS DEL SCRIPT

```
APERTURA (outbound)
  "Hey, soy Sofía. Vi tu clínica y me dio curiosidad..."
      ↓
ESPERAR RESPUESTA (esperando_respuesta_inicial)
  Prospecto responde → Sofia presenta la propuesta de valor
      ↓
EN CONVERSACIÓN (en_conversacion)
  "Ayudamos a automatizar citas... ¿Han tenido problemas?"
  Si muestran interés → proponer demo
      ↓
PROPUESTA HECHA (propuesta_hecha)
  "Demo de 20 min, directamente con el dueño... ¿lo agendamos?"
  Si dudan → simular revisión de agenda y proponer horario
      ↓
HORARIO PROPUESTO (horario_propuesto)
  "Tenemos espacio a las 4pm. ¿Te queda bien?"
  Si confirman → marcar DEMO_AGENDADA y cerrar
      ↓
DEMO CONFIRMADA (demo_confirmada) ✅
  Evento creado en Google Calendar
  Registrado en hoja Demos
```

---

## COSTOS ESTIMADOS

| Servicio | Costo aprox./mes |
|---|---|
| n8n Cloud (Starter) | $20 USD |
| OpenAI API (600 conversaciones) | $6-15 USD |
| Twilio WhatsApp (30 msgs/día × 22 días) | ~$15-20 USD |
| Google Workspace | Gratis |
| **TOTAL** | **~$41-55 USD/mes** |

---

## PERSONALIZACIÓN

### Cambiar el horario del trigger outbound:
En el nodo `Trigger Lunes-Viernes 9am`, cambiar la expresión cron:
- 9am: `0 9 * * 1-5`
- 10am: `0 10 * * 1-5`
- 8am y 2pm: `0 8,14 * * 1-5`

### Cambiar cantidad de prospectos por día:
En el nodo `Limitar 30 y Asignar Apertura`, cambiar el `slice(0, 30)` al número deseado.

### Agregar tu nombre de agencia al script:
En el nodo `Sofia — Agente IA`, buscar esta línea en el system prompt:
```
"Somos una agencia especializada en automatización con IA para negocios de salud"
```
Reemplazar con el nombre real de tu agencia cuando quieras revelarlo.

### Personalizar el horario de la demo:
En el nodo `Preparar Mensaje Inicial`, puedes agregar horarios específicos disponibles en el mensaje de apertura (para la etapa de propuesta de horario).
