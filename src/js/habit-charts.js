document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('charts-title').textContent = `Διαγράμματα Συνηθειών (${username})`;
    }

    fetch('http://127.0.0.1:3003/api/getNextStepData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userNextStep = data.find(user => user.userId === username);

            if (userNextStep) {
                const dates = userNextStep.days.map(day => day.date);
                const sleepHours = userNextStep.days.map(day => parseFloat(day.sleepHours));
                const waterLiters = userNextStep.days.map(day => parseFloat(day.waterLiters));
                const alcoholGlasses = userNextStep.days.map(day => parseFloat(day.alcoholGlasses));
                const stressLevels = userNextStep.days.map(day => parseFloat(day.stressLevel));

                // Δημιουργία διαγραμμάτων
                createChart('waterChart', 'Νερό ανά Ημέρα', dates, [
                    { label: 'Νερό', data: waterLiters, borderColor: 'blue' }
                ]);

                createChart('sleepChart', 'Ύπνος ανά Ημέρα', dates, [
                    { label: 'Ύπνος', data: sleepHours, borderColor: 'green' }
                ]);

                createChart('stressChart', 'Στρες ανά Ημέρα', dates, [
                    { label: 'Στρες', data: stressLevels, borderColor: 'red' }
                ]);

                createChart('alcoholChart', 'Αλκοόλ ανά Ημέρα', dates, [
                    { label: 'Αλκοόλ', data: alcoholGlasses, borderColor: 'purple' }
                ]);
            }
        })
        .catch(error => console.error('Error fetching next step data:', error));

    const chartWrappers = [
        'waterChartWrapper',
        'sleepChartWrapper',
        'stressChartWrapper',
        'alcoholChartWrapper'
    ];

    let currentChartIndex = 0;

    document.getElementById('nextHabitChartButton').addEventListener('click', function() {
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