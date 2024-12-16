document.addEventListener('DOMContentLoaded', function() {
    fetch('http://127.0.0.1:3002/api/getMealRatings')
        .then(response => response.json())
        .then(data => {
            const calendar = document.getElementById('calendar');
            const userId = localStorage.getItem('username'); // Assuming username is stored in localStorage

            const userMeals = data.find(user => user.userId === userId);
            if (userMeals) {
                // Φιλτράρισμα των τελευταίων 7 ημερομηνιών
                const sortedDays = userMeals.days.sort((a, b) => new Date(b.date) - new Date(a.date));
                const last7Days = sortedDays.slice(0, 7);

                last7Days.forEach(day => {
                    const dateElement = document.createElement('div');
                    dateElement.className = 'calendar-date';
                    dateElement.textContent = day.date;

                    let colorClass = '';
                    if (day.averageRating <= 1.5) {
                        colorClass = 'red-circle';
                    } else if (day.averageRating <= 2.3) {
                        colorClass = 'yellow-circle';
                    } else {
                        colorClass = 'green-circle';
                    }

                    dateElement.classList.add(colorClass);
                    calendar.appendChild(dateElement);
                });
            }
        })
        .catch(error => console.error('Error fetching meal ratings:', error));
});