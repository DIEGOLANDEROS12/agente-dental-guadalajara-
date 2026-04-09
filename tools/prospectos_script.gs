// ============================================================
//  DLM Solutions — Prospecting Sheet Auto-Fill
//  Pega un link de Google Maps en columna A → se rellena solo
//
//  SETUP: Reemplaza TU_API_KEY_AQUI con tu Google Maps API Key
// ============================================================

const API_KEY = 'TU_API_KEY_AQUI';

// ── Se activa automáticamente al pegar una URL en columna A ──
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // Solo columna A, desde fila 2
  if (range.getColumn() !== 1 || range.getRow() <= 1) return;

  const url = String(range.getValue()).trim();
  if (!url) return;

  const esMapsUrl = url.includes('google.com/maps') ||
                    url.includes('maps.app.goo.gl') ||
                    url.includes('goo.gl/maps');
  if (!esMapsUrl) return;

  const row = range.getRow();
  sheet.getRange(row, 2).setValue('⏳ Buscando...');

  try {
    llenarDatosClinica(sheet, row, url);
  } catch (err) {
    sheet.getRange(row, 2).setValue('❌ Error: ' + err.message);
  }
}

// ── Lógica principal: busca en Places API y rellena la fila ──
function llenarDatosClinica(sheet, row, url) {
  let fullUrl = url;

  // Seguir redirects para links cortos (goo.gl)
  if (url.includes('goo.gl')) {
    const resp = UrlFetchApp.fetch(url, {
      followRedirects: true,
      muteHttpExceptions: true
    });
    fullUrl = resp.getFinalUrl() || url;
  }

  // Extraer nombre del negocio de la URL
  let nombreBusqueda = '';
  const match = fullUrl.match(/\/place\/([^\/@\?]+)/);
  if (match) {
    nombreBusqueda = decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  if (!nombreBusqueda) {
    sheet.getRange(row, 2).setValue('No se pudo leer la URL. Copia el link directamente de Google Maps.');
    return;
  }

  // Buscar el lugar por nombre (centrado en GDL)
  const busquedaUrl =
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json' +
    '?input=' + encodeURIComponent(nombreBusqueda) +
    '&inputtype=textquery' +
    '&fields=place_id' +
    '&locationbias=circle:60000@20.6597,-103.3496' + // Centro Guadalajara
    '&key=' + API_KEY +
    '&language=es';

  const busquedaResp = JSON.parse(UrlFetchApp.fetch(busquedaUrl).getContentText());

  if (!busquedaResp.candidates || busquedaResp.candidates.length === 0) {
    sheet.getRange(row, 2).setValue('No encontrado: "' + nombreBusqueda + '"');
    return;
  }

  const placeId = busquedaResp.candidates[0].place_id;

  // Obtener detalles completos del lugar
  const detallesUrl =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    '?place_id=' + placeId +
    '&fields=name,formatted_phone_number,opening_hours,formatted_address,rating,user_ratings_total,website' +
    '&key=' + API_KEY +
    '&language=es';

  const detallesResp = JSON.parse(UrlFetchApp.fetch(detallesUrl).getContentText());

  if (detallesResp.status !== 'OK') {
    sheet.getRange(row, 2).setValue('Error de API: ' + detallesResp.status);
    return;
  }

  const p = detallesResp.result;

  // Formatear horarios
  let horarios = 'No disponible';
  let mejorHora = '10:00 – 11:30 AM';

  if (p.opening_hours && p.opening_hours.weekday_text) {
    horarios = p.opening_hours.weekday_text.join('\n');
    mejorHora = calcularMejorHora(p.opening_hours.weekday_text);
  }

  // Estado de página web
  const tieneWeb = p.website ? '✅ Sí — ' + p.website : '❌ Sin página web';

  // Escribir datos en la fila
  sheet.getRange(row, 2, 1, 8).setValues([[
    p.name || nombreBusqueda,
    p.formatted_phone_number || '',
    p.formatted_address || '',
    p.rating || '',
    p.user_ratings_total || '',
    horarios,
    mejorHora,
    tieneWeb
  ]]);

  // Agregar checkbox para "Agendado Demo"
  sheet.getRange(row, 10).insertCheckboxes();

  // Colorear fila según prioridad
  const reseñas  = p.user_ratings_total || 0;
  const rating   = p.rating || 0;
  const sinWeb   = !p.website;
  let color      = '#ffffff';

  if (sinWeb && rating >= 4.7 && reseñas >= 30) {
    color = '#c6efce'; // 🟢 Alta prioridad
  } else if (sinWeb && rating >= 4.3) {
    color = '#ffeb9c'; // 🟡 Media prioridad
  } else if (!sinWeb) {
    color = '#ffc7ce'; // 🔴 Ya tiene web
  }

  sheet.getRange(row, 1, 1, 12).setBackground(color);
}

// ── Calcula la mejor hora para llamar según horario de apertura ──
function calcularMejorHora(weekdayText) {
  try {
    const lunes = weekdayText[0] || '';
    if (lunes.toLowerCase().includes('cerrado')) return 'Ver otro día';

    const match = lunes.match(/(\d{1,2}):(\d{2})\s*(a\.\s*m\.|p\.\s*m\.)/i);
    if (!match) return '10:00 – 11:30 AM';

    let hora    = parseInt(match[1]);
    const min   = parseInt(match[2]);
    const ampm  = match[3].replace(/[\s\.]/g, '').toLowerCase();

    if (ampm === 'pm' && hora !== 12) hora += 12;
    if (ampm === 'am' && hora === 12) hora = 0;

    // 30 minutos después de abrir
    let inicioMin = hora * 60 + min + 30;
    let finMin    = inicioMin + 90;

    const fmt = (totalMin) => {
      const h  = Math.floor(totalMin / 60);
      const m  = totalMin % 60;
      const p  = h >= 12 ? 'PM' : 'AM';
      const hh = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${hh}:${String(m).padStart(2, '0')} ${p}`;
    };

    return `${fmt(inicioMin)} – ${fmt(finMin)}`;
  } catch (e) {
    return '10:00 – 11:30 AM';
  }
}

// ── Configura el sheet por primera vez (corre esto una sola vez) ──
function configurarSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('Prospectos DLM');

  if (!sheet) {
    sheet = ss.insertSheet('Prospectos DLM');
  }

  sheet.clear();
  sheet.clearFormats();

  const headers = [
    'URL Google Maps',
    'Nombre',
    'Teléfono',
    'Dirección / Colonia',
    'Rating ⭐',
    '# Reseñas',
    'Horarios',
    'Mejor Hora para Llamar',
    'Tiene Página Web',
    'Agendado Demo ✓',
    'Hora / Fecha Demo',
    'Notas'
  ];

  // Encabezados con estilo
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setValues([headers])
    .setBackground('#1a472a')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('center')
    .setWrap(false);

  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);

  // Anchos de columna
  const anchos = [230, 200, 130, 230, 75, 85, 210, 155, 210, 130, 150, 200];
  anchos.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // Leyenda de colores en fila 2 (placeholder)
  sheet.getRange(2, 1).setValue('← Pega aquí el link de Google Maps');
  sheet.getRange(2, 1).setFontColor('#888888').setFontStyle('italic');

  SpreadsheetApp.getUi().alert(
    '✅ Sheet listo\n\n' +
    'Pega cualquier link de Google Maps en la columna A y el resto se llena automáticamente.\n\n' +
    '🟢 Verde  = Alta prioridad (sin web, +4.7★, +30 reseñas)\n' +
    '🟡 Amarillo = Media prioridad (sin web)\n' +
    '🔴 Rojo   = Ya tiene página web'
  );
}
