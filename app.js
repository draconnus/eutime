document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    document.getElementById('add-traveler').addEventListener('click', createTraveler);
});

function renderCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = date.getDate();
        dayElement.dataset.date = date.toISOString().split('T')[0];
        dayElement.addEventListener('click', selectDay);
        calendarContainer.appendChild(dayElement);
    }
}

function createTraveler() {
    const travelerName = document.getElementById('traveler-name').value;
    if (!travelerName) return;

    let travelers = JSON.parse(localStorage.getItem('travelers')) || [];
    travelers.push({ name: travelerName, selectedDays: [] });
    localStorage.setItem('travelers', JSON.stringify(travelers));

    document.getElementById('traveler-name').value = '';
}

function selectDay(event) {
    const selectedDate = event.target.dataset.date;
    const travelers = JSON.parse(localStorage.getItem('travelers')) || [];
    const traveler = travelers[0]; // Assuming single traveler for simplicity

    if (!traveler.selectedDays.includes(selectedDate)) {
        traveler.selectedDays.push(selectedDate);
        event.target.classList.add('selected');
    } else {
        traveler.selectedDays = traveler.selectedDays.filter(date => date !== selectedDate);
        event.target.classList.remove('selected');
    }

    localStorage.setItem('travelers', JSON.stringify(travelers));
    calculateMaxDaysIn180(traveler.selectedDays);
}

function calculateMaxDaysIn180(selectedDays) {
    const daysIn180 = [];
    const maxDays = 90;

    selectedDays.forEach(date => {
        const currentDate = new Date(date);
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 179);

        const daysInRange = selectedDays.filter(d => {
            const dDate = new Date(d);
            return dDate >= startDate && dDate <= currentDate;
        });

        daysIn180.push(daysInRange.length);
    });

    const maxDaysIn180 = Math.max(...daysIn180);
    console.log(`Maximum days in 180-day window: ${maxDaysIn180}`);
}
