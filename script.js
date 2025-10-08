function getFirstThursdayOfMonth(year, month) {
    const date = new Date(year, month, 1);
    const day = date.getDay();
    const firstThursday = day === 4 ? 1 : ((4 - day + 7) % 7) + 1;
    return new Date(year, month, firstThursday, 18, 45, 0);
}

// Optional: Set a custom target date here (year, monthIndex (0–11), day, hour, minute)
let customDate = new Date(2025, 9, 9, 19, 0, 0); // May 10, 2025 at 8:00 PM

function updateCountdown() {
    const now = new Date();
    let targetDate = null;

    if (customDate && customDate > now) {
        targetDate = customDate;
    } else {
        targetDate = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth());
        if (targetDate < now) {
            targetDate = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth() + 1);
        }
    }

    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();
