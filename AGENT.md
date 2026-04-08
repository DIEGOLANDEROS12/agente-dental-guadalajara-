# Agente Virtual Dental — Guadalajara

Proyecto de automatización para clínicas dentales en Guadalajara.
Crea asistentes virtuales de WhatsApp/Instagram que agendan citas, guardan memoria de pacientes y responden como humanos reales.

---

## Stack Técnico

- **n8n Cloud** — automatización (diegolanderos.app.n8n.cloud)
- **OpenAI GPT-4o** — inteligencia del agente
- **Twilio WhatsApp Sandbox** — recepción y envío de mensajes
- **Google Sheets** — memoria de pacientes y CRM
- **Google Calendar** — agenda de citas
- **GitHub Pages** — página web de la clínica

---

## Archivos del Proyecto

| Archivo | Descripción |
|---|---|
| `03_agente_virtual_n8n.json` | Workflow demo — ProClinic Dental (agente Sofia) |
| `04_recordatorios_n8n.json` | Workflow recordatorios 24h/2h antes de cita |
| `06_marcela_smile_design.json` | Workflow producción — Smile Design Studio (agente Marcela) |
| `index.html` | Página web clínica (branch: claude/dental-clinic-website-1qm9s) |
| `styles.css` | Estilos página web |
| `script.js` | JavaScript página web |
| `01_50_negocios_opening_lines.md` | 50 negocios dentales/faciales con opening lines para prospección |
| `02_estrategia_cierre_clientes.md` | Estrategia de ventas y manejo de objeciones |
| `05_instrucciones_configuracion.md` | Guía paso a paso de configuración n8n |

---

## Arquitectura del Workflow (06_marcela_smile_design.json)

```
Twilio WhatsApp
      ↓
Webhook (POST /smile-design)
      ↓
Normalizar Mensaje  ← detecta Twilio / Meta WA / Meta IG / test
      ↓
Obtener Memoria del Paciente  ← Google Sheets tab: Conversaciones
      ↓
Construir Contexto  ← arma historial + datos del paciente
      ↓
Marcela — Agente IA  ← GPT-4o con prompt de Smile Design Studio
      ↓
Hay que agendar? (IF node)
  ├── TRUE → Parsear Datos de Cita
  │             ↓
  │          Crear Cita en Google Calendar
  │             ↓
  │          Registrar Cita en Hoja Citas (Sheets)
  │             ↓
  └── FALSE → Preparar Actualizacion de Memoria
                ↓
             Guardar Memoria en Sheets (appendOrUpdate)
                ↓
             Preparar Respuesta
                ↓
             Responder Webhook (Twilio node → envía WA)
```

---

## Google Sheets

**URL:** https://docs.google.com/spreadsheets/d/10D2JPQEAkqazj64_LPYvsYNomxdDzcayQZefyHtnwoA/edit

### Tab: Conversaciones
Columnas: `sender_id | name | channel | phone | conversation_history | last_message | last_message_date | last_service | last_appointment | appointment_count | preferences | updated_at`

### Tab: Citas
Columnas: `fecha_agendamiento | paciente | servicio | fecha_cita | telefono | canal | calendar_event_id | estado | recordatorio_enviado`

---

## Credenciales Necesarias en n8n

| Credencial | Nodos que la usan |
|---|---|
| Google Sheets OAuth2 | Obtener Memoria, Registrar Cita, Guardar Memoria |
| Google Calendar OAuth2 | Crear Cita en Google Calendar |
| OpenAI API | Marcela — Agente IA |
| Twilio | Responder Webhook |

---

## Webhook URLs

| Workflow | Path | URL producción |
|---|---|---|
| ProClinic Demo | `agente-dental` | `https://diegolanderos.app.n8n.cloud/webhook/agente-dental` |
| Smile Design (Marcela) | `smile-design` | `https://diegolanderos.app.n8n.cloud/webhook/smile-design` |

**Twilio Sandbox Settings → "WHEN A MESSAGE COMES IN"** debe apuntar al URL del workflow activo.

---

## Agente Marcela — Personalidad

- Asistente de **Smile Design Studio Guadalajara**
- Calle Libertad 1814, Col. Providencia, Guadalajara
- Conversación natural tipo WhatsApp — NO robótica
- NO dice "Hola" en cada mensaje
- Recuerda contexto del paciente entre mensajes
- Al tener todos los datos escribe: `AGENDAR_CITA:[nombre]|[servicio]|[DD/MM/YYYY HH:mm]|[telefono]`

---

## Errors Comunes y Fixes

| Error | Causa | Fix |
|---|---|---|
| `caseSensitive undefined` en Switch | Switch typeVersion 3 bug | Usar IF node typeVersion 1 |
| `Sheet with name X not found` | Tab mal nombrada en Sheets | Renombrar tab o usar "From List" |
| `Column to Match On required` | Schema vacío en appendOrUpdate | Precargar schema[] en JSON |
| `Always Output Data` no funciona | Paciente nuevo sin fila en Sheets | `"alwaysOutputData": true` + `"onError": "continueRegularOutput"` en nodo |
| WhatsApp sin respuesta | Timeout Twilio 15s con TwiML | Usar Twilio node al final (async) |
| `Unused Respond to Webhook` | Webhook en "Immediately" con nodo Responder | Cambiar a "Using Respond to Webhook Node" o eliminar nodo |

---

## Comandos Git

```bash
# Branch de desarrollo
git checkout claude/virtual-assistant-whatsapp-instagram-a7MJc

# Push cambios
git push -u origin claude/virtual-assistant-whatsapp-instagram-a7MJc
```

---

## Página Web

**URL:** https://diegolanderos12.github.io/agente-dental-guadalajara-/

**Branch:** `claude/dental-clinic-website-1qm9s`

Actualmente configurada para: **Clínica Dental Río Nilo — Dr. Josue**

---

## Costos Mensuales Estimados

| Escenario | Costo/mes |
|---|---|
| Solo chatbot WhatsApp | $41–56 USD |
| Chatbot + página web | $60–80 USD |
| Todo completo con voz | $120–200 USD |

Servicios: n8n ($20) + OpenAI (~$30) + Google Workspace ($6) + Twilio (~$15)
