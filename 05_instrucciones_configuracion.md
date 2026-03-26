# Instrucciones de Configuración — Agente Virtual Sofia

## ESTRUCTURA DE ARCHIVOS

```
01_50_negocios_opening_lines.md     → Lista de 50 prospectos con mensajes personalizados
02_estrategia_cierre_clientes.md    → Estrategia de venta y manejo de objeciones
03_agente_virtual_n8n.json          → Workflow principal del agente (importar en n8n)
04_recordatorios_n8n.json           → Workflow de recordatorios y reseñas (importar en n8n)
05_instrucciones_configuracion.md   → Este archivo
```

---

## PASO 1 — PREREQUISITOS

### Cuentas necesarias:
- [ ] **n8n** — Self-hosted o n8n.cloud (recomendado: self-hosted en VPS $5/mes)
- [ ] **WhatsApp Business API** — vía Meta for Developers (gratis hasta 1,000 conversaciones/mes)
- [ ] **Instagram Graph API** — vinculada a cuenta Business de Instagram
- [ ] **OpenAI API** — gpt-4o (~$0.01-0.05 por conversación)
- [ ] **Google Workspace** — Google Calendar + Google Sheets (gratis con cuenta Google)

---

## PASO 2 — CONFIGURAR GOOGLE SHEETS (Base de Datos)

Crear un Google Sheet con 2 hojas:

### Hoja 1: `Conversaciones`
| Columna | Descripción |
|---|---|
| `sender_id` | ID único del usuario (número WA o ID de Instagram) |
| `name` | Nombre del paciente |
| `channel` | `whatsapp` o `instagram` |
| `phone` | Teléfono de contacto |
| `conversation_history` | JSON con últimos 10 mensajes |
| `last_message` | Último mensaje recibido |
| `last_message_date` | Fecha del último mensaje |
| `last_service` | Último servicio solicitado |
| `last_appointment` | Fecha de última cita |
| `appointment_count` | Total de citas agendadas |
| `preferences` | Notas sobre preferencias del paciente |
| `updated_at` | Última actualización |

### Hoja 2: `Citas`
| Columna | Descripción |
|---|---|
| `fecha_agendamiento` | Cuándo se agendó |
| `paciente` | Nombre del paciente |
| `servicio` | Servicio solicitado |
| `fecha_cita` | Fecha y hora de la cita |
| `telefono` | Teléfono del paciente |
| `canal` | Canal de contacto |
| `calendar_event_id` | ID del evento en Google Calendar |
| `estado` | `Confirmada`, `Cancelada`, `Completada` |
| `recordatorio_enviado` | `No`, `24h`, `2h`, `review` |

---

## PASO 3 — CONFIGURAR META (WhatsApp + Instagram)

