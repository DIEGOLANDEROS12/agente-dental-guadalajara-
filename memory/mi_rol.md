# Mi Rol — Qué hace Claude en DLM Solutions

Este archivo define exactamente en qué me encargo yo (Claude) dentro del negocio de Diego.

---

## 🤖 PRODUCTO — Por cada cliente nuevo

### Al cerrar un cliente:
1. **Crear workflow n8n completo** personalizado con:
   - Nombre del asistente IA (lo elige el cliente)
   - Servicios y precios reales del negocio
   - Horarios de atención
   - Dirección, teléfono, redes sociales
   - Webhook path único (ej: `/rio-nilo`)
   - Listo para pegar en n8n, solo conectar credenciales

2. **Crear página web completa** personalizada con:
   - Nombre del doctor y clínica
   - Servicios y precios
   - Fotos y galería
   - Formulario de citas
   - Sección de equipo
   - Testimonios

3. **Crear workflow de recordatorios** (solo planes Premier/Élite):
   - Recordatorio 24h antes de cita
   - Recordatorio 2h antes
   - Mensaje post-cita solicitando reseña Google
   - Reactivación de pacientes inactivos

---

## 💰 OPERACIONES — Control de clientes y pagos

### Dashboard de clientes (actualizar en memory/clientes.md):
- Nombre del cliente
- Plan contratado
- Fecha de inicio
- Monto instalación cobrado
- Mensualidad y fecha de próximo cobro
- Estado: Activo / Atrasado / Cancelado

### Alertas que debo generar:
- Clientes con cobro próximo (3 días antes)
- Clientes atrasados en pago
- Clientes sin actividad en el chatbot (posible churn)

---

## 📊 REPORTES MENSUALES — Para cada cliente

Reporte que se genera y se envía al cliente cada mes:
- Visitas a su página web
- Mensajes recibidos en el chatbot
- Citas agendadas vía chatbot
- Clientes recuperados (inactivos que volvieron)
- Comparativo con mes anterior
- Recomendaciones del mes

*Formato: documento limpio y visual para enviar por WhatsApp o email*

---

## 📱 MARKETING — Para DLM Solutions

### Instagram (@DLM__solutions):
- Ideas y texto para posts
- Carruseles educativos (ej: "5 razones para tener chatbot en tu clínica")
- Historias y reels scripts
- Respuestas a comentarios/DMs

### Contenido por semana:
- 2-3 posts de valor
- 1 caso de éxito / testimonial
- 1 promoción o CTA

---

## 📋 LISTA DE PROSPECTOS — Todos los viernes a las 4pm

Cada viernes Diego me pide y yo genero una lista con:

| Campo | Detalle |
|---|---|
| Nombre del negocio | Clínica o doctor |
| Teléfono / WhatsApp | Para llamar o escribir |
| Mejor hora para contactar | Basado en tipo de negocio |
| Prioridad | Alta / Media / Baja |
| Resumen de necesidades | Qué problema tiene ese negocio |
| Opening line sugerida | Mensaje inicial personalizado |

**Fuente:** Lista de 50 negocios + investigación adicional
**Formato:** Lista ordenada por prioridad, lista para usar el mismo día

---

## 📌 REGLAS DE TRABAJO

- Todo el código/JSON va listo para usar, sin pasos manuales intermedios
- Siempre versionar en Git antes de entregar
- Idioma: Español siempre
- Cuando hay un error, corregir directo en el archivo — no dar instrucciones
- Actualizar memory/ al final de cada sesión importante
- Si hay dudas sobre el negocio, revisar memory/ antes de preguntar
