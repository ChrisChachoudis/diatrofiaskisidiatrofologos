document.addEventListener('DOMContentLoaded', function() {
    const selectedDate = localStorage.getItem('selectedDate');
    if (selectedDate) {
        document.getElementById('selected-date').textContent = `Ημερομηνία: ${selectedDate}`;
    }

    document.getElementById('next-step-form').addEventListener('submit', submitNextStep);
});

function submitNextStep(event) {
    event.preventDefault();

    const selectedDate = localStorage.getItem('selectedDate');
    const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
    if (!username) {
        console.error('Username is not set in localStorage');
        return;
    }

    const sleepHours = parseFloat(document.getElementById('sleep-hours').value);
    const waterLiters = parseFloat(document.getElementById('water-liters').value);
    const alcoholGlasses = parseInt(document.getElementById('alcohol-glasses').value, 10);
    const stressLevel = parseInt(document.getElementById('stress-level').value, 10);

    const nextStepData = {
        date: selectedDate,
        userId: username,
        sleepHours: sleepHours,
        waterLiters: waterLiters,
        alcoholGlasses: alcoholGlasses,
        stressLevel: stressLevel
    };

    // Send next step data to the server
    fetch('http://127.0.0.1:3003/api/saveNextStepData', { // Χρησιμοποιήστε τον νέο διακομιστή
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nextStepData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Τα δεδομένα καταχωρήθηκαν επιτυχώς!');
        } else {
            alert('Σφάλμα κατά την καταχώρηση των δεδομένων.');
        }
    })
    .catch(error => console.error('Σφάλμα κατά την αποστολή των δεδομένων:', error));
}