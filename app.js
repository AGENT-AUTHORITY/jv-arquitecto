'use strict';

// El enlace de reserva se agrega cuando Javier confirme su agenda real.
const SITE_CONFIG = Object.freeze({
  contactEmail: 'vconstructivo@gmail.com',
  bookingUrl: '',
  timeZone: 'America/Argentina/Buenos_Aires'
});

function todayInArgentina() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: SITE_CONFIG.timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return new Date(Number(values.year), Number(values.month) - 1, Number(values.day), 12);
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const today = todayInArgentina();
let month = new Date(today.getFullYear(), today.getMonth(), 1, 12);
let selection = '';
const calendarDays = document.getElementById('calendar-days');
const monthLabel = document.getElementById('calendar-month');
const previous = document.getElementById('previous-month');
const next = document.getElementById('next-month');
const selectedLabel = document.getElementById('date-selection');
const hiddenDate = document.getElementById('preferred-date');
const clearDate = document.getElementById('clear-date');
const meetingType = document.getElementById('meeting-type');
const meetingHours = document.getElementById('meeting-hours');

function updateHours() {
  const oldValue = meetingHours.value;
  const saturday = selection && new Date(`${selection}T12:00:00`).getDay() === 6;
  const remote = ['telefonica', 'video'].includes(meetingType.value);
  const weekday = remote ? 'Lunes a viernes · 10:00 a 12:00' : 'Lunes a viernes · 16:00 a 19:00';
  const weekend = 'Sábado · 09:00 a 12:00 · A coordinar';
  const options = saturday ? [weekend] : selection ? [weekday] : [weekday, weekend];
  meetingHours.replaceChildren(...options.map(value => new Option(value, value)));
  if (options.includes(oldValue)) meetingHours.value = oldValue;
}
meetingType.addEventListener('change', updateHours);
updateHours();

const longDate = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const monthFormat = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });

function renderCalendar() {
  monthLabel.textContent = monthFormat.format(month);
  calendarDays.replaceChildren();
  const leading = (month.getDay() + 6) % 7;
  for (let i = 0; i < leading; i++) {
    const blank = document.createElement('span');
    blank.setAttribute('aria-hidden', 'true');
    calendarDays.append(blank);
  }
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0, 12).getDate();
  for (let day = 1; day <= count; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day, 12);
    const key = dateKey(date);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(day);
    button.disabled = date < today || date.getDay() === 0;
    button.setAttribute('aria-label', `${longDate.format(date)}, fecha preferida a confirmar`);
    button.setAttribute('aria-pressed', String(key === selection));
    if (key === dateKey(today)) button.classList.add('today');
    if (key === selection) button.classList.add('selected');
    button.addEventListener('click', () => {
      selection = key;
      hiddenDate.value = key;
      updateHours();
      selectedLabel.textContent = longDate.format(date);
      clearDate.hidden = false;
      renderCalendar();
      const active = calendarDays.querySelector('[aria-pressed="true"]');
      if (active) active.focus({ preventScroll: true });
    });
    calendarDays.append(button);
  }
  previous.disabled = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
}

previous.addEventListener('click', () => {
  if (previous.disabled) return;
  month = new Date(month.getFullYear(), month.getMonth() - 1, 1, 12);
  renderCalendar();
});
next.addEventListener('click', () => {
  month = new Date(month.getFullYear(), month.getMonth() + 1, 1, 12);
  renderCalendar();
});
clearDate.addEventListener('click', () => {
  selection = '';
  hiddenDate.value = '';
  updateHours();
  selectedLabel.textContent = 'Fecha a coordinar';
  clearDate.hidden = true;
  renderCalendar();
  next.focus({ preventScroll: true });
});
renderCalendar();
document.getElementById('year').textContent = String(today.getFullYear());

if (SITE_CONFIG.bookingUrl) {
  try {
    const url = new URL(SITE_CONFIG.bookingUrl);
    if (url.protocol === 'https:') {
      document.getElementById('booking-link').href = url.href;
      document.getElementById('live-booking').hidden = false;
    }
  } catch (_) { /* Mantener la solicitud por correo si no hay una URL válida. */ }
}

const form = document.getElementById('consultation-form');
const result = document.getElementById('request-result');
const summary = document.getElementById('request-summary');
const send = document.getElementById('send-request');
const copyStatus = document.getElementById('copy-status');
let message = '';

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const value = name => String(values.get(name) || '').trim();
  const date = value('fecha') ? longDate.format(new Date(`${value('fecha')}T12:00:00`)) : 'A coordinar';
  message = [
    'Hola Javier, quiero consultar por una propiedad.', '',
    `Nombre: ${value('nombre')}`,
    `Correo: ${value('email')}`,
    `Zona: ${value('zona')}`,
    `Situación: ${value('situacion')}`,
    ...(value('enlace') ? [`Enlace del aviso: ${value('enlace')}`] : []),
    `Fecha preferida: ${date}`,
    `Tipo de encuentro: ${meetingType.options[meetingType.selectedIndex].text}`,
    `Franja preferida: ${value('horario')} (hora de Argentina)`,
    '', 'Mi objetivo:', value('objetivo'), '',
    'Entiendo que la fecha, el alcance y los honorarios se confirman antes de contratar.'
  ].join('\n');
  summary.textContent = message;
  const subject = encodeURIComponent(`Consulta de propiedad · ${value('zona')}`);
  send.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${encodeURIComponent(message)}`;
  copyStatus.textContent = '';
  form.hidden = true;
  result.hidden = false;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('edit-request').addEventListener('click', () => {
  form.hidden = false;
  result.hidden = true;
  form.querySelector('input[name="nombre"]').focus({ preventScroll: true });
});

document.getElementById('copy-request').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = 'Consulta copiada. Podés pegarla en tu correo o compartirla con Javier.';
  } catch (_) {
    const range = document.createRange();
    range.selectNodeContents(summary);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Seleccionamos el texto para que puedas copiarlo manualmente.';
  }
});
