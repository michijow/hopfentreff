function getFirstThursdayOfMonth(year, month) {
    const date = new Date(year, month, 1);
    const day = date.getDay();
    const firstThursday = day === 4 ? 1 : ((4 - day + 7) % 7) + 1;
    return new Date(year, month, firstThursday, 18, 30, 0);
}

// Optional: Set a custom target date here (year, monthIndex (0–11), day, hour, minute)
let customDate = new Date(2026, 9, 20, 18, 30, 0); // February 11, 2026 at 18:30
let currentIcsUrl = null;

function getTargetDate() {
    const now = new Date();
    if (customDate && customDate > now) {
        return customDate;
    }

    let targetDate = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth());
    if (targetDate < now) {
        targetDate = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth() + 1);
    }
    return targetDate;
}

function formatUtcCalendarDate(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

function buildIcsContent(targetDate) {
    const eventStart = formatUtcCalendarDate(targetDate);
    const eventEnd = formatUtcCalendarDate(new Date(targetDate.getTime() + 4 * 60 * 60 * 1000));
    const dtstamp = formatUtcCalendarDate(new Date());
    const uid = `hopfentreff-${targetDate.getTime()}@hopfentreff.de`;
    const dateString = targetDate.toLocaleDateString('de-DE');
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

function updateCalendarLink(targetDate) {
    const link = document.getElementById('ical-link');
    if (!link) return;

    const icsText = buildIcsContent(targetDate);
    const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
    if (currentIcsUrl) {
        URL.revokeObjectURL(currentIcsUrl);
    }
    currentIcsUrl = URL.createObjectURL(blob);
    link.href = currentIcsUrl;
}

function updateCountdown() {
    const now = new Date();
    const targetDate = getTargetDate();
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    updateCalendarLink(targetDate);
}

setInterval(updateCountdown, 1000);
updateCountdown();
