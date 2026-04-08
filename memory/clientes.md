# Clientes y Prospectos

## Clientes Activos

### Clínica Dental Río Nilo — Dr. Josue
- **Estado:** En configuración
- **Contacto:** Dr. Josue
- **Nombre clínica:** Clínica Dental Río Nilo
- **Workflow:** Pendiente crear (adaptar 06_marcela_smile_design.json)
- **Web:** https://diegolanderos12.github.io/agente-dental-guadalajara-/ ✅ Actualizada
- **Agente IA:** Por definir nombre del asistente
- **Servicios/precios:** Por obtener del cliente
- **Horarios:** Por obtener del cliente
- **Notas:** Primer cliente real del negocio

---

## Template Activo (Demo)

### Smile Design Studio Guadalajara
- **Archivo:** `06_marcela_smile_design.json`
- **Agente:** Marcela
- **Webhook path:** `smile-design`
- **Twilio número:** +1 415 523 8886 (sandbox)
- **Sheets:** https://docs.google.com/spreadsheets/d/10D2JPQEAkqazj64_LPYvsYNomxdDzcayQZefyHtnwoA/edit
- **Estado Twilio:** Trial — límite 5 mensajes/día

---

## Pipeline de Prospectos (de 01_50_negocios_opening_lines.md)

### Prioridad Alta (más reseñas, más potencial)
1. Dentalia Gran Plaza — 400+ reseñas
2. Dental La Zapopana — 500+ reseñas, 10 sucursales
3. Clínica Dental Americana — 200+ reseñas, pacientes internacionales
4. Implantes Dentales GDL — 140+ reseñas
5. Smile Design Studio — 130+ reseñas (ya es demo)

### Prioridad Media
6. Clínica Dental Integral Chapalita — 95+ reseñas
7. Centro Dental Vallarta — 110+ reseñas
8. CEADENT Clínica Dental — 100+ reseñas
9. Dental del Bosque Tlaquepaque — 120+ reseñas

---

## Proceso de Onboarding para Nuevo Cliente

1. **Información a recopilar:**
   - Nombre completo de la clínica
   - Nombre del doctor(a)
   - Dirección
   - Teléfono / WhatsApp
   - Horarios
   - Servicios y precios
   - Nombre del asistente virtual (lo elige el cliente)

2. **Archivos a crear:**
   - Nuevo JSON workflow (basado en `06_marcela_smile_design.json`)
   - Actualizar página web (basada en `index.html`)

3. **Configuración cliente en n8n:**
   - Nuevo webhook path (ej: `/rio-nilo`)
   - Conectar sus credenciales Google
   - Actualizar URL en Twilio
   - Crear pestañas en su Google Sheet

4. **Entrega:**
   - JSON del workflow
   - Instrucciones de configuración
   - Acceso a Google Sheet
   - Capacitación básica (30 min)
