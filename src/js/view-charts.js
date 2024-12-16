document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('charts-title').textContent = `Διαγράμματα (${username})`;
    }

    fetch('http://127.0.0.1:3002/api/getMealRatings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userMeals = data.find(user => user.userId === username);

            if (userMeals) {
                const dates = userMeals.days.map(day => day.date);
                const totalCalories = userMeals.days.map(day => parseFloat(day.totalCalories));
                const totalCarbs = userMeals.days.map(day => parseFloat(day.totalCarbs));
                const totalProtein = userMeals.days.map(day => parseFloat(day.totalProtein));
                const totalFat = userMeals.days.map(day => parseFloat(day.totalFat));
                const totalSugar = userMeals.days.map(day => parseFloat(day.totalSugar));
                const totalFiber = userMeals.days.map(day => parseFloat(day.totalFiber));
                const averageRatings = userMeals.days.map(day => parseFloat(day.averageRating));

                // Δημιουργία διαγραμμάτων
                createChart('macrosChart', 'Μακροστοιχεία', dates, [
                    { label: 'Θερμίδες', data: totalCalories, borderColor: 'red' },
                    { label: 'Υδατάνθρακες', data: totalCarbs, borderColor: 'blue' },
                    { label: 'Πρωτεΐνη', data: totalProtein, borderColor: 'green' },
                    { label: 'Λίπος', data: totalFat, borderColor: 'purple' },
                    { label: 'Σάκχαρα', data: totalSugar, borderColor: 'orange' },
                    { label: 'Φυτικές Ίνες', data: totalFiber, borderColor: 'brown' }
                ]);

                createChart('averageRatingChart', 'Μ.Ο. Βαθμού Γεύματος', dates, [
                    { label: 'Μ.Ο. Βαθμού Γεύματος', data: averageRatings, borderColor: 'blue' }
                ]);
            }
        })
        .catch(error => console.error('Error fetching meal ratings:', error));

    const chartWrappers = [
        'macrosChartWrapper',
        'averageRatingChartWrapper'
    ];

    let currentChartIndex = 0;

    document.getElementById('nextChartButton').addEventListener('click', function() {
        const currentChartWrapper = document.getElementById(chartWrappers[currentChartIndex]);
        currentChartWrapper.classList.add('fade-out');
        setTimeout(() => {
            currentChartWrapper.style.display = 'none';
            currentChartIndex = (currentChartIndex + 1) % chartWrappers.length;
            const nextChartWrapper = document.getElementById(chartWrappers[currentChartIndex]);
            nextChartWrapper.style.display = 'block';
            nextChartWrapper.classList.add('fade-in');
        }, 500);
    });
});

function createChart(canvasId, title, labels, datasets) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets.map(dataset => ({
                ...dataset,
                fill: false,
                borderWidth: 2
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Προσθήκη αυτής της γραμμής για να επιτρέψετε την αλλαγή μεγέθους
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Ημερομηνίες'
                    },
                    ticks: {
                        color: '#000' // Μαύροι αριθμοί στον άξονα x
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Τιμές'
                    },
                    ticks: {
                        color: '#000' // Μαύροι αριθμοί στον άξονα y
                    }
                }
            }
        }
    });
}