### WhatsApp Business API:
1. Ir a [developers.facebook.com](https://developers.facebook.com)
2. Crear app → Business → WhatsApp
3. Agregar número de teléfono de la clínica
4. En **Webhooks**: configurar URL de n8n: `https://TU-N8N.com/webhook/whatsapp-webhook-dental`
5. Suscribirse a: `messages`, `message_deliveries`
6. Copiar: **Phone Number ID** y **Access Token**

### Instagram DM API:
1. Mismo app de Meta
2. Agregar producto: Instagram
3. Conectar cuenta de Instagram Business
4. En **Webhooks**: URL: `https://TU-N8N.com/webhook/instagram-webhook-dental`
5. Suscribirse a: `messages`
6. Copiar: **Page ID** y **Access Token**

---

## PASO 4 — IMPORTAR WORKFLOWS EN n8n

1. Abrir n8n → **Workflows** → **Import from file**
2. Importar `03_agente_virtual_n8n.json`
3. Importar `04_recordatorios_n8n.json`

### Reemplazar todos los valores `YOUR_*`:

En **03_agente_virtual_n8n.json** y **04_recordatorios_n8n.json**:

| Placeholder | Valor real |
|---|---|
| `YOUR_GOOGLE_SHEET_ID` | ID del Google Sheet (de la URL) |
| `YOUR_GOOGLE_SHEETS_CREDENTIAL_ID` | ID de credencial en n8n |
| `YOUR_GOOGLE_CALENDAR_CREDENTIAL_ID` | ID de credencial de Calendar en n8n |
| `YOUR_WHATSAPP_CREDENTIAL_ID` | ID de credencial de WhatsApp en n8n |
| `YOUR_WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID de Meta |
| `YOUR_INSTAGRAM_CREDENTIAL_ID` | ID de credencial de Instagram en n8n |
| `YOUR_OPENAI_CREDENTIAL_ID` | ID de credencial de OpenAI en n8n |

---

## PASO 5 — PERSONALIZAR EL AGENTE (SOFIA)

En el nodo **"Sofia — Agente IA"**, editar el System Prompt:

Reemplazar los placeholders:
```
[NOMBRE_CLINICA]    → Nombre real de la clínica
[DIRECCION]         → Dirección completa
[TELEFONO]          → Teléfono de la clínica
[LISTA_SERVICIOS]   → Ej: "Limpieza dental $500, Ortodoncia desde $8,000..."
[LISTA_PRECIOS]     → Precios actualizados
```

En `04_recordatorios_n8n.json`, nodo **"Construir Mensaje de Recordatorio"**:
```
[NOMBRE_CLINICA]    → Nombre real
[DIRECCION_CLINICA] → Dirección
[LINK_GOOGLE_REVIEWS] → URL de tu perfil de Google Business
```

---

## PASO 6 — CONFIGURAR CREDENCIALES EN n8n

### Google Sheets + Calendar (OAuth2):
1. n8n → **Credentials** → **New** → Google Sheets OAuth2
2. Seguir el flujo de autorización de Google
3. Repetir para Google Calendar

### WhatsApp:
1. n8n → **Credentials** → **New** → WhatsApp Business Cloud API
2. Pegar: Access Token y Phone Number ID de Meta

### OpenAI:
1. n8n → **Credentials** → **New** → OpenAI
2. Pegar API Key de platform.openai.com

---

## PASO 7 — ACTIVAR WORKFLOWS

1. Abrir `03_agente_virtual_n8n.json` → Toggle **Active** (arriba a la derecha)
2. Abrir `04_recordatorios_n8n.json` → Toggle **Active**
3. Copiar la URL del webhook de WhatsApp desde el nodo Trigger
4. Pegar esa URL en Meta for Developers → Webhooks

---

## PASO 8 — PRUEBA END-TO-END

1. Enviar un WhatsApp al número configurado: `"Hola, quiero hacer una cita"`
2. Verificar que:
   - [ ] El agente responde en menos de 5 segundos
   - [ ] Se crea una fila en Google Sheets → Conversaciones
   - [ ] Al dar datos de cita, se crea evento en Google Calendar
   - [ ] Se crea fila en Google Sheets → Citas
   - [ ] El agente confirma la cita con fecha y hora
3. Probar también desde Instagram DM

---

## FLUJO COMPLETO DEL AGENTE

```
CLIENTE ESCRIBE (WA o IG)
         ↓
  Normalizar mensaje
         ↓
  Buscar memoria en Sheets
         ↓
  Construir contexto del paciente
         ↓
  Sofia genera respuesta (GPT-4o)
         ↓
  ¿Quiere agendar? ──YES──→ Parsear datos → Crear en Calendar → Log en Sheets
         ↓                                                              ↓
   Actualizar memoria en Sheets ←──────────────────────────────────────┘
         ↓
  Enviar respuesta por WA o IG
```

```
CADA HORA (automático)
         ↓
  Revisar hoja "Citas" en Sheets
         ↓
  ¿Cita en 24 hrs sin recordatorio? → Enviar recordatorio → Marcar en Sheets
  ¿Cita en 2 hrs sin recordatorio?  → Enviar recordatorio → Marcar en Sheets
  ¿Cita terminó hace 2 hrs?         → Pedir reseña Google → Marcar en Sheets
```

---

## COSTOS ESTIMADOS POR MES

| Servicio | Costo aprox. |
|---|---|
| n8n Cloud (Starter) | $20 USD/mes |
| OpenAI API (200 conversaciones) | $2-5 USD/mes |
| WhatsApp Business API (hasta 1,000 conv.) | Gratis |
| Instagram API | Gratis |
| Google Workspace | Gratis (cuenta personal) |
| **TOTAL** | **~$25 USD/mes** |

---

## PERSONALIZACIÓN AVANZADA

### Agregar más idiomas (inglés para turismo médico):
En el System Prompt agregar:
```
Si el cliente escribe en inglés, responde en inglés.
Si escribe en español, responde en español.
```

### Agregar catálogo de servicios con precios:
Conectar un nodo **Google Sheets** antes de Sofia para cargar precios dinámicamente.

### Escalar a múltiples sucursales:
Agregar campo `sucursal` en el formulario de cita y crear calendarios separados por sucursal en Google Calendar.

### Integrar CRM:
Agregar nodo de HubSpot o Pipedrive después de "Guardar Memoria en Sheets" para sincronizar leads automáticamente.
