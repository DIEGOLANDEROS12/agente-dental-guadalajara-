# 🦷 Template Clínica Dental — Guía de Personalización

Este template está listo para reutilizarse con cada cliente.
Solo cambia los datos marcados abajo.

---

## ✏️ Datos que cambiar por cliente

### En `index.html`

| Qué buscar | Qué poner |
|---|---|
| `Dra. Elizabeth Priccillo` | Nombre del cliente |
| `Clínica Dental` | Nombre de la clínica (si es diferente) |
| `+52 33 1234 5678` | Teléfono real del cliente |
| `contacto@draelizabethpriccillo.com` | Correo real del cliente |
| `Av. Chapultepec 123, Guadalajara, Jalisco` | Dirección real |
| `Lun–Vie: 9:00 – 19:00 \| Sáb: 9:00 – 14:00` | Horario real |
| Nombres del equipo (`Dr. Carlos Rodríguez`, `Dra. Ana Martínez`) | Equipo real |
| Especialidades del equipo | Especialidades reales |
| Testimonios (nombres: `Laura Gómez`, etc.) | Testimonios reales o genéricos |

### Imágenes (opcional)
Las imágenes vienen de Unsplash (gratuitas).
Si el cliente tiene fotos propias, reemplaza las URLs `https://images.unsplash.com/...`

---

## 🚀 Cómo usar para un nuevo cliente

1. Descarga los 3 archivos: `index.html`, `styles.css`, `script.js`
2. Abre `index.html` con un editor de texto (Notepad, VS Code, etc.)
3. Usa **Buscar y Reemplazar** (Ctrl+H) para cambiar los datos
4. Guarda y listo

### Búsqueda y reemplazo rápido (Ctrl+H en VS Code)
```
Buscar:   Dra. Elizabeth Priccillo
Reemplazar: Nombre del nuevo cliente
```
```
Buscar:   +52 33 1234 5678
Reemplazar: teléfono nuevo
```
```
Buscar:   contacto@draelizabethpriccillo.com
Reemplazar: correo nuevo
```

---

## 📁 Archivos del proyecto

```
index.html   → Estructura y contenido
styles.css   → Diseño visual
script.js    → Popups, formulario, animaciones
```

---

## 🎨 Cambiar colores (opcional)

Abre `styles.css` y busca `:root` al inicio:
```css
:root {
  --blue: #0d6efd;       ← Color principal
  --blue-dark: #0a58ca;  ← Color hover
  --teal: #0dcaf0;       ← Color acento
}
```
Cambia los códigos de color según la marca del cliente.
