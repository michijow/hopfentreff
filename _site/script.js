function getFirstThursdayOfMonth(year, month) {
    const date = new Date(year, month, 1);
    const day = date.getDay();
    const firstThursday = day === 4 ? 1 : ((4 - day + 7) % 7) + 1;
    return new Date(year, month, firstThursday, 18, 45, 0);
}

function updateCountdown() {
    const now = new Date();
    let firstThursday = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth());

    if (firstThursday < now) {
        firstThursday = getFirstThursdayOfMonth(now.getFullYear(), now.getMonth() + 1);
    }

    const diff = firstThursday - now;
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
