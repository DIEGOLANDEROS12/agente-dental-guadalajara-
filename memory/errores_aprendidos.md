# Errores Aprendidos — Lo que NO volver a hacer

Este archivo se actualiza cada vez que se comete un error para no repetirlo.

---

## n8n — Errores de Nodos

### ❌ ERROR 1: Switch node typeVersion 3 — caseSensitive undefined
**Síntoma:** `Cannot read properties of undefined (reading 'caseSensitive')`
**Causa:** Switch typeVersion 3 tiene un bug al importar condiciones desde JSON
**Fix aplicado:** Reemplazar Switch por **IF node typeVersion 1**
```json
{
  "type": "n8n-nodes-base.if",
  "typeVersion": 1,
  "parameters": {
    "conditions": {
      "string": [{ "value1": "={{ $json.message.content }}", "operation": "contains", "value2": "AGENDAR_CITA:" }]
    }
  }
}
```
**Regla:** NUNCA usar Switch typeVersion 3 para condiciones de texto. Usar IF node.

---

### ❌ ERROR 2: Google Sheets appendOrUpdate — schema vacío = columnas vacías
**Síntoma:** Al importar el workflow, "Values to Send" aparecen vacíos aunque estén en el JSON
**Causa:** `"schema": []` vacío hace que n8n no sepa qué columnas existen
**Fix aplicado:** Precargar `schema[]` con las 12 columnas en el JSON
**Regla:** SIEMPRE incluir schema completo en nodos appendOrUpdate de Sheets

---

### ❌ ERROR 3: Google Sheets — "Sheet with name X not found"
**Síntoma:** `Sheet with name Conversaciones not found`
**Causa:** La pestaña del Google Sheet no se llama exactamente como en el JSON
**Fix:** Cambiar "By Name" → "From List" en el nodo para seleccionar la pestaña real
**Regla permanente:** Las pestañas del Sheet DEBEN llamarse exactamente `Conversaciones` y `Citas`

---

### ❌ ERROR 4: Obtener Memoria — falla con pacientes nuevos
**Síntoma:** El workflow se detiene en "Obtener Memoria" cuando el cliente es nuevo (0 filas)
**Causa:** Sin datos en Sheets, el nodo no pasa nada al siguiente nodo
**Fix aplicado:**
```json
"alwaysOutputData": true,
"onError": "continueRegularOutput"
```
**Regla:** SIEMPRE agregar estos dos en el nodo Obtener Memoria

---

### ❌ ERROR 5: WhatsApp no responde — timeout Twilio con TwiML
**Síntoma:** El workflow corre completo (verde) pero el mensaje no llega a WhatsApp
**Causa:** Twilio espera respuesta TwiML en max 15 segundos. OpenAI + Sheets tarda más
**Fix aplicado:** 
- Webhook → `responseMode: "onReceived"` (responde 200 OK inmediato)
- Último nodo → Twilio node que llama la API de Twilio directamente
**Regla:** NUNCA usar TwiML (Respond to Webhook) para enviar mensajes de WhatsApp con flujos largos. Usar siempre Twilio node async.

---

### ❌ ERROR 6: Webhook URL equivocada en Twilio
**Síntoma:** Mensajes llegan a n8n pero no al workflow correcto
**Causa:** Twilio configurado con URL del workflow anterior (`/agente-dental`) cuando el nuevo usa (`/smile-design`)
**Fix:** Actualizar Sandbox Settings en Twilio con la URL correcta
**Regla:** Cuando se cambia el path del webhook, SIEMPRE actualizar Twilio también

---

### ❌ ERROR 7: Webhook "Unused Respond to Webhook node"
**Síntoma:** `WorkflowConfigurationError: Unused Respond to Webhook node found`
**Causa:** Webhook en modo "Immediately" pero existe un nodo "Respond to Webhook" desconectado
**Fix:** O eliminar el nodo Respond to Webhook, o cambiar Webhook a "Using Respond to Webhook Node"
**Regla:** Estos dos deben ir siempre juntos o separados — nunca mezclarlos

---

### ❌ ERROR 8: Operación incorrecta en Obtener Memoria
**Síntoma:** "Column to Match On required" en el nodo de lectura
**Causa:** El nodo tenía operación "Append or Update Row" en lugar de "Get Rows"
**Fix:** Operación debe ser `getRows` con filtro `sender_id = $json.senderId`
**Regla:** Obtener Memoria = getRows | Guardar Memoria = appendOrUpdate

---

## Credenciales — Errores

### ❌ ERROR 9: Credencial Twilio sin Auth Token
**Síntoma:** `Authorization failed - No password provided`
**Causa:** La credencial Twilio en n8n solo tenía Account SID, sin Auth Token
**Fix:** Editar credencial en n8n → agregar Auth Token (32 caracteres de Twilio Console)
**Dónde encontrarlo:** console.twilio.com → Account Info → Auth Token (click en ojo 👁️)

---

## Deployment — Errores

### ❌ ERROR 10: Pegar URL del workflow en Twilio en lugar del webhook
**Síntoma:** Twilio no conecta con n8n
**Causa:** Se pegó `https://diegolanderos.app.n8n.cloud/workflow/UPXhUcXnnMw2PNzX` en lugar del webhook
**URL correcta:** `https://diegolanderos.app.n8n.cloud/webhook/smile-design`
**Regla:** La URL de Twilio es SIEMPRE `https://[instancia].app.n8n.cloud/webhook/[path]` — NO la URL del workflow

---

## Lo que SÍ funciona bien (confirmar antes de cambiar)

- IF node typeVersion 1 para routing ✅
- Twilio node async para enviar mensajes ✅
- `alwaysOutputData: true` + `onError: continueRegularOutput` en Obtener Memoria ✅
- Schema precargado en appendOrUpdate ✅
- `responseMode: "onReceived"` en Webhook ✅
