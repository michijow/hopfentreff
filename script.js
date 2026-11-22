let currentIcsUrl = null;

function formatUtcCalendarDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

function buildIcsContent(targetDate, durationHours) {
    const eventStart = formatUtcCalendarDate(targetDate);
    const eventEnd = formatUtcCalendarDate(new Date(targetDate.getTime() + durationHours * 60 * 60 * 1000));
    const dtstamp = formatUtcCalendarDate(new Date());
    const uid = `hopfentreff-${targetDate.getTime()}@hopfentreff.de`;
    const monthString = targetDate.toLocaleDateString('de-DE', { month: 'long' });

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'PRODID:-//Hopfentreff//EN',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${eventStart}`,
        `DTEND:${eventEnd}`,
        'SUMMARY:Hopfentreff',
        `DESCRIPTION:Hopfentreff im ${monthString}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
}

function updateCalendarLink() {
    const link = document.getElementById('ical-link');
    if (!link) return;

    const [year, month, day] = link.dataset.date.split('-').map(Number);
    const [hours, minutes] = link.dataset.time.split(':').map(Number);
    const durationHours = Number(link.dataset.duration) || 3;
    const targetDate = new Date(year, month - 1, day, hours, minutes, 0);
    const icsText = buildIcsContent(targetDate, durationHours);
    const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
    if (currentIcsUrl) {
        URL.revokeObjectURL(currentIcsUrl);
    }
    currentIcsUrl = URL.createObjectURL(blob);
    link.href = currentIcsUrl;
}

updateCalendarLink();
